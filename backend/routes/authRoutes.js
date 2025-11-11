import { Router } from "express";
import multer from "multer";
import {
  login,
  logout,
  getCurrentUser,
  createAdminUser,
  resetPasswordFirstLogin,
  getAllUsers,
  updateUserDetails,
  resetUserPassword,
  deleteUserAccount,
  bulkCreateAdminUsers,
} from "../controllers/authController.js";

import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

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

// Bulk user creation route
router.post(
  "/users/bulk-create",
  authenticateJWT,
  authorizeRoles("admin"),
  upload.single("userCsv"),
  bulkCreateAdminUsers,
);

// User management routes
router.get(
  "/users",
  authenticateJWT,
  authorizeRoles("admin"),
  getAllUsers,
);

router.put(
  "/users/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  updateUserDetails,
);

router.post(
  "/users/:id/reset-password",
  authenticateJWT,
  authorizeRoles("admin"),
  resetUserPassword,
);

router.delete(
  "/users/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  deleteUserAccount,
);

export default router;