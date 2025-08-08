// 2️⃣ controllers/auditoriumController.js
import { createBooking as createBookingModel } from "../models/AuditoriumBooking.js";

export const createBookings = async (req, res) => {
  try {
    const tokenUser = req.user || {};
    const requested_by = tokenUser?.email || tokenUser?.username || "unknown_user";
    const {
      eventName,
      eventDate,
      startTime,
      endTime,
      attendees,
      eventType,
      equipment,
      notes
    } = req.body;

    const bookingId = await createBookingModel({
      
      eventName,
      eventDate,
      startTime,
      endTime,
      attendees,
      eventType,
      equipment,
      notes,
      requested_by
    });

    res.status(201).json({ message: "Booking request submitted", bookingId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit booking request" });
  }
};

// Principal views pending requests
export const getPendingRequests = async (req, res) => {
  try {
    const bookings = await BookingModel.getPendingBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending requests" });
  }
};

// Principal approves/rejects
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await BookingModel.updateBookingStatus(id, status);
    res.json({ message: `Booking ${status}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to update booking status" });
  }
};

// Public view of approved bookings
export const getApprovedBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.getApprovedBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch approved bookings" });
  }
};
