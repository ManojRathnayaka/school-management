


import { Router } from "express";
import {
  authenticateJWT,
  authorizeRoles
} from "../middleware/authMiddleware.js";

import {
  getTeacherClasses,
  getStudentsForTeacherClass,
  getStudentPerformanceHandler,
  upsertStudentPerformanceHandler
} from "../controllers/performanceController.js";

const router = Router();

// ===============================
//  ONLY TEACHERS CAN ACCESS
// ===============================
router.use(authenticateJWT);
router.use(authorizeRoles("teacher"));


// --------------------------------------
// GET classes assigned to logged-in teacher
// --------------------------------------
router.get(
  "/classes",
  getTeacherClasses
);


// --------------------------------------
// GET students in a class (teacher must own that class)
// --------------------------------------
router.get(
  "/classes/:classId/students",
  getStudentsForTeacherClass
);


// --------------------------------------
// GET performance for a specific student in teacher's class
// --------------------------------------
router.get(
  "/classes/:classId/students/:studentId",
  getStudentPerformanceHandler
);


// --------------------------------------
// CREATE or UPDATE student performance
// --------------------------------------
router.put(
  "/classes/:classId/students/:studentId",
  upsertStudentPerformanceHandler
);

export default router;
