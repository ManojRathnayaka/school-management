import { pool } from "../config/db.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

export async function getUserById(user_id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [user_id]);
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

export async function resetUserPasswordByAdmin(user_id, password_hash) {
  const [result] = await pool.query(
    "UPDATE users SET password_hash = ?, must_reset_password = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
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

export async function deleteUser(user_id) {
  const [result] = await pool.query(`
    DELETE FROM users 
    WHERE user_id = ?
  `, [user_id]);
   
  return result;
}

export async function getUsers({ 
  page = 1, 
  limit = 10, 
  roles = null, 
  search = null,
  excludeRoles = null // New parameter to exclude specific roles
}) {
  const offset = (page - 1) * limit;
  let query = "SELECT user_id, first_name, last_name, email, role, created_at FROM users";
  let countQuery = "SELECT COUNT(*) as total FROM users";
  const params = [];
  const conditions = [];

  // Add role filter (include specific roles)
  if (roles && roles.length > 0) {
    const placeholders = roles.map(() => '?').join(',');
    conditions.push(`role IN (${placeholders})`);
    params.push(...roles);
  }
  
  // Add exclude roles filter (exclude specific roles)
  if (excludeRoles && excludeRoles.length > 0) {
    const placeholders = excludeRoles.map(() => '?').join(',');
    conditions.push(`role NOT IN (${placeholders})`);
    params.push(...excludeRoles);
  }

  // Add search filter
  if (search) {
    conditions.push("(first_name LIKE ? OR last_name LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  // Apply conditions
  if (conditions.length > 0) {
    const whereClause = " WHERE " + conditions.join(" AND ");
    query += whereClause;
    countQuery += whereClause;
  }

  // Add pagination
  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
     
  // Execute queries
  const [users] = await pool.query(query, [...params, limit, offset]);
  const [countResult] = await pool.query(countQuery, params);
     
  const total = countResult[0].total;
  const totalPages = Math.ceil(total / limit);

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers: total,
      limit
    }
  };
}