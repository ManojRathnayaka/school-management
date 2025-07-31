import { Router } from "express";
import { registerStudent, getStudents } from "../controllers/studentController.js";
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
export default router; 