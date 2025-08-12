// models/performanceModel.js
import {pool} from "../config/db.js";

// Function to get performance data for a class
export const getClassPerformance = async (classId) => {
  const [rows] = await pool.query(
    `SELECT s.first_name, s.last_name, p.* 
    FROM student_performance p 
    JOIN students s ON p.student_id = s.student_id 
    WHERE p.class_id = ?`,
    [classId]
  );
  return rows;
};

// Function to update student performance
export const updateStudentPerformance = async (studentId, data, teacherId) => {
  const { academic_score, sports_score, discipline_score, leadership_score, comments } = data;

  // Insert into performance_audit_log before updating
  const [previousPerformance] = await pool.query(
    'SELECT * FROM student_performance WHERE student_id = ?',
    [studentId]
  );

  await pool.query(
    'INSERT INTO performance_audit_log (performance_id, field_changed, old_value, new_value, changed_by) VALUES (?, ?, ?, ?, ?)',
    [previousPerformance[0].performance_id, 'academic_score', previousPerformance[0].academic_score, academic_score, teacherId]
  );

  // Update performance in the student_performance table
  await pool.query(
    'UPDATE student_performance SET academic_score = ?, sports_score = ?, discipline_score = ?, leadership_score = ?, comments = ?, updated_by = ? WHERE student_id = ?',
    [academic_score, sports_score, discipline_score, leadership_score, comments, teacherId, studentId]
  );
};

// Function to get a specific student's performance
export const getStudentPerformance = async (studentId) => {
  const [rows] = await pool.query('SELECT * FROM student_performance WHERE student_id = ?', [studentId]);
  return rows[0];
};

// module.exports = {
//   getClassPerformance,
//   updateStudentPerformance,
//   getStudentPerformance,
// };
