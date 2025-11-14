import express from "express";
import {
  getStudentInfo,
  getStudentPerformance,
  getStudentActivities
} from "../controllers/parentPortalController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get basic student information
router.get("/student/:studentId", authenticateJWT, authorizeRoles("parent", "principal"), getStudentInfo);

// Get student academic and sports performance
router.get("/student/:studentId/performance", authenticateJWT, authorizeRoles("parent", "principal"), getStudentPerformance);

// Get student extracurricular activities
router.get("/student/:studentId/activities", authenticateJWT, authorizeRoles("parent", "principal"), getStudentActivities);

export default router;