const express = require('express');
const { body } = require('express-validator');
const achievementController = require('../controllers/achievementController');
const router = express.Router();

// Validation middleware for achievement creation and updates
const achievementValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('student')
    .trim()
    .notEmpty()
    .withMessage('Student name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Student name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.]+$/)
    .withMessage('Student name can only contain letters, spaces, and periods'),
  
  body('grade')
    .trim()
    .notEmpty()
    .withMessage('Grade is required')
    .matches(/^Grade\s?(0?[6-9]|1[0-3])[A-Z]?$/i)
    .withMessage('Grade must be in format "Grade 6A" to "Grade 13Z"'),
  
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be in valid ISO format')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
      
      if (date > now) {
        throw new Error('Date cannot be in the future');
      }
      if (date < fiveYearsAgo) {
        throw new Error('Date cannot be more than 5 years ago');
      }
      return true;
    }),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Science', 'Mathematics', 'Literature', 'Art', 'Music', 'Technology', 
           'Swimming', 'Netball', 'Athletics', 'Basketball', 'Volleyball', 'Tennis'])
    .withMessage('Invalid category selected'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('level')
    .notEmpty()
    .withMessage('Level is required')
    .isIn(['School', 'District', 'Provincial', 'National', 'International'])
    .withMessage('Invalid level selected'),
  
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Position must be between 2 and 50 characters'),
  
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['academic', 'sports'])
    .withMessage('Type must be either academic or sports'),
  
  // Conditional validation for academic achievements
  body('teacher')
    .if(body('type').equals('academic'))
    .trim()
    .notEmpty()
    .withMessage('Teacher is required for academic achievements')
    .isLength({ min: 2, max: 100 })
    .withMessage('Teacher name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.]+$/)
    .withMessage('Teacher name can only contain letters, spaces, and periods'),
  
  body('points')
    .if(body('type').equals('academic'))
    .notEmpty()
    .withMessage('Points are required for academic achievements')
    .isInt({ min: 0, max: 100 })
    .withMessage('Points must be a number between 0 and 100'),
  
  // Conditional validation for sports achievements
  body('coach')
    .if(body('type').equals('sports'))
    .trim()
    .notEmpty()
    .withMessage('Coach is required for sports achievements')
    .isLength({ min: 2, max: 100 })
    .withMessage('Coach name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.]+$/)
    .withMessage('Coach name can only contain letters, spaces, and periods'),
  
  body('records')
    .if(body('type').equals('sports'))
    .trim()
    .notEmpty()
    .withMessage('Records are required for sports achievements')
    .isLength({ min: 5, max: 200 })
    .withMessage('Records must be between 5 and 200 characters'),
  
  // Optional fields validation
  body('image')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image must be a valid URL'),
];

// Query validation middleware
const queryValidation = [
  // Validate type parameter
  body('type')
    .optional()
    .isIn(['academic', 'sports'])
    .withMessage('Type must be either academic or sports'),
  
  // Validate pagination parameters
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  // Validate sort parameters
  body('sortBy')
    .optional()
    .isIn(['date', 'title', 'student', 'level', 'category'])
    .withMessage('Invalid sort field'),
  
  body('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),
];

// Routes

// GET /api/achievements - Get all achievements with filtering and pagination
router.get('/', achievementController.getAllAchievements);

// GET /api/achievements/statistics - Get achievement statistics
router.get('/statistics', achievementController.getStatistics);

// GET /api/achievements/recent - Get recent achievements
router.get('/recent', achievementController.getRecentAchievements);

// GET /api/achievements/search - Search achievements
router.get('/search', achievementController.searchAchievements);

// GET /api/achievements/filters - Get filter options
router.get('/filters', achievementController.getFilterOptions);

// GET /api/achievements/type/:type - Get achievements by type (academic or sports)
router.get('/type/:type', achievementController.getAchievementsByType);

// GET /api/achievements/:id - Get single achievement by ID
router.get('/:id', achievementController.getAchievementById);

// POST /api/achievements - Create new achievement
router.post('/', achievementValidation, achievementController.createAchievement);

// PUT /api/achievements/:id - Update achievement
router.put('/:id', achievementValidation, achievementController.updateAchievement);

// DELETE /api/achievements/:id - Delete (soft delete) achievement
router.delete('/:id', achievementController.deleteAchievement);

// Error handling middleware specific to this router
router.use((error, req, res, next) => {
  console.error('Achievement route error:', error);
  
  // Handle MongoDB validation errors
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages
    });
  }
  
  // Handle MongoDB cast errors (invalid ObjectId)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      message: 'Invalid achievement ID format'
    });
  }
  
  // Handle duplicate key errors
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Achievement with similar details already exists'
    });
  }
  
  // Generic error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

module.exports = router;