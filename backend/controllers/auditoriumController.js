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
    // Always fetch the booking so booking.event_name and booking.event_date are defined
    const [rows] = await pool.query(
      "SELECT requested_by, event_name, event_date FROM auditorium_bookings WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const booking = rows[0];

    // Look up the teacher’s numeric ID in the users table
    const [userRows] = await pool.query(
      "SELECT id FROM auditorium_bookings WHERE requested_by = ?",
      [booking.requested_by]
    );
    if (userRows.length === 0) {
      throw new Error("No user found with email " + booking.requested_by);
    }
    const teacherId = userRows[0].id;

    // Update the booking’s status (and rejection reason if provided)
    await updateBookingStatus(id, status, reason);

    // Build a notification message for approvals or rejections
    let message = "";
    if (status === "approved") {
      message = `Your booking '${booking.event_name}' on ${booking.event_date} has been approved`;
    } else if (status === "rejected") {
      message = `Your booking '${booking.event_name}' on ${booking.event_date} was rejected`;
    }

    // Insert a notification if there is a message
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






// // Principal views pending requests
// export const getPendingRequests = async (req, res) => {
//   try {
//     const bookings = await BookingModel.getPendingBookings();
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch pending requests" });
//   }
// };

// // Principal approves/rejects
// export const updateBookingStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     await BookingModel.updateBookingStatus(id, status);
//     res.json({ message: `Booking ${status}` });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update booking status" });
//   }
// };

// // Public view of approved bookings
// export const getApprovedBookings = async (req, res) => {
//   try {
//     const bookings = await BookingModel.getApprovedBookings();
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch approved bookings" });
//   }
// };


// export const handleGetAllBookings = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM auditorium_bookings ORDER BY event_date ASC");
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch bookings" });
//   }
// };

// export const handleGetAvailableDates = async (req, res) => {
//   try {
//     const [bookedDates] = await pool.query("SELECT DISTINCT event_date FROM auditorium_bookings WHERE status = 'approved'");
    
//     const bookedSet = new Set(bookedDates.map(row => row.event_date.toISOString().split('T')[0]));

//     // Generate a list of next 14 days
//     const today = new Date();
//     const days = Array.from({ length: 14 }).map((_, i) => {
//       const d = new Date(today);
//       d.setDate(today.getDate() + i);
//       return d.toISOString().split('T')[0];
//     });

//     const availableDates = days.filter(d => !bookedSet.has(d));
//     res.json({ availableDates, bookedDates: [...bookedSet] });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch available dates" });
//   }
// };



