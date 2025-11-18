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
    
    // Handle different JWT field names (id, userId, user_id)
    const userId = req.user.userId || req.user.id || req.user.user_id;
    
    console.log('1. Received Student ID:', studentId);
    console.log('2. User Role:', userRole);
    console.log('3. User ID:', userId);
    console.log('4. Full req.user:', JSON.stringify(req.user));
    
    if (!userId) {
      console.log('ERROR: No userId found in JWT token!');
      return res.status(401).json({ 
        message: "Authentication error: User ID not found in token" 
      });
    }
    
    // CRITICAL: Parents can ONLY see their own children - NO EXCEPTIONS
    // Only principals can see all students
    if (userRole !== 'principal') {
      console.log('5. User is NOT principal - enforcing parent access control');
      const parentUserId = userId;
      const student = await getStudentById(studentId, parentUserId);
      
      console.log('6. Query completed');
      
      // Handle error responses
      if (student && student.error) {
        if (student.error === 'NOT_FOUND') {
          console.log('7. Student not found');
          return res.status(404).json({ 
            message: "Student not found. Please check the admission number." 
          });
        }
        if (student.error === 'ACCESS_DENIED') {
          console.log('7. Access denied - parent does not have permission');
          return res.status(403).json({ 
            message: "Access denied. You can only view your own child's information." 
          });
        }
      }
      
      if (!student) {
        console.log('7. Unexpected: No student data returned');
        return res.status(404).json({ 
          message: "Student not found." 
        });
      }
      
      console.log('7. Student found and access verified');
      console.log('8. Returning student data to frontend');
      res.json(student);
      console.log('========================================\n');
      return;
    }
    
    // Principal can see all students without restriction
    console.log('5. User is principal - allowing full access');
    const student = await getStudentById(studentId, null);
    
    console.log('6. Query completed');
    
    // Handle error responses for principal
    if (student && student.error) {
      if (student.error === 'NOT_FOUND') {
        console.log('7. Student not found');
        return res.status(404).json({ 
          message: "Student not found. Please check the admission number." 
        });
      }
    }
    
    if (!student) {
      console.log('7. Unexpected: No student data returned');
      return res.status(404).json({ 
        message: "Student not found." 
      });
    }
    
    console.log('7. Student found');
    console.log('8. Returning student data to frontend');
    res.json(student);
    console.log('========================================\n');
  } catch (error) {
    console.log('\n========================================');
    console.log('=== ERROR in getStudentInfo ===');
    console.log('========================================');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.log('========================================\n');
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userRole = req.user.role;
    
    // Handle different JWT field names (id, userId, user_id)
    const userId = req.user.userId || req.user.id || req.user.user_id;
    
    if (!userId) {
      return res.status(401).json({ 
        message: "Authentication error: User ID not found in token" 
      });
    }
    
    // CRITICAL: Parents can ONLY see their own children
    if (userRole !== 'principal') {
      const parentUserId = userId;
      const performance = await getPerformanceByStudentId(studentId, parentUserId);
      
      // Handle error responses
      if (performance && performance.error) {
        if (performance.error === 'NOT_FOUND') {
          return res.status(404).json({ 
            message: "Student not found." 
          });
        }
        if (performance.error === 'ACCESS_DENIED') {
          return res.status(403).json({ 
            message: "Access denied. You can only view your own child's performance." 
          });
        }
      }
      
      if (!performance) {
        return res.status(404).json({ 
          message: "No performance records found for this student." 
        });
      }
      
      res.json(performance);
      return;
    }
    
    // Principal can see all
    const performance = await getPerformanceByStudentId(studentId, null);
    
    if (!performance) {
      return res.status(404).json({ 
        message: "No performance records found for this student." 
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
    
    // Handle different JWT field names (id, userId, user_id)
    const userId = req.user.userId || req.user.id || req.user.user_id;
    
    if (!userId) {
      return res.status(401).json({ 
        message: "Authentication error: User ID not found in token" 
      });
    }
    
    // CRITICAL: Parents can ONLY see their own children
    if (userRole !== 'principal') {
      const parentUserId = userId;
      const activities = await getActivitiesByStudentId(studentId, parentUserId);
      
      // Handle error responses
      if (activities && activities.error) {
        if (activities.error === 'NOT_FOUND') {
          return res.status(404).json({ 
            message: "Student not found." 
          });
        }
        if (activities.error === 'ACCESS_DENIED') {
          return res.status(403).json({ 
            message: "Access denied. You can only view your own child's activities." 
          });
        }
      }
      
      res.json(activities);
      return;
    }
    
    // Principal can see all
    const activities = await getActivitiesByStudentId(studentId, null);
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};