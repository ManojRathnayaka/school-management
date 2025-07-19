import { pool } from "../config/db.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

export async function createUser({
  first_name,
  last_name,
  email,
  password_hash,
  role,
  is_approved = 0,
}) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, email, password_hash, role, is_approved) VALUES (?, ?, ?, ?, ?, ?)",
    [first_name, last_name, email, password_hash, role, is_approved]
  );
}

export async function getPendingUsers() {
  const [rows] = await pool.query(
    "SELECT user_id, first_name, last_name, email, role FROM users WHERE is_approved = 0"
  );
  return rows;
}

export async function approveUser(user_id) {
  await pool.query("UPDATE users SET is_approved = 1 WHERE user_id = ?", [
    user_id,
  ]);
}
