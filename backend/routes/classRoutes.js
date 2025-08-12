import express from 'express';
import {
  authenticateJWT,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();
// const classController = require('../controllers/classController');
import { getStudentsForClasses,getClassesAssignedToTeacher } from '../controllers/classController.js';

// Get all students for a class
router.get('/:classId/students',
    authenticateJWT,
  authorizeRoles("teacher"),
     getStudentsForClasses);


     // Route to get all classes assigned to a teacher
router.get('/teacher/:teacherId', 
  authenticateJWT,
  authorizeRoles("teacher"), 
  getClassesAssignedToTeacher
);

export default router;
