import { pool } from "../config/db.js";

export async function createTeacher({ user_id, contact_number, grade = null }) {
  const [result] = await pool.query(
    "INSERT INTO teachers (user_id, contact_number, grade) VALUES (?, ?, ?)",
    [user_id, contact_number, grade]
  );
  return result;
} 