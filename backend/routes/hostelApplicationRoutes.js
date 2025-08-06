import { Router } from "express";
import {
  applyForHostel,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  testRoute,
} from "../controllers/hostelApplicationController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

// Student applies for hostel
router.post("/apply", authenticateJWT, authorizeRoles("student"), applyForHostel);

// Student views own applications
router.get("/my/:student_id", authenticateJWT, authorizeRoles("student"), getMyApplications);

// Admin views all applications
router.get("/", authenticateJWT, authorizeRoles("admin", "principal"), getAllApplications);

// Admin approves/rejects application
router.patch("/:id/status", authenticateJWT, authorizeRoles("admin", "principal"), updateApplicationStatus);

router.get("/my/test",  testRoute);

export default router;
