import { Router } from "express";
import {
  login,
  logout,
  getCurrentUser,
  createAdminUser,
  resetPasswordFirstLogin,
} from "../controllers/authController.js";

import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateJWT, getCurrentUser);
router.post("/reset-password-first-login", resetPasswordFirstLogin);

router.post(
  "/create-user",
  authenticateJWT,
  authorizeRoles("admin"),
  createAdminUser,
);

export default router;
