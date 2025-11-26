
import {pool} from '../config/db.js';

// Check that the logged-in teacher actually owns this class
export const teacherOwnsClass = async (userId, classId) => {
  const [rows] = await pool.query(
    `
    SELECT 1
    FROM classes c
    JOIN teachers t ON c.teacher_id = t.teacher_id
    WHERE c.class_id = ? AND t.user_id = ?
    `,
    [classId, userId]
  );
  return rows.length > 0;
};

// Get all classes assigned to this teacher (by user_id from JWT)
export const getClassesForTeacher = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT c.class_id, c.name, c.grade
    FROM classes c
    JOIN teachers t ON c.teacher_id = t.teacher_id
    WHERE t.user_id = ?
    ORDER BY c.grade, c.name
    `,
    [userId]
  );
  return rows;
};

// Get all students in a class, but only if this teacher owns the class
export const getStudentsForClass = async (userId, classId) => {
  const [rows] = await pool.query(
    `
    SELECT 
      s.student_id,
      s.admission_number,
      u.first_name,
      u.last_name
    FROM students s
    JOIN classes c ON s.class_id = c.class_id
    JOIN teachers t ON c.teacher_id = t.teacher_id
    JOIN users u ON s.user_id = u.user_id
    WHERE s.class_id = ? AND t.user_id = ?
    ORDER BY u.first_name, u.last_name
    `,
    [classId, userId]
  );
  return rows;
};

// Get the latest performance entry for a student in a class
export const getPerformanceForStudent = async (studentId, classId) => {
  const [rows] = await pool.query(
    `
    SELECT 
      performance_id,
      academic_score,
      sports_score,
      discipline_score,
      leadership_score,
      comments,
      updated_by,
      updated_at
    FROM student_performance 
    WHERE student_id = ? AND class_id = ?
    ORDER BY updated_at DESC
    LIMIT 1
    `,
    [studentId, classId]
  );
  return rows[0] || null;
};

//update performance (upsert by student_id + class_id)
export const upsertPerformance = async ({
  studentId,
  classId,
  academicScore,
  sportsScore,
  disciplineScore,
  leadershipScore,
  comments,
  updatedBy,
}) => {
  const [existing] = await pool.query(
    `
    SELECT performance_id
    FROM student_performance 
    WHERE student_id = ? AND class_id = ?
    LIMIT 1
    `,
    [studentId, classId]
  );

  if (existing.length > 0) {
    const performanceId = existing[0].performance_id;
    await pool.query(
      `
      UPDATE student_performance 
      SET academic_score = ?,
          sports_score = ?,
          discipline_score = ?,
          leadership_score = ?,
          comments = ?,
          updated_by = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE performance_id = ?
      `,
      [
        academicScore,
        sportsScore,
        disciplineScore,
        leadershipScore,
        comments,
        updatedBy,
        performanceId,
      ]
    );
    return performanceId;
  } else {
    const [result] = await pool.query(
      `
      INSERT INTO student_performance 
      (student_id, class_id, academic_score, sports_score, discipline_score, leadership_score, comments, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        studentId,
        classId,
        academicScore,
        sportsScore,
        disciplineScore,
        leadershipScore,
        comments,
        updatedBy,
      ]
    );
    return result.insertId;
  }
};
