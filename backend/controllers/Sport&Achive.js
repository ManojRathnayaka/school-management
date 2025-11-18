const Achievement = require('../models/Achievement');
const { validationResult } = require('express-validator');

class AchievementController {
  // Get all achievements with optional filtering
  async getAllAchievements(req, res) {
    try {
      const {
        type,
        category,
        level,
        year,
        grade,
        position,
        search,
        page = 1,
        limit = 10,
        sortBy = 'date',
        sortOrder = 'desc'
      } = req.query;

      // Build filter object
      const filters = { isActive: true };
      
      if (type) filters.type = type;
      if (category) filters.category = category;
      if (level) filters.level = level;
      if (grade) filters.grade = { $regex: grade, $options: 'i' };
      if (position) filters.position = { $regex: position, $options: 'i' };
      
      // Handle year filtering
      if (year && year !== 'all') {
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);
        filters.date = { $gte: startDate, $lte: endDate };
      }
      
      // Handle search functionality
      if (search) {
        filters.$or = [
          { title: { $regex: search, $options: 'i' } },
          { student: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Build sort object
      const sortObj = {};
      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const [achievements, total] = await Promise.all([
        Achievement.find(filters)
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Achievement.countDocuments(filters)
      ]);

      const totalPages = Math.ceil(total / parseInt(limit));

      res.status(200).json({
        success: true,
        data: achievements,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      });
    } catch (error) {
      console.error('Error getting achievements:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving achievements',
        error: error.message
      });
    }
  }

  // Get achievements by type (academic or sports)
  async getAchievementsByType(req, res) {
    try {
      const { type } = req.params;
      const { category, level, year, search } = req.query;

      if (!['academic', 'sports'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid achievement type. Must be either "academic" or "sports"'
        });
      }

      const filters = { type };
      if (category) filters.category = category;
      if (level) filters.level = level;
      if (year && year !== 'all') {
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);
        filters.date = { $gte: startDate, $lte: endDate };
      }
      if (search) {
        filters.$or = [
          { title: { $regex: search, $options: 'i' } },
          { student: { $regex: search, $options: 'i' } }
        ];
      }

      const achievements = await Achievement.getByType(type, filters);

      res.status(200).json({
        success: true,
        data: achievements
      });
    } catch (error) {
      console.error('Error getting achievements by type:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving achievements',
        error: error.message
      });
    }
  }

  // Get single achievement by ID
  async getAchievementById(req, res) {
    try {
      const { id } = req.params;
      
      const achievement = await Achievement.findById(id);
      
      if (!achievement || !achievement.isActive) {
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
      console.error('Error getting achievement:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving achievement',
        error: error.message
      });
    }
  }

  // Create new achievement
  async createAchievement(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const achievementData = req.body;
      
      // Create new achievement
      const achievement = new Achievement(achievementData);
      await achievement.save();

      res.status(201).json({
        success: true,
        message: 'Achievement created successfully',
        data: achievement
      });
    } catch (error) {
      console.error('Error creating achievement:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating achievement',
        error: error.message
      });
    }
  }

  // Update achievement
  async updateAchievement(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = req.body;

      const achievement = await Achievement.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

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
      console.error('Error updating achievement:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating achievement',
        error: error.message
      });
    }
  }

  // Soft delete achievement
  async deleteAchievement(req, res) {
    try {
      const { id } = req.params;

      const achievement = await Achievement.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!achievement) {
        return res.status(404).json({
          success: false,
          message: 'Achievement not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Achievement deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting achievement:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting achievement',
        error: error.message
      });
    }
  }

  // Get achievement statistics
  async getStatistics(req, res) {
    try {
      const stats = await Achievement.getStats();
      
      // Get additional statistics
      const categoryStats = await Achievement.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const levelStats = await Achievement.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$level', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const monthlyStats = await Achievement.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]);

      res.status(200).json({
        success: true,
        data: {
          overview: stats,
          byCategory: categoryStats,
          byLevel: levelStats,
          monthly: monthlyStats
        }
      });
    } catch (error) {
      console.error('Error getting statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving statistics',
        error: error.message
      });
    }
  }

  // Get recent achievements
  async getRecentAchievements(req, res) {
    try {
      const { limit = 5, type } = req.query;
      
      const achievements = await Achievement.getRecent(parseInt(limit), type);

      res.status(200).json({
        success: true,
        data: achievements
      });
    } catch (error) {
      console.error('Error getting recent achievements:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving recent achievements',
        error: error.message
      });
    }
  }

  // Search achievements
  async searchAchievements(req, res) {
    try {
      const { q, type, limit = 10 } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const filters = { isActive: true };
      if (type) filters.type = type;

      const searchQuery = {
        ...filters,
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { student: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ]
      };

      const achievements = await Achievement.find(searchQuery)
        .sort({ date: -1 })
        .limit(parseInt(limit))
        .lean();

      res.status(200).json({
        success: true,
        data: achievements
      });
    } catch (error) {
      console.error('Error searching achievements:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching achievements',
        error: error.message
      });
    }
  }

  // Get unique values for filters
  async getFilterOptions(req, res) {
    try {
      const [categories, levels, years, grades] = await Promise.all([
        Achievement.distinct('category', { isActive: true }),
        Achievement.distinct('level', { isActive: true }),
        Achievement.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: { $year: '$date' } } },
          { $sort: { _id: -1 } }
        ]),
        Achievement.distinct('grade', { isActive: true })
      ]);

      res.status(200).json({
        success: true,
        data: {
          categories: categories.sort(),
          levels: levels.sort(),
          years: years.map(y => y._id).sort((a, b) => b - a),
          grades: grades.sort()
        }
      });
    } catch (error) {
      console.error('Error getting filter options:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving filter options',
        error: error.message
      });
    }
  }
}

module.exports = new AchievementController();