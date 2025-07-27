import { pool } from "../config/db.js";

export async function createStudent(studentData) {
  const { user_id, admission_number, date_of_birth, grade, section, address } = studentData;
  
  const [result] = await pool.query(`
    INSERT INTO students (user_id, admission_number, date_of_birth, grade, section, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [user_id, admission_number, date_of_birth, grade, section, address]);
  
  return result;
}

export async function findStudentByAdmissionNumber(admission_number) {
  const [rows] = await pool.query(`
    SELECT s.*, u.first_name, u.last_name, u.email, u.role
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.admission_number = ?
  `, [admission_number]);
  
  return rows[0];
}

export async function findStudentByUserId(user_id) {
  const [rows] = await pool.query(`
    SELECT s.*, u.first_name, u.last_name, u.email, u.role
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.user_id = ?
  `, [user_id]);
  
  return rows[0];
} 