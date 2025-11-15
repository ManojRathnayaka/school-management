import { 
  getStudentById, 
  getPerformanceByStudentId,
  getActivitiesByStudentId 
} from "../models/parentPortal.js";

export const getStudentInfo = async (req, res) => {
  console.log('\n========================================');
  console.log('=== Parent Portal - getStudentInfo called ===');
  console.log('========================================');
  
  try {
    const { studentId } = req.params;
    console.log('1. Received Student ID:', studentId);
    console.log('2. Calling getStudentById function...');
    
    const student = await getStudentById(studentId);
    
    console.log('3. Query completed');
    console.log('4. Student found:', student ? 'YES' : 'NO');
    
    if (student) {
      console.log('5. Student data:', JSON.stringify(student, null, 2));
    }
    
    if (!student) {
      console.log('6. Returning 404 - Student not found');
      return res.status(404).json({ message: "Student not found" });
    }
    
    console.log('7. Returning student data to frontend');
    res.json(student);
    console.log('========================================\n');
  } catch (error) {
    console.log('\n========================================');
    console.log('=== ERROR in getStudentInfo ===');
    console.log('========================================');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.log('========================================\n');
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