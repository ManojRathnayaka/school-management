import {pool} from "../config/db.js";

export const createBooking = async (data) => {
  const {
    
    eventName,
    eventDate,
    startTime,
    endTime,
    attendees,
    eventType,
    equipment,
    notes,
    requested_by
  } = data;

  const [result] = await pool.query(
    `INSERT INTO auditorium_bookings 
      ( event_name, event_date, start_time, end_time, attendees, event_type, equipment, notes,requested_by, status)
      VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, 'Pending')`,
    [ eventName, eventDate, startTime, endTime, attendees, eventType, equipment, notes, requested_by]
  );

  return result.insertId;
};



export async function getApprovedAndPendingBookings() {
 const [rows] = await pool.query("SELECT * FROM auditorium_bookings WHERE status IN ('approved', 'pending','rejected') ORDER BY event_date, start_time");
 return [rows];
}

export async function getApprovedBookingSlots() {
  const [rows] = await pool.query("SELECT event_date, start_time, end_time FROM auditorium_bookings WHERE status = 'approved' ORDER BY event_date, start_time");
  return rows;
}


// Get all pending bookings
export async function getPendingBookings() {
  const [rows] = await pool.query(
    "SELECT * FROM auditorium_bookings WHERE status = 'pending' ORDER BY event_date, start_time"
  );
  return rows;
}

// Update a booking’s status and optionally add a rejection reason
export async function updateBookingStatus(id, newStatus, rejectionReason) {
  await pool.query(
    "UPDATE auditorium_bookings SET status = ?, rejection_reason = ? WHERE id = ?",
    [newStatus, rejectionReason || null, id]
  );
}


