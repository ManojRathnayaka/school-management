import {
  createAchievement,
  getAllAchievements,
  getAchievementsCount,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
  getAchievementsByCategory,
} from "../models/achievementModel.js";
import fs from "fs/promises";
import path from "path";

export async function createAchievementController(req, res) {
  try {
    const { student_name, grade, category, title, details, achievement_date } = req.body;

    if (!student_name || !grade || !category || !title || !achievement_date) {
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.status(400).json({
        message: "Student name, grade, category, title, and achievement date are required",
      });
    }

    const image_path = req.file ? `/uploads/${req.file.filename}` : null;

    const achievementId = await createAchievement({
      student_name: student_name.trim(),
      grade,
      category,
      title: title.trim(),
      details: details?.trim() || null,
      image_path,
      achievement_date,
    });

    const newAchievement = await getAchievementById(achievementId);

    res.status(201).json({
      message: "Achievement created successfully",
      achievement: newAchievement,
    });
  } catch (err) {
    console.error("Create achievement error:", err);
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ message: "Failed to create achievement" });
  }
}

export async function getAchievementsController(req, res) {
  try {
    const { search = "", grade = "", category = "", page = 1, limit = 12 } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const achievements = await getAllAchievements({
      search,
      grade,
      category,
      limit: parseInt(limit),
      offset,
    });

    const total = await getAchievementsCount({ search, grade, category });

    res.status(200).json({
      achievements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("Get achievements error:", err);
    res.status(500).json({ message: "Failed to fetch achievements" });
  }
}

export async function getAchievementByIdController(req, res) {
  try {
    const { id } = req.params;
    const achievement = await getAchievementById(id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.status(200).json({ achievement });
  } catch (err) {
    console.error("Get achievement error:", err);
    res.status(500).json({ message: "Failed to fetch achievement" });
  }
}

export async function updateAchievementController(req, res) {
  try {
    const { id } = req.params;
    const { student_name, grade, category, title, details, achievement_date } = req.body;

    const existingAchievement = await getAchievementById(id);
    if (!existingAchievement) {
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.status(404).json({ message: "Achievement not found" });
    }

    let image_path = existingAchievement.image_path;

    if (req.file) {
      if (existingAchievement.image_path) {
        const oldImagePath = path.join(process.cwd(), 'public', existingAchievement.image_path);
        await fs.unlink(oldImagePath).catch(() => {});
      }
      image_path = `/uploads/${req.file.filename}`;
    }

    await updateAchievement(id, {
      student_name: student_name.trim(),
      grade,
      category,
      title: title.trim(),
      details: details?.trim() || null,
      image_path,
      achievement_date,
    });

    const updatedAchievement = await getAchievementById(id);

    res.status(200).json({
      message: "Achievement updated successfully",
      achievement: updatedAchievement,
    });
  } catch (err) {
    console.error("Update achievement error:", err);
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ message: "Failed to update achievement" });
  }
}

export async function deleteAchievementController(req, res) {
  try {
    const { id } = req.params;

    const achievement = await getAchievementById(id);
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    if (achievement.image_path) {
      const imagePath = path.join(process.cwd(), 'public', achievement.image_path);
      await fs.unlink(imagePath).catch(() => {});
    }

    await deleteAchievement(id);

    res.status(200).json({ message: "Achievement deleted successfully" });
  } catch (err) {
    console.error("Delete achievement error:", err);
    res.status(500).json({ message: "Failed to delete achievement" });
  }
}

export async function getAchievementsByCategoryController(req, res) {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const achievements = await getAchievementsByCategory(category, parseInt(limit));

    res.status(200).json({ achievements });
  } catch (err) {
    console.error("Get achievements by category error:", err);
    res.status(500).json({ message: "Failed to fetch achievements" });
  }
}