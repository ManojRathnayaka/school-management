import { getUnreadNotifications,markNotificationRead } from "../models/notifications.js";

export async function handleGetUnreadNotifications(req, res) {
  try {
    // 🔥 FIXED: wrong JWT field
    const userId = req.user.user_id;

    const notifications = await getUnreadNotifications(userId);
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function handleMarkNotificationRead(req, res) {
  const { id } = req.params;
  try {
    await markNotificationRead(id);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking notification read:", err);
    res.status(500).json({ message: "Server error" });
  }
}