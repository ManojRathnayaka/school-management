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
      VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, 'approved')`,
    [ eventName, eventDate, startTime, endTime, attendees, eventType, equipment, notes, requested_by]
  );

  return result.insertId;
};



export async function getApprovedAndPendingBookings() {
 const [rows] = await pool.query("SELECT * FROM auditorium_bookings WHERE status IN ('approved', 'pending') ORDER BY event_date, start_time");
 return [rows];
}

export async function getApprovedBookingSlots() {
  const [rows] = await pool.query("SELECT event_date, start_time, end_time FROM auditorium_bookings WHERE status = 'approved' ORDER BY event_date, start_time");
  return rows;
}

// export const getPendingBookings = async () => {
//   const [rows] = await pool.query(
//     "SELECT * FROM auditorium_bookings WHERE status = 'pending'"
//   );
//   return rows;
// };

// export const getApprovedBookings = async () => {
//   const [rows] = await pool.query(
//     "SELECT * FROM auditorium_bookings WHERE status = 'approved'"
//   );
//   return rows;
// };

// export const updateBookingStatus = async (id, status) => {
//   await pool.query(
//     "UPDATE auditorium_bookings SET status = ? WHERE id = ?",
//     [status, id]
//   );
// };

// export const getBookingsByTeacher = async (teacher_id) => {
//   const [rows] = await pool.query(
//     "SELECT * FROM auditorium_bookings WHERE teacher_id = ?",
//     [teacher_id]
//   );
//   return rows;
// };
