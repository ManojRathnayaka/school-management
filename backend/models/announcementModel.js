import { pool } from "../config/db.js";

// Create new announcement
export async function createAnnouncement(title, content, createdBy) {
  const query = `
    INSERT INTO announcements (title, content, created_by)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.execute(query, [title, content, createdBy]);
  return result.insertId;
}

// Get all announcements with creator info (latest first)
export async function getAllAnnouncements(limit = null) {
  let query = `
    SELECT 
      a.announcement_id,
      a.title,
      a.content,
      a.created_at,
      a.updated_at,
      u.first_name,
      u.last_name,
      u.role
    FROM announcements a
    JOIN users u ON a.created_by = u.user_id
    ORDER BY a.created_at DESC
  `;
  
  if (limit) {
    query += ` LIMIT ${parseInt(limit, 10)}`;
  }
  
  const [rows] = await pool.query(query);
  return rows;
}

// Get single announcement by ID
export async function getAnnouncementById(announcementId) {
  const query = `
    SELECT 
      a.announcement_id,
      a.title,
      a.content,
      a.created_by,
      a.created_at,
      a.updated_at,
      u.first_name,
      u.last_name,
      u.role
    FROM announcements a
    JOIN users u ON a.created_by = u.user_id
    WHERE a.announcement_id = ?
  `;
  const [rows] = await pool.execute(query, [announcementId]);
  return rows[0];
}

// Update announcement
export async function updateAnnouncement(announcementId, title, content) {
  const query = `
    UPDATE announcements 
    SET title = ?, content = ?
    WHERE announcement_id = ?
  `;
  const [result] = await pool.execute(query, [title, content, announcementId]);
  return result.affectedRows > 0;
}

// Delete announcement
export async function deleteAnnouncement(announcementId) {
  const query = `DELETE FROM announcements WHERE announcement_id = ?`;
  const [result] = await pool.execute(query, [announcementId]);
  return result.affectedRows > 0;
}

// Get latest N announcements for dashboard
export async function getLatestAnnouncements(limit = 5) {
  return getAllAnnouncements(limit);
}