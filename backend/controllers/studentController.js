import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../models/userModel.js";
import { findStudentByAdmissionNumber, createStudent } from "../models/studentModel.js";
import { createParent, linkStudentToParent } from "../models/parentModel.js";
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