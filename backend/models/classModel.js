// models/classModel.js
import {pool} from "../config/db.js";

// Function to get the class and teacher details
export const getClassById = async (classId, teacherId) => {
  const [rows] = await pool.query(
    'SELECT * FROM classes WHERE class_id = ? AND teacher_id = ?',
    [classId, teacherId]
  );
  return rows;
};

// Function to get all students for a specific class
export const getStudentsForClass = async (classId) => {
  const [rows] = await pool.query(
    'SELECT * FROM students WHERE class_id = ?',
    [classId]
  );
  return rows;
};

// Function to fetch classes assigned to a teacher
export const getClassesForTeachers = async (teacherId) => {
  const [rows] = await pool.query(
    'SELECT * FROM classes WHERE teacher_id = ?', 
    [teacherId]
  );
  return rows;
};

