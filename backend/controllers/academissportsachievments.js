// controllers/academicAchievementController.js
import AcademicAchievement from '../models/academicsportsachievments.js';

// @desc    Get all academic achievements
// @route   GET /api/achievements
// @access  Public
export const getAllAchievements = async (req, res) => {
  try {
    const { category, level, student, grade, sort, page = 1, limit = 10 } = req.query;
    
    const filters = { category, level, student, grade, sort };
    const result = await AcademicAchievement.findAll(filters, page, limit);
    
    res.status(200).json({
      success: true,
      count: result.data.length,
      total: result.total,
      page: result.page,
      pages: result.pages,
      data: result.data
    });
  } catch (error) {
    console.error('Error in getAllAchievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements',
      error: error.message
    });
  }
};

// @desc    Get single academic achievement
// @route   GET /api/achievements/:id
// @access  Public
export const getAchievementById = async (req, res) => {
  try {
    const achievement = await AcademicAchievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    console.error('Error in getAchievementById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievement',
      error: error.message
    });
  }
};

// @desc    Create new academic achievement
// @route   POST /api/achievements
// @access  Private
export const createAchievement = async (req, res) => {
  try {
    const achievement = await AcademicAchievement.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Error in createAchievement:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating achievement',
      error: error.message
    });
  }
};

// @desc    Update academic achievement
// @route   PUT /api/achievements/:id
// @access  Private
export const updateAchievement = async (req, res) => {
  try {
    const achievement = await AcademicAchievement.update(req.params.id, req.body);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Error in updateAchievement:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating achievement',
      error: error.message
    });
  }
};

// @desc    Delete academic achievement
// @route   DELETE /api/achievements/:id
// @access  Private
export const deleteAchievement = async (req, res) => {
  try {
    const deleted = await AcademicAchievement.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteAchievement:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting achievement',
      error: error.message
    });
  }
};

// @desc    Soft delete academic achievement
// @route   PATCH /api/achievements/:id/deactivate
// @access  Private
export const deactivateAchievement = async (req, res) => {
  try {
    const deactivated = await AcademicAchievement.deactivate(req.params.id);
    
    if (!deactivated) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    const achievement = await AcademicAchievement.findById(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Achievement deactivated successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Error in deactivateAchievement:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating achievement',
      error: error.message
    });
  }
};

// @desc    Get achievements by category
// @route   GET /api/achievements/category/:category
// @access  Public
export const getAchievementsByCategory = async (req, res) => {
  try {
    const achievements = await AcademicAchievement.findByCategory(req.params.category);
    
    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    console.error('Error in getAchievementsByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements by category',
      error: error.message
    });
  }
};

// @desc    Get top achievements
// @route   GET /api/achievements/top/:limit
// @access  Public
export const getTopAchievements = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const achievements = await AcademicAchievement.getTopAchievements(limit);
    
    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    console.error('Error in getTopAchievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top achievements',
      error: error.message
    });
  }
};

// @desc    Get achievement statistics
// @route   GET /api/achievements/stats
// @access  Public
export const getAchievementStats = async (req, res) => {
  try {
    const stats = await AcademicAchievement.getStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getAchievementStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};