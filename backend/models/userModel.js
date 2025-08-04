import { pool } from "../config/db.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

export async function createUser({
  first_name,
  last_name,
  email,
  password_hash,
  role,
  must_reset_password = false,
}) {
  const [result] = await pool.query(
    "INSERT INTO users (first_name, last_name, email, password_hash, role, must_reset_password) VALUES (?, ?, ?, ?, ?, ?)",
    [first_name, last_name, email, password_hash, role, must_reset_password]
  );
  return result;
}

export async function updatePassword(user_id, password_hash) {
  const [result] = await pool.query(
    "UPDATE users SET password_hash = ?, must_reset_password = 0, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
    [password_hash, user_id]
  );
  return result;
}

export async function updateUser(user_id, userData) {
  const { first_name, last_name, email } = userData;
  
  const [result] = await pool.query(`
    UPDATE users 
    SET first_name = ?, last_name = ?, email = ?
    WHERE user_id = ?
  `, [first_name, last_name, email, user_id]);
  
  return result;
}