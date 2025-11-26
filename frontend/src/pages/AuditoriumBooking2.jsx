import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";


import AuditoriumActionButtons from "../components/AuditoriumActionButtons";
import { showConfirm } from "../utils/confirmDialogs";

import toast, { Toaster } from "react-hot-toast";

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

  const [statusFilter, setStatusFilter] = useState({
    approved: true,
    pending: true,
    rejected: true,
  });

  
  const [dateConflicts, setDateConflicts] = useState([]);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // SUBMIT BOOKING
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await showConfirm("Submit this booking request?");
    if (!ok) return;

    try {
      await axios.post("/api/auditorium/book", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Booking request submitted!");

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

      
      setDateConflicts([]);
    } catch (err) {
      toast.error("Booking submission failed");
    }
  };

  
  // FETCH DATA
  
  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/auditorium/approved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch {
      toast.error("Failed to load booking data");
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await axios.get("/api/auditorium/slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
    } catch {
      toast.error("Failed to load slots");
    }
  };

  //Load bookings once on mount (so we can check conflicts for date)
  useEffect(() => {
    fetchBookings();
  }, []);

  
  useEffect(() => {
    if (showSlots) fetchSlots();
    if (showAllocations) fetchBookings();
  }, [showSlots, showAllocations]);

  
  
  
  const FilterPill = ({ label, keyName }) => (
    <div
      onClick={() =>
        setStatusFilter({
          ...statusFilter,
          [keyName]: !statusFilter[keyName],
        })
      }
      className={`px-4 py-2 rounded-full cursor-pointer border text-sm font-semibold ${
        statusFilter[keyName]
          ? "bg-indigo-600 text-white"
          : "bg-white text-indigo-600 border-indigo-600"
      }`}
    >
      {statusFilter[keyName] && <span>✔ </span>}
      {label}
    </div>
  );

  const filteredAllocations = bookings.filter(
    (b) => statusFilter[b.status]
  );

  
  //CHECK CONFLICTS FOR SELECTED EVENT DATE
 
  useEffect(() => {
    if (!formData.eventDate) {
      setDateConflicts([]);
      return;
    }

    const conflicts = bookings.filter((b) => {
      if (b.status !== "approved") return false;

      const dateStr =
        typeof b.event_date === "string"
          ? b.event_date.split("T")[0]
          : new Date(b.event_date).toISOString().split("T")[0];

      return dateStr === formData.eventDate;
    });

    setDateConflicts(conflicts);
  }, [formData.eventDate, bookings]);

  return (
    <Layout activePage="events">
      <Toaster position="top-right" />

      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              
              <div>
                <h1 className="text-3xl font-bold text-yellow-blue-900">
                  Auditorium Booking
                </h1>
                <p className="text-sm text-red-500">
                  Check availability & submit booking requests.
                </p>
              </div>
            </div>

            <NotificationBell />
          </div>

          
          <AuditoriumActionButtons
            showSlots={showSlots}
            showAllocations={showAllocations}
            onToggleSlots={() => setShowSlots(!showSlots)}
            onToggleAllocations={() => setShowAllocations(!showAllocations)}
          />

          {/* AVAILABILITY SECTION */}{showSlots && (
            <div className="bg-white border rounded-lg p-6 shadow mb-6">
              <h3 className="text-xl font-semibold mb-3">
                Auditorium Availability
              </h3>

              <p className="text-sm text-gray-500 mb-3">
                <span className="mr-4">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1" />
                  Available
                </span>
                <span>
                  <span className="inline-block w-3 h-3 bg-red-800 rounded-full mr-1" />
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
                        ? "bg-red-100 text-red-1000"
                        : "bg-green-100 text-green-700"
                    } ${
                      selectedDate === slot.date
                        ? "ring-2 ring-indigo-500"
                        : ""
                    }`}
                  >
                    {slot.date}
                  </button>
                ))}
              </div>

              {selectedDate && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">
                    Bookings on{" "}
                    <span className="text-red-600">{selectedDate}</span>
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
                          {b.start_time.slice(0, 5)} –{" "}
                          {b.end_time.slice(0, 5)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

      
          {showAllocations && (
            <div className="bg-white border rounded-xl p-6 shadow mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Auditorium Allocation List
              </h3>

              <div className="flex gap-4 mb-4">
                <FilterPill label="Approved" keyName="approved" />
                <FilterPill label="Pending" keyName="pending" />
                <FilterPill label="Rejected" keyName="rejected" />
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                      <th className="px-3 py-2 text-left">Event</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Attendees</th>
                      <th className="px-3 py-2 text-left">Requester</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAllocations.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-4 text-gray-500"
                        >
                          No matching records.
                        </td>
                      </tr>
                    ) : (
                      filteredAllocations.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">{b.event_name}</td>
                          <td className="px-3 py-2">
                            {typeof b.event_date === "string"
                              ? b.event_date.split("T")[0]
                              : new Date(b.event_date)
                                  .toISOString()
                                  .split("T")[0]}
                          </td>
                          <td className="px-3 py-2">
                            {b.start_time?.slice(0, 5)} –{" "}
                            {b.end_time?.slice(0, 5)}
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BOOKING FORM */}
          <div className="bg-white border rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">
              Book the Auditorium
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-2 text-sm"
                  placeholder="Enter event name"
                />
              </div>

             
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-xl px-4 py-2 text-sm"
                  />
                </div>
              </div>

              {/*Existing bookings for selected date */}
              {formData.eventDate && dateConflicts.length > 0 && (
                <div className="mt-2 bg-yellow-50 border border-yellow-300 text-yellow-900 rounded-lg p-3 text-xs sm:text-sm">
                  <p className="font-semibold mb-1">
                    Approved bookings already on {formData.eventDate}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dateConflicts.map((b) => (
                      <span
                        key={b.id}
                        className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700"
                      >
                        {b.start_time?.slice(0, 5)} –{" "}
                        {b.end_time?.slice(0, 5)} ({b.event_name})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Attendees
                  </label>
                  <input
                    type="number"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-xl px-4 py-2 text-sm"
                  >
                    <option value="">Select Event Type</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Rehearsal">Rehearsal</option>
                  </select>
                </div>
              </div>

              
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Equipment
                </label>
                <input
                  type="text"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2 text-sm"
                  placeholder="Projector, Sound system, etc."
                />
              </div>

             
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2 text-sm min-h-[80px]"
                  placeholder="Special requirements"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-500 text-white px-10 py-2 rounded-xl shadow hover:bg-indigo-900"
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
