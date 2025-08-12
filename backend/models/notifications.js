import {pool} from "../config/db.js";

export async function getUnreadNotifications(userId) {
  const [rows] = await pool.query(
    "SELECT id, message, created_at FROM notifications WHERE user_id = ? AND read_at IS NULL ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

export async function markNotificationRead(notificationId) {
  await pool.query(
    "UPDATE notifications SET read_at = NOW() WHERE id = ?",
    [notificationId]
  );
}