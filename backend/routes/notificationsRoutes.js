import { Router } from "express";
import {
  authenticateJWT,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = Router();
import {handleGetUnreadNotifications, handleMarkNotificationRead} from "../controllers/notificationsController.js";

router.get("/unread",
     authenticateJWT,
     authorizeRoles("teacher"),
      handleGetUnreadNotifications);
router.put("/read/:id/read",
     authenticateJWT,
        authorizeRoles("teacher"),
      handleMarkNotificationRead);

export default router;