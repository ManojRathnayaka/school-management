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
    SELECT 
      s.student_id,
      s.user_id,
      s.admission_number,
      DATE_FORMAT(s.date_of_birth, '%Y-%m-%d') as date_of_birth,
      s.grade,
      s.section,
      s.address,
      u.first_name, 
      u.last_name, 
      u.email, 
      u.role
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.admission_number = ?
  `, [admission_number]);
  return rows[0];
}

export async function findStudentByUserId(user_id) {
  const [rows] = await pool.query(`
    SELECT 
      s.student_id,
      s.user_id,
      s.admission_number,
      DATE_FORMAT(s.date_of_birth, '%Y-%m-%d') as date_of_birth,
      s.grade,
      s.section,
      s.address,
      u.first_name, 
      u.last_name, 
      u.email, 
      u.role
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.user_id = ?
  `, [user_id]);
  return rows[0];
}

export async function getStudentsList({ search, grade, section, limit, offset }) {
  let query = `
    SELECT
      s.student_id,
      s.admission_number,
      s.grade,
      s.section,
      DATE_FORMAT(s.date_of_birth, '%Y-%m-%d') as date_of_birth,
      s.address,
      u.first_name,
      u.last_name,
      u.email
    FROM students s
    INNER JOIN users u ON s.user_id = u.user_id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (search) {
    query += ` AND CONCAT(u.first_name, ' ', u.last_name) LIKE ?`;
    params.push(`%${search}%`);
  }
  
  if (grade) {
    query += ` AND s.grade = ?`;
    params.push(grade);
  }
  
  if (section) {
    query += ` AND s.section = ?`;
    params.push(section);
  }
  
  query += ` ORDER BY u.first_name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);
  
  const [rows] = await pool.query(query, params);
  return rows;
}

export async function getStudentsCount({ search, grade, section }) {
  let query = `
    SELECT COUNT(*) as total
    FROM students s
    INNER JOIN users u ON s.user_id = u.user_id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (search) {
    query += ` AND CONCAT(u.first_name, ' ', u.last_name) LIKE ?`;
    params.push(`%${search}%`);
  }
  
  if (grade) {
    query += ` AND s.grade = ?`;
    params.push(grade);
  }
  
  if (section) {
    query += ` AND s.section = ?`;
    params.push(section);
  }
  
  const [rows] = await pool.query(query, params);
  return rows[0].total;
}

export async function findStudentById(student_id) {
  const [rows] = await pool.query(`
    SELECT 
      s.student_id,
      s.user_id,
      s.admission_number,
      DATE_FORMAT(s.date_of_birth, '%Y-%m-%d') as date_of_birth,
      s.grade,
      s.section,
      s.address,
      u.first_name, 
      u.last_name, 
      u.email, 
      u.role
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.student_id = ?
  `, [student_id]);
  return rows[0];
}

export async function updateStudentInfo(student_id, studentData) {
  const { admission_number, date_of_birth, grade, section, address } = studentData;
  const [result] = await pool.query(`
    UPDATE students
    SET admission_number = ?, date_of_birth = ?, grade = ?, section = ?, address = ?
    WHERE student_id = ?
  `, [admission_number, date_of_birth, grade, section, address, student_id]);
  return result;
}

export async function getParentIdsByStudentId(student_id) {
  const [rows] = await pool.query(`
    SELECT parent_id
    FROM student_parents
    WHERE student_id = ?
  `, [student_id]);
  return rows.map(row => row.parent_id);
}

export async function deleteStudentParentRelationship(student_id) {
  // Delete the relationship first to avoid foreign key constraints
  const [result] = await pool.query(`
    DELETE FROM student_parents
    WHERE student_id = ?
  `, [student_id]);
  return result;
}

export async function deleteStudentOnly(student_id) {
  // Delete only from students table (relationship already deleted)
  const [result] = await pool.query(`
    DELETE FROM students
    WHERE student_id = ?
  `, [student_id]);
  return result;
}