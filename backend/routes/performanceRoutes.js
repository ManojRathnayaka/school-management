import express from 'express';

import { getClassPerformances, updateStudentPerformances, getStudentPerformances } from '../controllers/performanceController.js';
const router = express.Router();
// const performanceController = require('../controllers/performanceController');
import {
  authenticateJWT,
  authorizeRoles
} from "../middleware/authMiddleware.js";
// Get performance data for a class
router.get('/:classId',
    authenticateJWT,
  authorizeRoles("teacher"),
    getClassPerformances);

// Update performance for a specific student
router.put('/:studentId',
    authenticateJWT,
  authorizeRoles("teacher"),
     updateStudentPerformances);

// Get performance details for a specific student
router.get('/student/:studentId',
    authenticateJWT,
  authorizeRoles("teacher"),
     getStudentPerformances);

export default router;
