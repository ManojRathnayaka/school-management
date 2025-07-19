import { Router } from "express";
import {
  signup,
  login,
  logout,
  getCurrentUser,
  listPendingUsers,
  approvePendingUser,
  createAdminUser,
} from "../controllers/authController.js";

import {
  authenticateJWT,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateJWT, getCurrentUser);

router.get(
  "/pending-users",
  authenticateJWT,
  authorizeRoles("admin"),
  listPendingUsers
);
router.post(
  "/approve-user",
  authenticateJWT,
  authorizeRoles("admin"),
  approvePendingUser
);
router.post(
  "/create-user",
  authenticateJWT,
  authorizeRoles("admin"),
  createAdminUser
);

export default router;
