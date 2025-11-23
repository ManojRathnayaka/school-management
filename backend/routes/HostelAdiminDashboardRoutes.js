const express = require('express');
const router = express.Router();

// Import middleware
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Import all controller functions
const {
  // Auth
  login,
  
  // Dashboard
  getDashboardStats,
  getRecentApplications,
  getHostelOccupancy,
  
  // Applications
  getApplications,
  updateApplicationStatus,
  
  // Hostels
  getHostels,
  createHostel,
  updateHostel,
  
  // Users
  getUsers,
  createUser,
  updateUserStatus,
  
  // Settings
  getSettings,
  updateSettings,
  
  // Reports
  getReportStats,
  getProgramStats,
  getMonthlyTrends
} = require('../controllers/mainController');

// ==================== AUTHENTICATION ROUTES ====================
router.post('/auth/login', login);

// ==================== DASHBOARD ROUTES ====================
router.get('/dashboard/stats', authenticate, authorize(['admin', 'warden']), getDashboardStats);
router.get('/dashboard/recent-applications', authenticate, authorize(['admin', 'warden']), getRecentApplications);
router.get('/dashboard/hostel-occupancy', authenticate, authorize(['admin', 'warden']), getHostelOccupancy);

// ==================== APPLICATION ROUTES ====================
router.get('/applications', authenticate, authorize(['admin', 'warden']), getApplications);
router.put('/applications/:id/status', authenticate, authorize(['admin', 'warden']), updateApplicationStatus);

// ==================== HOSTEL ROUTES ====================
router.get('/hostels', authenticate, authorize(['admin', 'warden']), getHostels);
router.post('/hostels', authenticate, authorize(['admin']), createHostel);
router.put('/hostels/:id', authenticate, authorize(['admin']), updateHostel);

// ==================== USER ROUTES ====================
router.get('/users', authenticate, authorize(['admin']), getUsers);
router.post('/users', authenticate, authorize(['admin']), createUser);
router.put('/users/:id/status', authenticate, authorize(['admin']), updateUserStatus);

// ==================== SETTINGS ROUTES ====================
router.get('/settings', authenticate, authorize(['admin']), getSettings);
router.put('/settings', authenticate, authorize(['admin']), updateSettings);

// ==================== REPORTS ROUTES ====================
router.get('/reports/stats', authenticate, authorize(['admin', 'warden']), getReportStats);
router.get('/reports/programs', authenticate, authorize(['admin', 'warden']), getProgramStats);
router.get('/reports/monthly-trends', authenticate, authorize(['admin', 'warden']), getMonthlyTrends);

module.exports = router;