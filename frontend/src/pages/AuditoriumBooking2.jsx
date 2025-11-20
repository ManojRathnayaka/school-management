import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";

// SCHOOL COLORS
const PRIMARY = "#4F46E5"; // Indigo-600
const SECONDARY = "#6366F1";

const AuditoriumBookingForm = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    attendees: "",
    eventType: "",
    equipment: "",
    notes: "",
  });

  const [showSlots, setShowSlots] = useState(false);
  const [showAllocations, setShowAllocations] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  // ⭐ New filter state
  const [statusFilter, setStatusFilter] = useState({
    approved: true,
    pending: true,
    rejected: true,
  });

  const token = localStorage.getItem("token");

  // FORM HANDLING -----------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // SUBMIT BOOKING ---------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auditorium/book", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Booking request submitted successfully!");

      setFormData({
        eventName: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        attendees: "",
        eventType: "",
        equipment: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      alert("Booking submission failed");
    }
  };

  // FETCH BOOKINGS ---------------------------------
  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/auditorium/approved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  // FETCH SLOTS ------------------------------------
  const fetchSlots = async () => {
    try {
      const res = await axios.get("/api/auditorium/slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
    } catch (err) {
      console.error("Failed to load slots", err);
    }
  };

  useEffect(() => {
    if (showSlots) fetchSlots();
    if (showAllocations) fetchBookings();
  }, [showSlots, showAllocations]);

  // FILTER PILL COMPONENT ---------------------------
  const FilterPill = ({ label, keyName }) => (
    <div
      onClick={() =>
        setStatusFilter({ ...statusFilter, [keyName]: !statusFilter[keyName] })
      }
      className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer border transition text-sm font-semibold ${
        statusFilter[keyName]
          ? "bg-indigo-600 text-white"
          : "bg-white text-indigo-600 border-indigo-600"
      }`}
    >
      {statusFilter[keyName] && <span>✔</span>}
      <span>{label}</span>
    </div>
  );

  const filteredAllocations = bookings.filter((b) => statusFilter[b.status]);

  // -------------------------------------------------
  // UI START
  // -------------------------------------------------

  return (
    <Layout activePage="events">
      <div className="p-6">

        <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl">
                📅
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Auditorium Booking
                </h1>
                <p className="text-sm text-gray-500">
                  Check availability & submit booking requests.
                </p>
              </div>
            </div>
            <NotificationBell />
          </div>

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

          {/* ⭐ ALLOCATION LIST WITH FILTER BAR */}
          {showAllocations && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Auditorium Allocation List
              </h3>

              {/* FILTER BAR */}
              <div className="flex gap-4 mb-6">
                <FilterPill label="Approved" keyName="approved" />
                <FilterPill label="Pending" keyName="pending" />
                <FilterPill label="Rejected" keyName="rejected" />
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                      <th className="px-3 py-2 text-left">Event</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Attendees</th>
                      <th className="px-3 py-2 text-left">Requester</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredAllocations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-gray-500">
                          No matching records.
                        </td>
                      </tr>
                    ) : (
                      filteredAllocations.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50">
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
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                b.status === "approved"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : b.status === "pending"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}
                            >
                              {b.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ⭐ BOOKING FORM */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Book the Auditorium
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter event name"
                />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Attendees + Event Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Attendees
                  </label>
                  <input
                    type="number"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2 text-sm"
                    placeholder="e.g. 100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2 text-sm bg-white"
                    required
                  >
                    <option value="">Select Event Type</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Rehearsal">Rehearsal</option>
                  </select>
                </div>
              </div>

              {/* Equipment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment Needed
                </label>
                <input
                  type="text"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleChange}
                  placeholder="Projector, Sound system, etc."
                  className="w-full border rounded-xl px-4 py-2 text-sm"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2 text-sm min-h-[80px]"
                  placeholder="Special requirements"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-xl shadow transition"
              >
                Submit Booking Request
              </button>
            </form>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default AuditoriumBookingForm;
