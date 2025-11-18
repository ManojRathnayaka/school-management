import { pool } from "../config/db.js";

// NEW: Check if parent has access to this student
export const checkParentStudentRelationship = async (parentUserId, admissionNumber) => {
  const [rows] = await pool.query(
    `SELECT s.student_id 
     FROM students s
     JOIN student_parents sp ON s.student_id = sp.student_id
     JOIN parents p ON sp.parent_id = p.parent_id
     WHERE s.admission_number = ? AND p.user_id = ?`,
    [admissionNumber, parentUserId]
  );
  
  return rows.length > 0;
};

export const getStudentById = async (studentId, parentUserId = null) => {
  console.log('   -> getStudentById called with ID:', studentId);
  
  try {
    console.log('   -> Executing SQL query...');
    
    // If parentUserId is provided, check relationship first
    if (parentUserId) {
      const hasAccess = await checkParentStudentRelationship(parentUserId, studentId);
      if (!hasAccess) {
        console.log('   -> Access denied: Parent does not have access to this student');
        return null;
      }
    }
    
    const [rows] = await pool.query(
      `SELECT 
        s.student_id, 
        s.admission_number, 
        s.date_of_birth, 
        s.grade, 
        s.section, 
        s.address,
        COALESCE(u.first_name, '') as first_name, 
        COALESCE(u.last_name, '') as last_name, 
        COALESCE(u.email, '') as email,
        COALESCE(c.name, CONCAT(s.grade, s.section)) as class_name,
        COALESCE(CONCAT(tu.first_name, ' ', tu.last_name), 'Not Assigned') as class_teacher,
        COALESCE(t.contact_number, 'N/A') as teacher_contact
      FROM students s
      LEFT JOIN users u ON s.user_id = u.user_id
      LEFT JOIN classes c ON s.class_id = c.class_id
      LEFT JOIN teachers t ON c.teacher_id = t.teacher_id
      LEFT JOIN users tu ON t.user_id = tu.user_id
      WHERE s.admission_number = ?`,
      [studentId]
    );
    
    console.log('   -> Query executed successfully');
    console.log('   -> Number of rows returned:', rows.length);
    
    if (rows.length > 0) {
      console.log('   -> Student found:', rows[0].first_name, rows[0].last_name);
      console.log('   -> Class:', rows[0].class_name);
      console.log('   -> Teacher:', rows[0].class_teacher);
      console.log('   -> Teacher Contact:', rows[0].teacher_contact);
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

export const getPerformanceByStudentId = async (studentId, parentUserId = null) => {
  try {
    console.log('   -> getPerformanceByStudentId called with:', studentId);
    
    // If parentUserId is provided, check relationship first
    if (parentUserId) {
      const hasAccess = await checkParentStudentRelationship(parentUserId, studentId);
      if (!hasAccess) {
        console.log('   -> Access denied: Parent does not have access to this student');
        return null;
      }
    }
    
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
    
    console.log('   -> Performance query result:', rows[0]);
    return rows[0] || null;
  } catch (error) {
    console.error('   -> Error in getPerformanceByStudentId:', error);
    throw error;
  }
};

export const getActivitiesByStudentId = async (studentId, parentUserId = null) => {
  try {
    console.log('   -> getActivitiesByStudentId called with:', studentId);
    
    // If parentUserId is provided, check relationship first
    if (parentUserId) {
      const hasAccess = await checkParentStudentRelationship(parentUserId, studentId);
      if (!hasAccess) {
        console.log('   -> Access denied: Parent does not have access to this student');
        return { scholarships: [] };
      }
    }
    
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
    
    console.log('   -> Activities query result:', scholarships.length, 'records');
    return {
      scholarships: scholarships || []
    };
  } catch (error) {
    console.error('   -> Error in getActivitiesByStudentId:', error);
    throw error;
  }
};