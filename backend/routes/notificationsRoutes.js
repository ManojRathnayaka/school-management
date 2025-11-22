import { Router } from "express";
import {
  authenticateJWT,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = Router();
import {handleGetUnreadNotifications, handleMarkNotificationRead} from "../controllers/notificationsController.js";

router.get(
  "/unread",
  authenticateJWT,
  authorizeRoles("teacher", "principal"),  // 🔥 FIXED
  handleGetUnreadNotifications
);

router.put(
  "/read/:id",            // 🔥 FIXED — removed the extra `/read`
  authenticateJWT,
  authorizeRoles("teacher", "principal"),
  handleMarkNotificationRead
);


export default router;