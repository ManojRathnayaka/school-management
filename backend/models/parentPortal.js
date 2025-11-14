import { pool } from "../config/db.js";

export const getStudentById = async (studentId) => {
  try {
    // Search by both student_id and admission_number
    const [rows] = await pool.query(
      `SELECT 
        s.student_id, s.admission_number, s.date_of_birth, s.grade, s.section, s.address,
        COALESCE(u.first_name, '') as first_name, 
        COALESCE(u.last_name, '') as last_name, 
        COALESCE(u.email, '') as email, 
        COALESCE(u.phone_number, '') as phone_number,
        COALESCE(c.name, 'Not Assigned') as class_name,
        COALESCE(CONCAT(tu.first_name, ' ', tu.last_name), 'Not Assigned') as class_teacher
      FROM students s
      LEFT JOIN users u ON s.user_id = u.user_id
      LEFT JOIN classes c ON s.class_id = c.class_id
      LEFT JOIN teachers t ON c.teacher_id = t.teacher_id
      LEFT JOIN users tu ON t.user_id = tu.user_id
      WHERE s.student_id = ? OR s.admission_number = ?`,
      [studentId, studentId]
    );
    
    console.log('Student query result:', rows[0]); // Debug log
    return rows[0] || null;
  } catch (error) {
    console.error('Error in getStudentById:', error);
    throw error;
  }
};

export const getPerformanceByStudentId = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT 
      sp.performance_id, sp.academic_score, sp.sports_score, 
      sp.discipline_score, sp.leadership_score, sp.comments, sp.updated_at,
      c.name as class_name, c.grade,
      CONCAT(u.first_name, ' ', u.last_name) as updated_by_teacher
    FROM student_performance sp
    JOIN classes c ON sp.class_id = c.class_id
    JOIN users u ON sp.updated_by = u.user_id
    WHERE sp.student_id = ?
    ORDER BY sp.updated_at DESC
    LIMIT 1`,
    [studentId]
  );
  
  return rows[0] || null;
};

export const getActivitiesByStudentId = async (studentId) => {
  // Get scholarship activities
  const [scholarships] = await pool.query(
    `SELECT 
      scholarship_id, sports, social_works, status, created_at,
      reason_academic, reason_sports, reason_cultural
    FROM scholarships
    WHERE student_id = ?
    ORDER BY created_at DESC`,
    [studentId]
  );
  
  return {
    scholarships: scholarships || []
  };
};