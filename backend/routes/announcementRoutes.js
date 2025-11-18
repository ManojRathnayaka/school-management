import express from "express";
import {
  createAnnouncementHandler,
  getAllAnnouncementsHandler,
  getLatestAnnouncementsHandler,
  updateAnnouncementHandler,
  deleteAnnouncementHandler,
} from "../controllers/announcementController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get latest announcements (all authenticated users)
router.get(
  "/latest",
  authenticateJWT,
  getLatestAnnouncementsHandler
);

// Get all announcements (all authenticated users)
router.get(
  "/",
  authenticateJWT,
  getAllAnnouncementsHandler
);

// Create announcement (Principal only)
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("principal"),
  createAnnouncementHandler
);

// Update announcement (Principal only)
router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("principal"),
  updateAnnouncementHandler
);

// Delete announcement (Principal only)
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("principal"),
  deleteAnnouncementHandler
);

export default router;