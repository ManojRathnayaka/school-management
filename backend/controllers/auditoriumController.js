// 2️⃣ controllers/auditoriumController.js
import { createBooking as createBookingModel, getApprovedAndPendingBookings, getApprovedBookingSlots,  getPendingBookings, updateBookingStatus} from "../models/AuditoriumBooking.js";
import {pool} from "../config/db.js";
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

export async function handleGetApprovedAndPendingBookingss(req, res) {
  try {
    // get the raw result from the DB helper
    const result = await getApprovedAndPendingBookings();

    // If your helper returns [rows, fields], take the first element; otherwise use the result directly
    const rows = Array.isArray(result) && Array.isArray(result[0])
      ? result[0]
      : result;

    // Send the array of bookings directly; res.json can accept arrays:contentReference[oaicite:2]{index=2}
    res.json(rows);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
}


export async function handleGetAvailableSlotss(req, res) {
  try {
    const rows = await getApprovedBookingSlots();

    // Helper to format Date objects as YYYY-MM-DD in local time
    const formatDate = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    // Build lookup of bookings by local date
    const bookedMap = {};
    rows.forEach((row) => {
      // row.event_date can be a Date object or a string; handle both
      const dateKey =
        row.event_date instanceof Date
          ? formatDate(row.event_date)
          : String(row.event_date).split("T")[0];
      if (!bookedMap[dateKey]) bookedMap[dateKey] = [];
      bookedMap[dateKey].push({
        start_time: row.start_time,
        end_time: row.end_time,
      });
    });

    // Build 14-day window using local dates
    const today = new Date();
    const slots = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i
      );
      const dateStr = formatDate(date);
      const bookings = bookedMap[dateStr] || [];
      slots.push({
        date: dateStr,
        status: bookings.length > 0 ? "booked" : "available",
        bookings,
      });
    }

    res.json(slots);
  } catch (err) {
    console.error("Error fetching available slots:", err);
    res.status(500).json({ message: "Server error" });
  }
}



// principal GET /api/auditorium/pending
export async function handleGetPendingBookings(req, res) {
  try {
    const rows = await getPendingBookings();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching pending bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
}


export async function handleUpdateBookingStatus(req, res) {
  const { id } = req.params;
  const { status, reason } = req.body;

  try {
    // Fetch booking
    const [rows] = await pool.query(
      "SELECT requested_by, event_name, event_date FROM auditorium_bookings WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = rows[0];

    // 🔥 FIXED: lookup teacher in USERS table, not bookings
    const [[user]] = await pool.query(
      "SELECT user_id FROM users WHERE email = ?",
      [booking.requested_by]
    );

    if (!user) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const teacherId = user.user_id;

    // Update booking
    await updateBookingStatus(id, status, reason);

    // Notification message
    let message = "";

    const formattedDate = new Date(booking.event_date)
  .toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });


    if (status === "approved") {
      message = `Your booking '${booking.event_name}' on ${formattedDate} has been approved.`;
    } else if (status === "rejected") {
      message = `Your booking '${booking.event_name}' on ${formattedDate} was rejected.`;
    }

    // Save notification
    if (message) {
      await pool.query(
        "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
        [teacherId, message]
      );
    }

    res.json({ message: `Booking ${status}` });

  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).json({ message: "Server error" });
  }
}






