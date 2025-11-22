import { Router } from "express";
import multer from "multer";
import { 
  registerStudent, 
  getStudents, 
  updateStudent, 
  deleteStudent, 
  getStudentParents,
  bulkRegisterStudents,
  resetStudentPassword,
  resetParentPassword
} from "../controllers/studentController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

// multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  registerStudent
);

router.post(
  "/bulk-register",
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  upload.single("studentCsv"),
  bulkRegisterStudents
);

router.get('/',
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  getStudents
);

router.put('/:studentId',
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  updateStudent
);

router.delete('/:studentId',
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  deleteStudent
);

router.get('/:studentId/parents',
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  getStudentParents
);

router.post('/:studentId/reset-password',
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  resetStudentPassword
);

router.post('/:studentId/parent/reset-password',
  authenticateJWT,
  authorizeRoles("principal", "teacher"),
  resetParentPassword
);

export default router;