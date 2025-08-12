// Component imports
import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";


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

  

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auditorium/book", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      alert("Booking request submitted successfully!");
      e.target.reset();

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

     const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/auditorium/approved");
       console.log("Bookings:", res.data);
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

   const fetchSlots = async () => {
    try {
      const res = await axios.get("/api/auditorium/slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
       console.log("Slots:", res.data);
      setSlots(res.data); // response has [{ date: '2025-08-08', status: 'booked' }, ...]
    } catch (err) {
      console.error("Failed to load slots", err);
    }
  };


    useEffect(() => {
    if (showSlots) fetchSlots();
    if (showAllocations) fetchBookings();
  }, [showSlots, showAllocations]);

  


  return (
    <Layout activePage="events">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Auditorium Booking</h2>
        <NotificationBell />

      <div className="flex gap-4 mb-4">
          <button
            onClick={() => setShowSlots(!showSlots)}
            className="bg-white border px-4 py-2 rounded flex items-center gap-2 shadow"
          >
            📅 View Available Time Slots
          </button>
          <button
            onClick={() => setShowAllocations(!showAllocations)}
            className="bg-white border px-4 py-2 rounded flex items-center gap-2 shadow"
          >
            📋 View Allocation List
          </button>
        </div>


        {/* View Slots */}
        {showSlots && (
          


          <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">Auditorium Availability</h3>
          <p className="text-sm mb-4 text-gray-600">
            Green = Available • Red = Booked
          </p>
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

          {/* display bookings for selected day */}
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



        {/* View Allocation List */}
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
                      {typeof b.event_date === 'string'
                      ? b.event_date.split('T')[0]   // 'YYYY-MM-DD' from ISO string
                      : new Date(b.event_date).toISOString().split('T')[0]}
                  </td>

                    <td className="border-t px-2 py-1">
                      {b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)}
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
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Book the Auditorium
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="eventName"
          placeholder="Event Name"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          type="date"
          name="eventDate"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            name="startTime"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="time"
            name="endTime"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <input
          type="number"
          name="attendees"
          placeholder="Expected Attendees"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <select
          name="eventType"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">Select Event Type</option>
          <option value="Cultural">Cultural</option>
          <option value="Meeting">Meeting</option>
          <option value="Rehearsal">Rehearsal</option>
        </select>
        <input
          type="text"
          name="equipment"
          placeholder="Equipment Needed"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <textarea
          name="notes"
          placeholder="Additional Notes"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Submit Booking Request
        </button>
      </form>
    </div>
      </div>
    </Layout>
  );
}

export default AuditoriumBookingForm;