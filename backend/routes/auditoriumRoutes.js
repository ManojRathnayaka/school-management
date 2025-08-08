import { Router } from "express";
import {createBookings} from "../controllers/auditoriumController.js";
import {
  authenticateJWT,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = Router();

// Teacher or Principal can submit a booking request
router.post(
  "/book",
  authenticateJWT,
  authorizeRoles("teacher"),
  createBookings
);

// // Only Principal can view pending requests
// router.get(
//   "/pending",
//   authenticateJWT,
//   authorizeRoles("principal"),
//   getPendingRequests
// );

// // Only Principal can update status (approve/reject)
// router.put(
//   "/:id",
//   authenticateJWT,
//   authorizeRoles("principal"),
//   updateBookingStatus
// );

// // Public route – Anyone can view approved bookings (no auth needed)
// router.get("/approved", getApprovedBookings);

export default router;



// // Get all bookings (for allocation list)
// router.get("/all", handleGetAllBookings);

// // Get available dates (for calendar)
// router.get("/available-dates", handleGetAvailableDates);
