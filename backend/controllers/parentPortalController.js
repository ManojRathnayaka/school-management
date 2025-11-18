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
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    console.log('1. Received Student ID:', studentId);
    console.log('2. User Role:', userRole);
    console.log('3. User ID:', userId);
    console.log('4. Calling getStudentById function...');
    
    // Pass userId only if user is a parent (principals can see all)
    const parentUserId = userRole === 'parent' ? userId : null;
    const student = await getStudentById(studentId, parentUserId);
    
    console.log('5. Query completed');
    console.log('6. Student found:', student ? 'YES' : 'NO');
    
    if (student) {
      console.log('7. Student data:', JSON.stringify(student, null, 2));
    }
    
    if (!student) {
      console.log('8. Returning 403 - Access denied or student not found');
      return res.status(403).json({ 
        message: "You don't have permission to view this student's information, or the student doesn't exist." 
      });
    }
    
    console.log('9. Returning student data to frontend');
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
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    // Pass userId only if user is a parent
    const parentUserId = userRole === 'parent' ? userId : null;
    const performance = await getPerformanceByStudentId(studentId, parentUserId);
    
    if (!performance) {
      return res.status(403).json({ 
        message: "No performance records found or you don't have permission to view this data." 
      });
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
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    // Pass userId only if user is a parent
    const parentUserId = userRole === 'parent' ? userId : null;
    const activities = await getActivitiesByStudentId(studentId, parentUserId);
    
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};