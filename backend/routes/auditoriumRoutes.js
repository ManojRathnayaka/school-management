import { Router } from "express";
import {createBookings,handleGetApprovedAndPendingBookingss,handleGetAvailableSlotss, handleGetPendingBookings, handleUpdateBookingStatus} from "../controllers/auditoriumController.js";
import {
  authenticateJWT,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = Router();


router.post(
  "/book",
  authenticateJWT,
  authorizeRoles("teacher", "principal"),
  createBookings
);

router.get("/approved",
  authenticateJWT,
  authorizeRoles("teacher", "principal"),
   handleGetApprovedAndPendingBookingss
  );
router.get("/slots",
  authenticateJWT,
  authorizeRoles("teacher", "principal"),
   handleGetAvailableSlotss);

router.get("/pending",
   authenticateJWT, authorizeRoles("principal", "principal"),
    handleGetPendingBookings);

router.put("/:id/approve",
  authenticateJWT,
  authorizeRoles("principal"),
  (req, res) => {
    // 🔥 FIXED: do not replace req object
    req.body.status = "approved";
    handleUpdateBookingStatus(req, res);
  }
);
router.put("/:id/reject",
  authenticateJWT,
  authorizeRoles("principal"),
  (req, res) => {
    // 🔥 FIXED
    req.body.status = "rejected";
    handleUpdateBookingStatus(req, res);
  }
);
  



export default router;




