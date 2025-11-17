import { pool } from "../config/db.js";

export const getStudentById = async (studentId) => {
  console.log('   -> getStudentById called with ID:', studentId);
  
  try {
    console.log('   -> Executing SQL query...');
    
    
    const [rows] = await pool.query(
      `SELECT 
        s.student_id, s.admission_number, s.date_of_birth, s.grade, s.section, s.address,
        COALESCE(u.first_name, '') as first_name, 
        COALESCE(u.last_name, '') as last_name, 
        COALESCE(u.email, '') as email,
        'Not Assigned' as class_name,
        'Not Assigned' as class_teacher
      FROM students s
      LEFT JOIN users u ON s.user_id = u.user_id
      WHERE s.admission_number = ?`,
      [studentId]
    );
    
    console.log('   -> Query executed successfully');
    console.log('   -> Number of rows returned:', rows.length);
    
    if (rows.length > 0) {
      console.log('   -> Student found:', rows[0].first_name, rows[0].last_name);
      
    } else {
      console.log('   -> No student found with admission number:', studentId);
    }
    
    return rows[0] || null;
  } catch (error) {
    console.error('   -> ERROR in getStudentById:');
    console.error('   -> Error message:', error.message);
    throw error;
  }
};

export const getPerformanceByStudentId = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        sp.performance_id, sp.academic_score, sp.sports_score, 
        sp.discipline_score, sp.leadership_score, sp.comments, sp.updated_at,
        c.name as class_name, c.grade,
        CONCAT(u.first_name, ' ', u.last_name) as updated_by_teacher
      FROM student_performance sp
       JOIN students s ON sp.student_id = s.student_id
      JOIN classes c ON sp.class_id = c.class_id
      JOIN users u ON sp.updated_by = u.user_id
      WHERE s.admission_number = ?
      ORDER BY sp.updated_at DESC
      LIMIT 1`,
      [studentId]
    );
    
    console.log('Performance query result:', rows[0]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error in getPerformanceByStudentId:', error);
    throw error;
  }
};

export const getActivitiesByStudentId = async (studentId) => {
  try {
    const [scholarships] = await pool.query(
      `SELECT 
        sch.scholarship_id, sch.sports, sch.social_works, sch.status, sch.created_at,
        sch.reason_academic, sch.reason_sports, sch.reason_cultural
      FROM scholarships sch
      JOIN students s ON sch.student_id = s.student_id
      WHERE s.admission_number = ?
      ORDER BY sch.created_at DESC`,
      [studentId]
    );
    
    return {
      scholarships: scholarships || []
    };
  } catch (error) {
    console.error('Error in getActivitiesByStudentId:', error);
    throw error;
  }
};