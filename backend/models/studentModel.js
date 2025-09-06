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

// Get student with parent information
export async function getStudentWithParents(student_id) {
  const [rows] = await pool.query(`
    SELECT 
      s.student_id,
      s.user_id,
      s.admission_number,
      DATE_FORMAT(s.date_of_birth, '%Y-%m-%d') as date_of_birth,
      s.grade,
      s.section,
      s.address,
      u.first_name as student_first_name,
      u.last_name as student_last_name,
      u.email as student_email,
      u.role,
      p.parent_id,
      p.contact_number,
      pu.first_name as parent_first_name,
      pu.last_name as parent_last_name,
      pu.email as parent_email
    FROM students s
    JOIN users u ON s.user_id = u.user_id
    LEFT JOIN student_parents sp ON s.student_id = sp.student_id
    LEFT JOIN parents p ON sp.parent_id = p.parent_id
    LEFT JOIN users pu ON p.user_id = pu.user_id
    WHERE s.student_id = ?
  `, [student_id]);
  
  if (rows.length === 0) return null;
  
  const studentData = rows[0];
  
  return {
    student: {
      student_id: studentData.student_id,
      user_id: studentData.user_id,
      admission_number: studentData.admission_number,
      date_of_birth: studentData.date_of_birth,
      grade: studentData.grade,
      section: studentData.section,
      address: studentData.address,
      first_name: studentData.student_first_name,
      last_name: studentData.student_last_name,
      email: studentData.student_email,
      role: studentData.role
    },
    parent: studentData.parent_id ? {
      parent_id: studentData.parent_id,
      contact_number: studentData.contact_number,
      first_name: studentData.parent_first_name,
      last_name: studentData.parent_last_name,
      email: studentData.parent_email
    } : null
  };
}