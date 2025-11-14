import { 
  getStudentById, 
  getPerformanceByStudentId,
  getActivitiesByStudentId 
} from "../models/parentPortal.js";

export const getStudentInfo = async (req, res) => {
  try {
    console.log('=== Parent Portal - getStudentInfo called ===');
    const { studentId } = req.params;
    console.log('Student ID:', studentId);
    
    const student = await getStudentById(studentId);
    console.log('Student found:', student ? 'YES' : 'NO');
    
    if (!student) {
      console.log('Student not found in database');
      return res.status(404).json({ message: "Student not found" });
    }
    
    console.log('Returning student data:', student);
    res.json(student);
  } catch (error) {
    console.error('=== ERROR in getStudentInfo ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const performance = await getPerformanceByStudentId(studentId);
    
    if (!performance) {
      return res.status(404).json({ message: "No performance records found" });
    }
    
    res.json(performance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStudentActivities = async (req, res) => {
  try {
    const { studentId } = req.params;
    const activities = await getActivitiesByStudentId(studentId);
    
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};