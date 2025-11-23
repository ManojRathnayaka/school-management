// 🔔 Toast Notifications
import toast, { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";

const SCHOOL_BLUE = "#0D47A1";
const SCHOOL_YELLOW = "#FBC02D";

const PrincipalAuditoriumManagement = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [showSlots, setShowSlots] = useState(false);
  const [showAllocations, setShowAllocations] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  // ⭐ New Filter State
  const [statusFilter, setStatusFilter] = useState({
    approved: true,
    pending: true,
    rejected: true,
  });

  const token = localStorage.getItem("token");

  // ================================
  // LOADERS
  // ================================
  const fetchPendingBookings = async () => {
    try {
      const res = await axios.get("/api/auditorium/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingBookings(res.data);
    } catch {
      toast.error("Failed to load pending requests");
    }
  };

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
    } catch {
      toast.error("Failed to load auditorium data");
    }
  };

  useEffect(() => {
    fetchPendingBookings();
    fetchTeacherOverview();
  }, []);

  // ================================
  // APPROVE / REJECT
  // ================================
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this booking?")) return;

    const loader = toast.loading("Approving...");
    try {
      await axios.put(
        `/api/auditorium/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Approved!", { id: loader });
      fetchPendingBookings();
      fetchTeacherOverview();
    } catch {
      toast.error("Approval failed", { id: loader });
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason (optional):", "");
    if (reason === null) return;

    const loader = toast.loading("Rejecting...");

    try {
      await axios.put(
        `/api/auditorium/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Rejected!", { id: loader });
      fetchPendingBookings();
      fetchTeacherOverview();
    } catch {
      toast.error("Rejection failed", { id: loader });
    }
  };

  // ================================
  // FILTER BADGE COMPONENT
  // ================================
  const FilterPill = ({ label, statusKey, color }) => (
    <div
      onClick={() =>
        setStatusFilter({ ...statusFilter, [statusKey]: !statusFilter[statusKey] })
      }
      className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer border transition ${
        statusFilter[statusKey]
          ? "bg-purple-600 text-white"
          : "bg-white text-purple-600 border-purple-600"
      }`}
    >
      {statusFilter[statusKey] && <span>✔</span>}
      <span>{label}</span>
    </div>
  );

  // FILTER LOGIC
  const filteredAllocations = bookings.filter((b) => statusFilter[b.status]);

  return (
    <Layout activePage="events">
      <Toaster position="top-right" />

      {/* ============================= */}
      {/* BIG BLUE HEADER */}
      {/* ============================= */}
      <div
        className="text-white text-3xl font-bold px-6 py-4 rounded-lg shadow mb-6"
        style={{ backgroundColor: SCHOOL_BLUE }}
      >
        Auditorium Management
      </div>

      <div className="bg-white p-8 rounded-xl shadow-xl">

        {/* ============================= */}
        {/* PENDING REQUESTS */}
        {/* ============================= */}
        <h2 className="text-xl font-bold mb-4">Pending Booking Requests</h2>

        {pendingBookings.length === 0 ? (
          <p className="text-gray-600">No pending requests.</p>
        ) : (
          <table className="w-full text-sm mb-8">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-3 py-2">Event</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Attendees</th>
                <th className="px-3 py-2">Requester</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pendingBookings.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-3 py-2">{b.event_name}</td>
                  <td className="px-3 py-2">
                    {typeof b.event_date === "string"
                      ? b.event_date.split("T")[0]
                      : new Date(b.event_date).toISOString().split("T")[0]}
                  </td>
                  <td className="px-3 py-2">
                    {b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)}
                  </td>
                  <td className="px-3 py-2">{b.attendees}</td>
                  <td className="px-3 py-2">{b.requested_by}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleApprove(b.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(b.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ============================= */}
        {/* BUTTONS */}
        {/* ============================= */}
        {/* BUTTONS */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setShowSlots(!showSlots)}
              className={`px-4 py-2 rounded-xl shadow text-sm font-semibold transition ${
                showSlots
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              📆 View Available Time Slots
            </button>

            <button
              onClick={() => setShowAllocations(!showAllocations)}
              className={`px-4 py-2 rounded-xl shadow text-sm font-semibold transition ${
                showAllocations
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              📋 View Allocation List
            </button>
          </div>

          {/* ⭐ AVAILABILITY SECTION */}
          {showSlots && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Auditorium Availability
              </h3>

              {/* COLOR INDICATOR */}
              <p className="text-sm text-gray-500 mb-4">
                <span className="inline-flex items-center mr-4">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-1" />
                  Available
                </span>
                <span className="inline-flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-1" />
                  Booked
                </span>
              </p>

              <div className="flex flex-wrap gap-2">
                {slots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDate(slot.date);
                      setSelectedBookings(slot.bookings || []);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium border shadow-sm transition ${
                      slot.status === "booked"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    } ${
                      selectedDate === slot.date ? "ring-2 ring-indigo-500" : ""
                    }`}
                  >
                    {slot.date}
                  </button>
                ))}
              </div>

              {/* BOOKINGS ON SELECTED DATE */}
              {selectedDate && (
                <div className="mt-5">
                  <h4 className="font-semibold text-lg mb-2">
                    Bookings on{" "}
                    <span className="text-indigo-600">{selectedDate}</span>
                  </h4>

                  {selectedBookings.length === 0 ? (
                    <p className="text-sm text-gray-500">No bookings.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedBookings.map((b, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm"
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
        {showAllocations && (
          <div className="bg-white border rounded-lg p-4 shadow mb-6">
            <h3 className="font-bold text-lg mb-4">Allocation List</h3>

            {/* ⭐ FILTER BAR */}
            <div className="flex gap-4 mb-6">
              <FilterPill label="Approved" statusKey="approved" />
              <FilterPill label="Pending" statusKey="pending" />
              <FilterPill label="Rejected" statusKey="rejected" />
            </div>

            {/* ⭐ TABLE */}
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left">Event</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Attendees</th>
                  <th className="px-3 py-2 text-left">Requester</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredAllocations.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="px-3 py-2">{b.event_name}</td>

                    <td className="px-3 py-2">
                      {b.event_date?.split("T")[0]}
                    </td>

                    <td className="px-3 py-2">
                      {b.start_time?.slice(0, 5)} – {b.end_time?.slice(0, 5)}
                    </td>

                    <td className="px-3 py-2">{b.attendees}</td>

                    <td className="px-3 py-2">{b.requested_by}</td>

                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          b.status === "approved"
                            ? "bg-green-200 text-green-800"
                            : b.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredAllocations.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-600">
                      No matching records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default PrincipalAuditoriumManagement;
