import { Router } from "express";
import { registerStudent } from "../controllers/studentController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/register-student",
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  registerStudent
);

export default router; 