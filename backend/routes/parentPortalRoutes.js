import express from "express";
import {
  getStudentInfo,
  getStudentPerformance,
  getStudentActivities
} from "../controllers/parentPortalController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Error catching wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('❌ Route Error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  });
};

// Get basic student information
router.get("/student/:studentId", 
  authenticateJWT, 
  authorizeRoles("parent", "principal"), 
  asyncHandler(getStudentInfo)
);

// Get student academic and sports performance
router.get("/student/:studentId/performance", 
  authenticateJWT, 
  authorizeRoles("parent", "principal"), 
  asyncHandler(getStudentPerformance)
);

// Get student extracurricular activities
router.get("/student/:studentId/activities", 
  authenticateJWT, 
  authorizeRoles("parent", "principal"), 
  asyncHandler(getStudentActivities)
);

export default router;