// controllers/performanceController.js
// const performanceModel = require('../models/performanceModel');
// const classModel = require('../models/classModel');

 import {pool} from '../config/db.js';
//  import { getClassPerformance, updateStudentPerformance } from './classController';
import { getClassById } from '../models/classModel.js';
import { getClassPerformance, updateStudentPerformance, getStudentPerformance } from '../models/performanceModel.js';
// Get performance data for all students in a class
export const getClassPerformances = async (req, res) => {
  const { classId } = req.params;
  const teacherId = req.user.user_id;

  try {
    // Check if teacher is assigned to the class
    const classData = await getClassById(classId, teacherId);
    if (!classData || classData.length === 0) {
      return res.status(403).json({ message: "You are not authorized to view this class performance." });
    }

    const performanceRecords = await getClassPerformance(classId);
    return res.json(performanceRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching class performance' });
  }
};

// Update student performance
export const updateStudentPerformances = async (req, res) => {
  const { studentId } = req.params;
  const teacherId = req.user.user_id;
  const data = req.body;

  try {
    const [studentData] = await pool.query('SELECT class_id FROM students WHERE student_id = ?', [studentId]);

    // Check if the teacher is authorized for the student's class
    const classData = await getClassById(studentData[0].class_id, teacherId);
    if (!classData || classData.length === 0) {
      return res.status(403).json({ message: "You are not authorized to update this student's performance." });
    }

    await updateStudentPerformance(studentId, data, teacherId);
    return res.json({ message: 'Performance updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating student performance' });
  }
};

// Get performance details for a specific student
export const getStudentPerformances = async (req, res) => {
  const { studentId } = req.params;

  try {
    const performance = await getStudentPerformance(studentId);
    return res.json(performance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching student performance' });
  }
};

// module.exports = {
//   getClassPerformance,
//   updateStudentPerformance,
//   getStudentPerformance,
// };
