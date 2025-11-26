import {
  createBooking as createBookingModel,
  getApprovedAndPendingBookings,
  getApprovedBookingSlots,
  getPendingBookings,
  updateBookingStatus
} from "../models/AuditoriumBooking.js";

import { pool } from "../config/db.js";

//CREATE BOOKING

export const createBookings = async (req, res) => {
  try {
    const tokenUser = req.user || {};
    const requested_by =
      tokenUser?.email || tokenUser?.username || "unknown_user";

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

//GET APPROVED + PENDING BOOKINGS

export async function handleGetApprovedAndPendingBookingss(req, res) {
  try {
    const result = await getApprovedAndPendingBookings();

    const rows =
      Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    res.json(rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
}

//GET AVAILABLE SLOTS 

export async function handleGetAvailableSlotss(req, res) {
  try {
    const rows = await getApprovedBookingSlots();

    const formatDate = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const bookedMap = {};

    rows.forEach((row) => {
      const dateKey =
        row.event_date instanceof Date
          ? formatDate(row.event_date)
          : String(row.event_date).split("T")[0];

      if (!bookedMap[dateKey]) bookedMap[dateKey] = [];

      bookedMap[dateKey].push({
        start_time: row.start_time,
        end_time: row.end_time
      });
    });

    const today = new Date();
    const slots = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const dateStr = formatDate(d);

      slots.push({
        date: dateStr,
        status: bookedMap[dateStr]?.length ? "booked" : "available",
        bookings: bookedMap[dateStr] || []
      });
    }

    res.json(slots);
  } catch (err) {
    console.error("Error fetching available slots:", err);
    res.status(500).json({ message: "Server error" });
  }
}


//GET PENDING BOOKINGS

export async function handleGetPendingBookings(req, res) {
  try {
    const rows = await getPendingBookings();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching pending bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
}

//GET APPROVED BOOKINGS FOR A SPECIFIC DATE

export async function handleGetApprovedBookingsByDate(req, res) {
  const { date } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT event_name, start_time, end_time, attendees, requested_by
      FROM auditorium_bookings
      WHERE event_date = ? AND status = 'approved'
      ORDER BY start_time ASC
      `,
      [date]
    );
    console.log("done specific date")

    res.json(rows);
  } catch (err) {
    console.error("Error fetching bookings for date:", err);
    res.status(500).json({ message: "Server error" });
  }
}


//APPROVE / REJECT BOOKING 

export async function handleUpdateBookingStatus(req, res) {
  const { id } = req.params;
  const { status, reason } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT requested_by, event_name, event_date FROM auditorium_bookings WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = rows[0];

    const teacherId = booking.requested_by;

    // Update booking
    await updateBookingStatus(id, status, reason);

    const formattedDate = new Date(booking.event_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    let message = "";

    if (status === "approved") {
      message = `Your booking '${booking.event_name}' on ${formattedDate} has been approved.`;
    } else if (status === "rejected") {
      message = `Your booking '${booking.event_name}' on ${formattedDate} was rejected.`;
    }

    if (message) {
      await pool.query(
        "INSERT INTO notifications (user_email, message) VALUES (?, ?)",
        [teacherId, message]
      );
    }

    res.json({ message: `Booking ${status}` });
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).json({ message: "Server error" });
  }
}

