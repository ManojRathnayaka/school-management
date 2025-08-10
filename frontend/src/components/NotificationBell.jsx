
import React, { useState, useEffect } from "react";
import axios from "axios";
// You can use any bell icon you like; here's a simple SVG:
const BellIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.07-1.64-5.64-4.5-6.32v-.68a1.5 1.5 0 00-3 0v.68A6.5 6.5 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m5 0v1a2 2 0 11-4 0v-1m4 0H8" />
  </svg>
);

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications/unread", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/read/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <BellIcon />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow z-10">
          <h4 className="font-bold p-2 border-b">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="p-2 text-gray-500">No notifications</p>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className="p-2 border-b">
                  <div className="flex justify-between items-center">
                    <span>{n.message}</span>
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-blue-600 text-xs ml-2"
                    >
                      Dismiss
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
