// routes/academicAchievementRoutes.js
import { Router } from "express";
const router = Router();


import {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  deactivateAchievement,
  getAchievementsByCategory,
  getTopAchievements,
  getAchievementStats
} from '../controllers/academissportsachievments.js';

// Public routes
router.get('/', getAllAchievements);
router.get('/stats', getAchievementStats);
router.get('/top/:limit', getTopAchievements);
router.get('/category/:category', getAchievementsByCategory);
router.get('/:id', getAchievementById);

// Protected routes (add authentication middleware as needed)
router.post('/', createAchievement);
router.put('/:id', updateAchievement);
router.delete('/:id', deleteAchievement);
router.patch('/:id/deactivate', deactivateAchievement);

export default router;