import {pool} from "../config/db.js";

export async function getUnreadNotifications(user_email) {
  const [rows] = await pool.query(
    "SELECT id, message, created_at FROM notifications WHERE user_email = ? AND read_at IS NULL ORDER BY created_at DESC",
    [user_email]
  );
  return rows;
}

export async function markNotificationRead(notificationId) {
  await pool.query(
    "UPDATE notifications SET read_at = NOW() WHERE id = ?",
    [notificationId]
  );
}