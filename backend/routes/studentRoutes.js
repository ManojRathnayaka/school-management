import { Router } from "express";
import { registerStudent, getStudents, updateStudent, deleteStudent, getStudentParents } from "../controllers/studentController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/",
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  registerStudent
);

router.get('/',
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  getStudents
)

router.put('/:studentId',
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  updateStudent
);

router.delete('/:studentId',
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  deleteStudent
);

router.get('/:studentId/parents',
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  getStudentParents
);
export default router; 