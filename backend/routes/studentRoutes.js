import { Router } from "express";
import { registerStudent, getStudents, updateStudent } from "../controllers/studentController.js";
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

export default router; 