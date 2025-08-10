import { Router } from "express";
import {createBookings,handleGetApprovedAndPendingBookingss,handleGetAvailableSlotss, handleGetPendingBookings, handleUpdateBookingStatus} from "../controllers/auditoriumController.js";
import {
  authenticateJWT,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = Router();

// Teacher or Principal can submit a booking request
router.post(
  "/book",
  authenticateJWT,
  authorizeRoles("teacher", "principal"),
  createBookings
);

router.get("/approved",
  authenticateJWT,
  authorizeRoles("teacher"),
   handleGetApprovedAndPendingBookingss
  );
router.get("/slots",
  authenticateJWT,
  authorizeRoles("teacher"),
   handleGetAvailableSlotss);


// Only principals can access these
router.get("/pending",
   authenticateJWT, authorizeRoles("principal"),
    handleGetPendingBookings);

router.put("/:id/approve",
   authenticateJWT, 
   authorizeRoles("principal"), (req, res) =>
  handleUpdateBookingStatus({ ...req, body: { status: "approved" } }, res)
);
router.put("/:id/reject", 
  authenticateJWT, authorizeRoles("principal"), (req, res) =>
  handleUpdateBookingStatus({ ...req, body: { status: "rejected", reason: req.body.reason } }, res)
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
