// 🔥 NEW: import toast system
import toast, { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";

const PrincipalAuditoriumManagement = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch pending bookings from the server
  const fetchPendingBookings = async () => {
    try {
      const res = await axios.get("/api/auditorium/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingBookings(res.data);
    } catch (err) {
      console.error("Failed to load pending bookings", err);
      toast.error("Failed to load pending bookings"); // 🔥 NEW
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this booking?")) return;
    

    const loadingToast = toast.loading("Approving booking..."); // 🔥 NEW

    try {
      await axios.put(
        `/api/auditorium/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking approved!", { id: loadingToast }); // 🔥 NEW
      fetchPendingBookings();
    } catch (err) {
      console.error("Failed to approve booking", err);
      toast.error("Failed to approve booking", { id: loadingToast }); // 🔥 NEW
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection (optional):", "");
    if (reason === null) return;

    const loadingToast = toast.loading("Rejecting booking..."); // 🔥 NEW

    try {
      await axios.put(
        `/api/auditorium/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking rejected!", { id: loadingToast }); // 🔥 NEW
      fetchPendingBookings();
    } catch (err) {
      console.error("Failed to reject booking", err);
      toast.error("Failed to reject booking", { id: loadingToast }); // 🔥 NEW
    }
  };

  return (
    <Layout activePage="events">
      {/* 🔥 NEW: Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">
          Pending Auditorium Booking Requests
        </h2>

        {pendingBookings.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 text-left">Event</th>
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1 text-left">Time</th>
                <th className="px-2 py-1 text-left">Attendees</th>
                <th className="px-2 py-1 text-left">Requester</th>
                <th className="px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pendingBookings.map((b) => (
                <tr key={b.id}>
                  <td className="border-t px-2 py-1">{b.event_name}</td>

                  <td className="border-t px-2 py-1">
                    {typeof b.event_date === "string"
                      ? b.event_date.split("T")[0]
                      : new Date(b.event_date).toISOString().split("T")[0]}
                  </td>

                  <td className="border-t px-2 py-1">
                    {b.start_time?.slice(0, 5)} – {b.end_time?.slice(0, 5)}
                  </td>

                  <td className="border-t px-2 py-1">{b.attendees}</td>

                  <td className="border-t px-2 py-1">{b.requested_by}</td>

                  <td className="border-t px-2 py-1">
                    <button
                      onClick={() => handleApprove(b.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(b.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default PrincipalAuditoriumManagement;
