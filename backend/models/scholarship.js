import { pool } from "../config/db.js";

export const createScholarship = async (data) => {
   // First, get the student_id from admission_number
  const [studentRows] = await pool.query(
    'SELECT student_id FROM students WHERE admission_number = ?',
    [data.admission_number]
  );
  
  if (studentRows.length === 0) {
    throw new Error('Student not found with this admission number');
  }
  
  const student_id = studentRows[0].student_id;


  const [result] = await pool.query(
    `INSERT INTO scholarships (
      student_id, student_name, father_name, father_occupation, father_income, father_contact,
      mother_name, mother_occupation, mother_income, mother_contact, 
      medical_or_Physical_Challenges, sports, social_works,
      reason_financial_need, reason_academic, reason_sports, reason_cultural, reason_other,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      student_id, data.student_name, data.father_name, data.father_occupation, data.father_income, data.father_contact,
      data.mother_name, data.mother_occupation, data.mother_income, data.mother_contact, 
      data.medical_or_Physical_Challenges, data.sports, data.social_works,
      data.reason_financial_need, data.reason_academic, data.reason_sports, data.reason_cultural, data.reason_other
    ]
  );
  return result;
};

export const getAllScholarships = async () => {
  const [rows] = await pool.query(
    `SELECT s.*, st.admission_number, st.grade, st.section, u.first_name, u.last_name
     FROM scholarships s
     JOIN students st ON s.student_id = st.student_id
     JOIN users u ON st.user_id = u.user_id 
     ORDER BY s.created_at DESC`
  );
  return rows;
};

export const updateScholarshipStatus = async (id, status) => {
  const [result] = await pool.query(
    "UPDATE scholarships SET status = ? WHERE scholarship_id = ?",
    [status, id]
  );
  return result;
};