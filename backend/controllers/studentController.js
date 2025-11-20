import bcrypt from "bcrypt";
import fs from "fs";
import csvParser from "csv-parser";
import { findUserByEmail, createUser, updateUser, deleteUser, updatePassword, resetUserPasswordByAdmin } from "../models/userModel.js";
import { 
  findStudentByAdmissionNumber, 
  createStudent, 
  getStudentsList, 
  getStudentsCount, 
  findStudentById, 
  updateStudentInfo,
  getParentIdsByStudentId,
  deleteStudentParentRelationship,
  deleteStudentOnly,
  getStudentWithParents
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

// NEW FUNCTION: Get student with parent information
export async function getStudentParents(req, res) {
  try {
    const { studentId } = req.params;
    
    // Validate studentId
    if (!studentId || isNaN(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }
    
    const result = await getStudentWithParents(parseInt(studentId));
    
    if (!result) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.status(200).json({
      student: result.student,
      parent: result.parent
    });
    
  } catch (err) {
    console.error('Error fetching student with parents:', err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function bulkRegisterStudents(req, res) {
  const filePath = req.file?.path;

  try {
    if (!filePath) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const results = { successes: [], failures: [] };

    // Parse CSV with BOM handling
    const stream = fs.createReadStream(filePath).pipe(
      csvParser({
        skipEmptyLines: true,
        trim: true,
        mapHeaders: ({ header }) => header.replace(/^\uFEFF/, '').trim().replace(/^"|"$/g, ''),
      })
    );

    for await (const row of stream) {
      try {
        // Normalize headers - handle various formats
        const getField = (field) => {
          const variations = {
            student_first_name: ['student_first_name', 'Student First Name', 'studentFirstName'],
            student_last_name: ['student_last_name', 'Student Last Name', 'studentLastName'],
            student_email: ['student_email', 'Student Email', 'studentEmail'],
            admission_number: ['admission_number', 'Admission Number', 'admissionNumber'],
            date_of_birth: ['date_of_birth', 'Date of Birth', 'dateOfBirth', 'dob'],
            grade: ['grade', 'Grade'],
            section: ['section', 'Section'],
            address: ['address', 'Address'],
            parent_first_name: ['parent_first_name', 'Parent First Name', 'parentFirstName'],
            parent_last_name: ['parent_last_name', 'Parent Last Name', 'parentLastName'],
            parent_email: ['parent_email', 'Parent Email', 'parentEmail'],
            contact_number: ['contact_number', 'Contact Number', 'contactNumber', 'phone'],
          };
          
          for (const variant of variations[field] || []) {
            if (row[variant]) return row[variant].trim();
          }
          return null;
        };

        const student_first_name = getField('student_first_name');
        const student_last_name = getField('student_last_name');
        const student_email = getField('student_email');
        const admission_number = getField('admission_number');
        const date_of_birth = getField('date_of_birth');
        const grade = getField('grade');
        const section = getField('section');
        const address = getField('address');
        const parent_first_name = getField('parent_first_name');
        const parent_last_name = getField('parent_last_name');
        const parent_email = getField('parent_email');
        const contact_number = getField('contact_number');

        // Validate required student fields
        if (!student_first_name || !student_last_name || !student_email || !admission_number) {
          results.failures.push({
            admission_number: admission_number || "N/A",
            student_email: student_email || "N/A",
            reason: "Missing required student fields",
          });
          continue;
        }

        // Validate required parent fields
        if (!parent_first_name || !parent_last_name || !parent_email || !contact_number) {
          results.failures.push({
            admission_number,
            student_email,
            reason: "Missing required parent fields",
          });
          continue;
        }

        // Check if student email already exists
        const existingStudent = await findUserByEmail(student_email);
        if (existingStudent) {
          results.failures.push({ 
            admission_number, 
            student_email,
            reason: "Student email already exists" 
          });
          continue;
        }

        // Check if parent email already exists
        const existingParent = await findUserByEmail(parent_email);
        if (existingParent) {
          results.failures.push({ 
            admission_number, 
            student_email,
            reason: "Parent email already exists" 
          });
          continue;
        }

        // Check if admission number already exists
        const existingAdmission = await findStudentByAdmissionNumber(admission_number);
        if (existingAdmission) {
          results.failures.push({ 
            admission_number, 
            student_email,
            reason: "Admission number already exists" 
          });
          continue;
        }

        // Generate shared password
        const sharedPassword = crypto
          .randomBytes(5)
          .toString("base64")
          .replace(/[^a-zA-Z0-9]/g, "")
          .slice(0, 10);

        const passwordHash = await bcrypt.hash(sharedPassword, 10);

        // Create student user
        const studentUser = await createUser({
          first_name: student_first_name,
          last_name: student_last_name,
          email: student_email,
          password_hash: passwordHash,
          role: 'student',
          must_reset_password: true
        });

        const studentUserId = studentUser.insertId;

        // Create student record
        const studentRecord = await createStudent({
          user_id: studentUserId,
          admission_number: admission_number,
          date_of_birth: date_of_birth || null,
          grade: grade || null,
          section: section || null,
          address: address || null
        });

        const studentId = studentRecord.insertId;

        // Create parent user with the same password
        const parentUser = await createUser({
          first_name: parent_first_name,
          last_name: parent_last_name,
          email: parent_email,
          password_hash: passwordHash,
          role: 'parent',
          must_reset_password: true
        });

        const parentUserId = parentUser.insertId;

        // Create parent record
        const parentRecord = await createParent({
          user_id: parentUserId,
          contact_number: contact_number
        });

        const parentId = parentRecord.insertId;

        // Link student to parent
        await linkStudentToParent(studentId, parentId);

        results.successes.push({
          admission_number,
          student_email,
          student_first_name,
          student_last_name,
          parent_email,
          parent_first_name,
          parent_last_name,
          sharedPassword
        });

      } catch (rowError) {
        results.failures.push({
          admission_number: row.admission_number || "N/A",
          student_email: row.student_email || "N/A",
          reason: rowError.message || "Processing failed",
        });
      }
    }

    res.status(200).json(results);

  } catch (err) {
    console.error("Bulk student registration error:", err);
    res.status(500).json({ message: "Bulk registration failed" });
  } finally {
    if (filePath) {
      fs.promises.unlink(filePath).catch(console.error);
    }
  }
}

// Reset student password - FIXED VERSION
export async function resetStudentPassword(req, res) {
  try {
    const { studentId } = req.params;
    
    // Check if student exists
    const student = await findStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Generate new temp password
    const tempPassword = crypto
      .randomBytes(5)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 10);
    
    const password_hash = await bcrypt.hash(tempPassword, 10);
    
    // Use resetUserPasswordByAdmin instead of updatePassword to set must_reset_password flag
    await resetUserPasswordByAdmin(student.user_id, password_hash);
    
    res.json({ 
      message: "Student password reset successfully", 
      tempPassword,
      studentName: `${student.first_name} ${student.last_name}`,
      email: student.email
    });
  } catch (err) {
    console.error("Reset student password error:", err);
    res.status(500).json({ message: "Failed to reset student password" });
  }
}

// Reset parent password - FIXED VERSION
export async function resetParentPassword(req, res) {
  try {
    const { studentId } = req.params;
    
    // Get student to verify it exists
    const student = await findStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get parent information
    const parentIds = await getParentIdsByStudentId(studentId);
    if (parentIds.length === 0) {
      return res.status(404).json({ message: "Parent not found for this student" });
    }

    const parent = await findParentById(parentIds[0]);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    // Generate new temp password
    const tempPassword = crypto
      .randomBytes(5)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 10);
    
    const password_hash = await bcrypt.hash(tempPassword, 10);
    
    // Use resetUserPasswordByAdmin instead of updatePassword to set must_reset_password flag
    await resetUserPasswordByAdmin(parent.user_id, password_hash);
    
    res.json({ 
      message: "Parent password reset successfully", 
      tempPassword,
      parentName: `${parent.first_name} ${parent.last_name}`,
      email: parent.email
    });
  } catch (err) {
    console.error("Reset parent password error:", err);
    res.status(500).json({ message: "Failed to reset parent password" });
  }
}