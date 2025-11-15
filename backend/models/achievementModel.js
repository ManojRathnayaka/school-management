import { pool } from "../config/db.js";

export async function createAchievement({
  student_name,
  grade,
  category,
  title,
  details,
  image_path,
  achievement_date,
}) {
  const [result] = await pool.query(
    `INSERT INTO achievements (student_name, grade, category, title, details, image_path, achievement_date) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [student_name, grade, category, title, details, image_path, achievement_date]
  );
  return result.insertId;
}

export async function getAllAchievements({ search, grade, category, limit, offset }) {
  let query = "SELECT * FROM achievements WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (student_name LIKE ? OR title LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (grade) {
    query += " AND grade = ?";
    params.push(grade);
  }

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  query += " ORDER BY achievement_date DESC, created_at DESC";

  if (limit) {
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }

  const [rows] = await pool.query(query, params);
  return rows;
}

export async function getAchievementsCount({ search, grade, category }) {
  let query = "SELECT COUNT(*) as total FROM achievements WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (student_name LIKE ? OR title LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (grade) {
    query += " AND grade = ?";
    params.push(grade);
  }

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].total;
}

export async function getAchievementById(achievement_id) {
  const [rows] = await pool.query(
    "SELECT * FROM achievements WHERE achievement_id = ?",
    [achievement_id]
  );
  return rows[0];
}

export async function updateAchievement(achievement_id, {
  student_name,
  grade,
  category,
  title,
  details,
  image_path,
  achievement_date,
}) {
  const [result] = await pool.query(
    `UPDATE achievements 
     SET student_name = ?, grade = ?, category = ?, title = ?, details = ?, 
         image_path = ?, achievement_date = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE achievement_id = ?`,
    [student_name, grade, category, title, details, image_path, achievement_date, achievement_id]
  );
  return result;
}

export async function deleteAchievement(achievement_id) {
  const [result] = await pool.query(
    "DELETE FROM achievements WHERE achievement_id = ?",
    [achievement_id]
  );
  return result;
}

export async function getAchievementsByCategory(category, limit = 10) {
  const [rows] = await pool.query(
    `SELECT * FROM achievements WHERE category = ? 
     ORDER BY achievement_date DESC, created_at DESC LIMIT ?`,
    [category, limit]
  );
  return rows;
}