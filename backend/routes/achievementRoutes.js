import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import {
  createAchievementController,
  getAchievementsController,
  getAchievementByIdController,
  updateAchievementController,
  deleteAchievementController,
  getAchievementsByCategoryController,
} from "../controllers/achievementController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

// Get current file's directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "achievement-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG images are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Create achievement (Principal and Teacher)
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  upload.single("image"),
  createAchievementController
);

// Get all achievements with filters (All authenticated users)
router.get("/", authenticateJWT, getAchievementsController);

// Get achievements by category (All authenticated users)
router.get(
  "/category/:category",
  authenticateJWT,
  getAchievementsByCategoryController
);

// Get single achievement (All authenticated users)
router.get("/:id", authenticateJWT, getAchievementByIdController);

// Update achievement (Principal and Teacher)
router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  upload.single("image"),
  updateAchievementController
);

// Delete achievement (Principal and Teacher)
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  deleteAchievementController
);

export default router;