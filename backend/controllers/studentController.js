import bcrypt from "bcrypt";
import { findUserByEmail, createUser, updateUser, deleteUser } from "../models/userModel.js"; // Added deleteUser
import { 
  findStudentByAdmissionNumber, 
  createStudent, 
  getStudentsList, 
  getStudentsCount, 
  findStudentById, 
  updateStudentInfo,
  getParentIdsByStudentId,
  deleteStudentParentRelationship,  // Added this
  deleteStudentOnly                 // Added this
} from "../models/studentModel.js";
import { createParent, linkStudentToParent, deleteParentRecord, findParentById } from "../models/parentModel.js";
import crypto from "crypto";

export async function registerStudent(req, res) {
  try {
    const { student, parent } = req.body;

    // Validate required fields
    if (!student || !parent) {
      return res.status(400).json({ message: "Student and parent information are required" });
    }

    // Validate student fields
    if (!student.email || !student.first_name || !student.last_name || !student.admission_number) {
      return res.status(400).json({ message: "Student email, name, and admission number are required" });
    }

    // Validate parent fields
    if (!parent.email || !parent.first_name || !parent.last_name || !parent.contact_number) {
      return res.status(400).json({ message: "Parent email, name, and contact number are required" });
    }

    // Check if student email already exists
    const existingStudent = await findUserByEmail(student.email);
    if (existingStudent) {
      return res.status(409).json({ message: "Student email already registered" });
    }

    // Check if parent email already exists
    const existingParent = await findUserByEmail(parent.email);
    if (existingParent) {
      return res.status(409).json({ message: "Parent email already registered" });
    }

    // Check if admission number already exists
    const existingAdmission = await findStudentByAdmissionNumber(student.admission_number);
    if (existingAdmission) {
      return res.status(409).json({ message: "Admission number already exists" });
    }

    // Generate a single password for both student and parent
    const sharedPassword = crypto.randomBytes(5).toString("base64").replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
    const passwordHash = await bcrypt.hash(sharedPassword, 10);

    // Create student user
    const studentUser = await createUser({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      password_hash: passwordHash,
      role: 'student',
      must_reset_password: true
    });

    const studentUserId = studentUser.insertId;

    // Create student record
    const studentRecord = await createStudent({
      user_id: studentUserId,
      admission_number: student.admission_number,
      date_of_birth: student.date_of_birth,
      grade: student.grade,
      section: student.section,
      address: student.address
    });

    const studentId = studentRecord.insertId;

    // Create parent user with the same password
    const parentUser = await createUser({
      first_name: parent.first_name,
      last_name: parent.last_name,
      email: parent.email,
      password_hash: passwordHash,
      role: 'parent',
      must_reset_password: true
    });

    const parentUserId = parentUser.insertId;

    // Create parent record
    const parentRecord = await createParent({
      user_id: parentUserId,
      contact_number: parent.contact_number
    });

    const parentId = parentRecord.insertId;

    // Link student to parent
    await linkStudentToParent(studentId, parentId);

    res.status(201).json({
      message: "Student and parent registered successfully",
      sharedPassword,
      student: {
        id: studentId,
        admission_number: student.admission_number,
        email: student.email
      },
      parent: {
        id: parentId,
        email: parent.email
      }
    });

  } catch (err) {
    console.error('Student registration error:', err);
    res.status(500).json({ message: "Server error" });
  }
} 

export async function getStudents(req, res) {
  try {
    const {
      page = 1,
      limit = 15,
      search = '',
      grade = '',
      section = ''
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Call model methods
    const students = await getStudentsList({
      search,
      grade,
      section,
      limit: parseInt(limit),
      offset
    });

    const totalCount = await getStudentsCount({
      search,
      grade,
      section
    });

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      students,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords: totalCount,
        limit: parseInt(limit),
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      message: 'Error fetching students'
    });
  }
}

export async function updateStudent(req, res) {
  try {
    const { studentId } = req.params;
    const { student } = req.body;

    // Validate required fields
    if (!student) {
      return res.status(400).json({ message: "Student information is required" });
    }

    if (!student.email || !student.first_name || !student.last_name || !student.admission_number) {
      return res.status(400).json({ message: "Student email, name, and admission number are required" });
    }

    // Get current student data to find user_id
    const currentStudent = await findStudentById(studentId);
    if (!currentStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if email is being changed and if new email already exists
    if (student.email !== currentStudent.email) {
      const existingUser = await findUserByEmail(student.email);
      if (existingUser && existingUser.user_id !== currentStudent.user_id) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    // Check if admission number is being changed and if new admission number already exists
    if (student.admission_number !== currentStudent.admission_number) {
      const existingAdmission = await findStudentByAdmissionNumber(student.admission_number);
      if (existingAdmission && existingAdmission.student_id !== parseInt(studentId)) {
        return res.status(409).json({ message: "Admission number already exists" });
      }
    }

    // Update user information
    await updateUser(currentStudent.user_id, {
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email
    });

    // Update student information
    await updateStudentInfo(studentId, {
      admission_number: student.admission_number,
      date_of_birth: student.date_of_birth,
      grade: student.grade,
      section: student.section,
      address: student.address
    });

    // Get updated student data
    const updatedStudent = await findStudentById(studentId);

    res.status(200).json({
      message: "Student updated successfully",
      student: {
        id: updatedStudent.student_id,
        admission_number: updatedStudent.admission_number,
        email: updatedStudent.email,
        first_name: updatedStudent.first_name,
        last_name: updatedStudent.last_name,
        grade: updatedStudent.grade,
        section: updatedStudent.section
      }
    });

  } catch (err) {
    console.error('Student update error:', err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteStudent(req, res) {
  try {
    const { studentId } = req.params;

    // Check if student exists
    const student = await findStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get associated parent (should be exactly one in your 1:1 system)
    const parentIds = await getParentIdsByStudentId(studentId);
    let deletedParent = null;

    // If parent exists, get their details before deletion
    if (parentIds.length > 0) {
      const parent = await findParentById(parentIds[0]);
      if (parent) {
        deletedParent = {
          id: parent.parent_id,
          name: `${parent.first_name} ${parent.last_name}`,
          email: parent.email
        };
      }
    }

    // CORRECT ORDER: Delete relationships first, then parent records, then user accounts
    
    // 1. Delete student_parents relationship (removes foreign key constraints)
    await deleteStudentParentRelationship(studentId);

    // 2. Delete parent record (now safe since relationship is gone)
    if (parentIds.length > 0) {
      const parent = await findParentById(parentIds[0]);
      if (parent) {
        await deleteParentRecord(parent.parent_id);
        await deleteUser(parent.user_id);
      }
    }

    // 3. Delete student record (now safe)
    await deleteStudentOnly(studentId);

    // 4. Delete student's user account
    await deleteUser(student.user_id);

    res.status(200).json({
      message: "Student and parent deleted successfully",
      deletedStudent: {
        id: student.student_id,
        name: `${student.first_name} ${student.last_name}`,
        admission_number: student.admission_number,
        email: student.email
      },
      deletedParent: deletedParent
    });

  } catch (err) {
    console.error('Student delete error:', err);
    res.status(500).json({ message: "Server error" });
  }
}