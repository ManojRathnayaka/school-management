
import { getStudentsForClass, getClassesForTeachers  } from '../models/classModel.js';
// Get students for a specific class
export const getStudentsForClasses = async (req, res) => {
  const { classId } = req.params;

  try {
    const students = await getStudentsForClass(classId);
    return res.json(students);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching students for the class' });
  }
};


// Get classes assigned to a teacher
export const getClassesAssignedToTeacher = async (req, res) => {
  const { teacherId } = req.params;  // Get the teacherId from the request parameters
  
  try {
    const classes = await getClassesForTeachers(teacherId); // Fetch classes for the teacher
    if (classes.length === 0) {
      return res.status(404).json({ message: 'No classes found for this teacher' });
    }
    return res.json(classes);  // Return the classes as a response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching classes assigned to the teacher' });
  }
};

// module.exports = {
//   getStudentsForClass,
// };
