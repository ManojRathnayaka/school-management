// Component imports
import Layout from "../components/Layout";


import React, { useState } from "react";
import axios from "axios";


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
    } catch (err) {
      console.error(err);
      alert("Booking submission failed");
    }
  };


  return (
    <Layout activePage="events">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Events</h2>
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