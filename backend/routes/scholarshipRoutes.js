import express from "express";
import {
  submitScholarship,
  listScholarships,
  approveScholarship,
  rejectScholarship
} from "../controllers/scholarshipController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student submits application
router.post("/", authenticateJWT, authorizeRoles("student"), submitScholarship);

// Principal views all applications
router.get("/", authenticateJWT, authorizeRoles("principal"), listScholarships)

// Principal approves/rejects
router.put("/:id/approve", authenticateJWT, authorizeRoles("principal"), approveScholarship);
router.put("/:id/reject", authenticateJWT, authorizeRoles("principal"), rejectScholarship);



export default router;
