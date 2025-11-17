// 🔥 Toast Notification
import toast, { Toaster } from "react-hot-toast";

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";

const PrincipalAuditoriumManagement = () => {
  const [pendingBookings, setPendingBookings] = useState([]);

  // ⭐ Teacher Overview Data
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  // ⭐ Dropdown States
  const [showSlots, setShowSlots] = useState(false);
  const [showAllocations, setShowAllocations] = useState(false);

  // ⭐ Selected Date Bookings
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  const token = localStorage.getItem("token");

  // =============================
  // FETCHES
  // =============================

  // Pending Bookings
  const fetchPendingBookings = async () => {
    try {
      const res = await axios.get("/api/auditorium/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingBookings(res.data);
    } catch (err) {
      console.error("Failed to load pending bookings", err);
      toast.error("Failed to load pending bookings");
    }
  };

  // ⭐ Teacher Overview (Slots + Approved List)
  const fetchTeacherOverview = async () => {
    try {
      const slotRes = await axios.get("/api/auditorium/slots", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const approvedRes = await axios.get("/api/auditorium/approved", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSlots(slotRes.data);
      setBookings(approvedRes.data);
    } catch (err) {
      console.error("Teacher overview error", err);
      toast.error("Failed to load teacher overview");
    }
  };

  useEffect(() => {
    fetchPendingBookings();
    fetchTeacherOverview();
  }, []);

  // =============================
  // APPROVE / REJECT
  // =============================

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this booking?")) return;

    const loadingToast = toast.loading("Approving booking...");

    try {
      await axios.put(
        `/api/auditorium/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking approved!", { id: loadingToast });
      fetchPendingBookings();
      fetchTeacherOverview();
    } catch (err) {
      console.error("Approve error", err);
      toast.error("Failed to approve booking", { id: loadingToast });
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection (optional):", "");
    if (reason === null) return;

    const loadingToast = toast.loading("Rejecting booking...");

    try {
      await axios.put(
        `/api/auditorium/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking rejected!", { id: loadingToast });
      fetchPendingBookings();
      fetchTeacherOverview();
    } catch (err) {
      console.error("Reject error", err);
      toast.error("Failed to reject booking", { id: loadingToast });
    }
  };

  return (
    <Layout activePage="events">
      <Toaster position="top-right" />

      <div className="bg-white p-6 rounded-lg shadow">

        {/* ============================= */}
        {/* PENDING REQUESTS (TOP SECTION) */}
        {/* ============================= */}

        <h2 className="text-2xl font-bold mb-6">
          Pending Auditorium Booking Requests
        </h2>

        {pendingBookings.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <table className="w-full text-sm mb-10">
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

        <br/>
        <br/>

        {/* ============================= */}
        {/* ⭐ NOW BUTTONS BELOW PENDING  */}
        {/* ============================= */}

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowSlots(!showSlots)}
            className="bg-white border px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-gray-100"
          >
            Auditorium Availability
          </button>

          <button
            onClick={() => setShowAllocations(!showAllocations)}
            className="bg-white border px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-gray-100"
          >
            Allocation List
          </button>
        </div>

        {/* ============================= */}
        {/* ⭐ DROPDOWN 1: AVAILABILITY   */}
        {/* ============================= */}

        {showSlots && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Auditorium Availability</h3>
            {/* <p className="text-sm mb-4 text-gray-600">
              Green = Available • Red = Booked
            </p> */}

            <div className="flex flex-wrap gap-2">
              {slots.map((slot, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedDate(slot.date);
                    setSelectedBookings(slot.bookings || []);
                  }}
                  className={`px-4 py-2 rounded cursor-pointer text-sm font-medium ${
                    slot.status === "booked"
                      ? "bg-red-200 text-red-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {slot.date}
                </div>
              ))}
            </div>

            {selectedDate && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">
                  Bookings on {selectedDate}
                </h4>

                {selectedBookings.length === 0 ? (
                  <p className="text-gray-500">No bookings.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedBookings.map((b, idx) => (
                      <div
                        key={idx}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded"
                      >
                        {b.start_time.slice(0, 5)} – {b.end_time.slice(0, 5)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================= */}
        {/* ⭐ DROPDOWN 2: ALLOCATION LIST */}
        {/* ============================= */}

        {showAllocations && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Auditorium Allocation List</h3>

            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-left">Event</th>
                  <th className="px-2 py-1 text-left">Date</th>
                  <th className="px-2 py-1 text-left">Time</th>
                  <th className="px-2 py-1 text-left">Attendees</th>
                  <th className="px-2 py-1 text-left">Requester</th>
                  <th className="px-2 py-1 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="border-t px-2 py-1">{b.event_name}</td>

                    <td className="border-t px-2 py-1">
                      {typeof b.event_date === "string"
                        ? b.event_date.split("T")[0]
                        : new Date(b.event_date)
                            .toISOString()
                            .split("T")[0]}
                    </td>

                    <td className="border-t px-2 py-1">
                      {b.start_time?.slice(0, 5)} -
                      {b.end_time?.slice(0, 5)}
                    </td>

                    <td className="border-t px-2 py-1">{b.attendees}</td>
                    <td className="border-t px-2 py-1">{b.requested_by}</td>

                    <td className="border-t px-2 py-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          b.status === "approved"
                            ? "bg-green-200 text-green-800"
                            : b.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {b.status.charAt(0).toUpperCase() +
                          b.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default PrincipalAuditoriumManagement;
