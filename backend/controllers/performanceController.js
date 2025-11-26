import {
  teacherOwnsClass,
  getClassesForTeacher,
  getStudentsForClass,
  getPerformanceForStudent,
  upsertPerformance,
} from '../models/performanceModel.js';

// GET /api/class-performance/classes
export const getTeacherClasses = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const classes = await getClassesForTeacher(userId);
    return res.json(classes);
  } catch (err) {
    console.error('Error fetching teacher classes', err);
    return res.status(500).json({ message: 'Error fetching classes' });
  }
};

// GET /api/class-performance/classes/:classId/students
export const getStudentsForTeacherClass = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { classId } = req.params;

    const owns = await teacherOwnsClass(userId, classId);
    if (!owns) {
      return res.status(403).json({ message: 'Not authorized for this class' });
    }

    const students = await getStudentsForClass(userId, classId);
    return res.json(students);
  } catch (err) {
    console.error('Error fetching students for class', err);
    return res.status(500).json({ message: 'Error fetching students' });
  }
};

// GET /api/class-performance/classes/:classId/students/:studentId
export const getStudentPerformanceHandler = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { classId, studentId } = req.params;

    const owns = await teacherOwnsClass(userId, classId);
    if (!owns) {
      return res.status(403).json({ message: 'Not authorized for this class' });
    }

    const performance = await getPerformanceForStudent(studentId, classId);
    if (!performance) {
      return res.json(null); // frontend will show empty/0 values
    }

    return res.json(performance);
  } catch (err) {
    console.error('Error fetching performance', err);
    return res.status(500).json({ message: 'Error fetching performance' });
  }
};

// PUT /api/class-performance/classes/:classId/students/:studentId
export const upsertStudentPerformanceHandler = async (req, res) => {
  try {
    const userId = req.user.user_id; // teacher's user_id
    const { classId, studentId } = req.params;
    const {
      academic_score,
      sports_score,
      discipline_score,
      leadership_score,
      comments,
    } = req.body;

    const owns = await teacherOwnsClass(userId, classId);
    if (!owns) {
      return res.status(403).json({ message: 'Not authorized for this class' });
    }

    // Basic validation (0–100 range)
    const toNum = (v) => (v === null || v === '' || v === undefined ? 0 : Number(v));
    const academic = toNum(academic_score);
    const sports = toNum(sports_score);
    const discipline = toNum(discipline_score);
    const leadership = toNum(leadership_score);

    if (
      [academic, sports, discipline, leadership].some(
        (v) => Number.isNaN(v) || v < 0 || v > 100
      )
    ) {
      return res
        .status(400)
        .json({ message: 'Scores must be numbers between 0 and 100' });
    }

    const performanceId = await upsertPerformance({
      studentId,
      classId,
      academicScore: academic,
      sportsScore: sports,
      disciplineScore: discipline,
      leadershipScore: leadership,
      comments: comments || null,
      updatedBy: userId,
    });

    const updated = await getPerformanceForStudent(studentId, classId);
    return res.json({ performance_id: performanceId, performance: updated });
  } catch (err) {
    console.error('Error saving performance', err);
    return res.status(500).json({ message: 'Error saving performance' });
  }
};

