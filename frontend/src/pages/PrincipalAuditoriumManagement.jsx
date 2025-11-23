// 🔔 Toast Notifications
import toast, { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";

// ⭐ Shared components
import AuditoriumActionButtons from "../components/AuditoriumActionButtons";
import { showConfirm, showPrompt } from "../utils/confirmDialogs.jsx";


const SCHOOL_BLUE = "#0D47A1";

const PrincipalAuditoriumManagement = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [showSlots, setShowSlots] = useState(false);
  const [showAllocations, setShowAllocations] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  const [statusFilter, setStatusFilter] = useState({
    approved: true,
    pending: true,
    rejected: true,
  });

  const token = localStorage.getItem("token");

  // ================================
  // LOAD DATA
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

  const fetchOverview = async () => {
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
    fetchOverview();
  }, []);

  // ================================
  // APPROVE / REJECT ACTIONS
  // ================================
  const handleApprove = async (id) => {
    const ok = await showConfirm("Approve this booking?");
    if (!ok) return;

    const loader = toast.loading("Approving...");
    try {
      await axios.put(
        `/api/auditorium/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking approved!", { id: loader });
      fetchPendingBookings();
      fetchOverview();
    } catch {
      toast.error("Approval failed", { id: loader });
    }
  };

  const handleReject = async (id) => {
    const reason = await showPrompt("Enter rejection reason (optional)");
    if (reason === null) return;

    const loader = toast.loading("Rejecting...");
    try {
      await axios.put(
        `/api/auditorium/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking rejected!", { id: loader });
      fetchPendingBookings();
      fetchOverview();
    } catch {
      toast.error("Rejection failed", { id: loader });
    }
  };

  // ================================
  // FILTER BADGE
  // ================================
  const FilterPill = ({ label, statusKey }) => (
    <div
      onClick={() =>
        setStatusFilter({
          ...statusFilter,
          [statusKey]: !statusFilter[statusKey],
        })
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

  const filteredAllocations = bookings.filter((b) => statusFilter[b.status]);

  return (
    <Layout activePage="events">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div
        className="text-white text-3xl font-bold px-6 py-4 rounded-lg shadow mb-6"
        style={{ backgroundColor: SCHOOL_BLUE }}
      >
        Auditorium Management
      </div>

      <div className="bg-white p-8 rounded-xl shadow-xl">

        {/* PENDING REQUESTS */}
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
                    {b.event_date?.split("T")[0]}
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

        {/* SHARED BUTTONS */}
        <AuditoriumActionButtons
          showSlots={showSlots}
          showAllocations={showAllocations}
          onToggleSlots={() => setShowSlots(!showSlots)}
          onToggleAllocations={() => setShowAllocations(!showAllocations)}
        />

        {/* AVAILABILITY SECTION */}
        {showSlots && (
          <div className="bg-white border rounded-lg p-6 shadow mb-6">
            <h3 className="text-xl font-semibold mb-3">Auditorium Availability</h3>

            <p className="text-sm text-gray-500 mb-3">
              <span className="mr-4">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                Available
              </span>
              <span>
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
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
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    slot.status === "booked"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  } ${
                    selectedDate === slot.date ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  {slot.date}
                </button>
              ))}
            </div>

            {selectedDate && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">
                  Bookings on <span className="text-indigo-600">{selectedDate}</span>
                </h4>

                {selectedBookings.length === 0 ? (
                  <p className="text-gray-500">No bookings.</p>
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

        {/* ALLOCATION LIST */}
        {showAllocations && (
          <div className="bg-white border rounded-lg p-4 shadow mb-6">
            <h3 className="font-bold text-lg mb-4">Allocation List</h3>

            <div className="flex gap-4 mb-4">
              <FilterPill label="Approved" statusKey="approved" />
              <FilterPill label="Pending" statusKey="pending" />
              <FilterPill label="Rejected" statusKey="rejected" />
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2">Event</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Attendees</th>
                  <th className="px-3 py-2">Requester</th>
                  <th className="px-3 py-2">Status</th>
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
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          b.status === "approved"
                            ? "bg-green-200 text-green-800"
                            : b.status === "pending"
                            ? "bg-yellow-200 text-yellow-700"
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
                    <td colSpan="6" className="text-center py-3 text-gray-600">
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
