import { pool } from "../config/db.js";

// Get all hostels with optional filters
const Hostel = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT hostel_id, name, type, capacity, address, created_at
       FROM hostels
       ORDER BY name ASC`
    );
    return rows;
  }
};

export default Hostel;
