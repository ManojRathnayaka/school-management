// Component imports
import Layout from "../components/Layout";
import { useState } from "react";

export default function ParentPortal() {

  const [studentId, setStudentId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call backend API to fetch student data using studentId
    setSelectedCategory(""); // Reset category when searching new student
  }
   
  return (
    <Layout activePage="parent-portal">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Parent Portal</h2>
           {/* Student ID Input */}
        <form onSubmit={handleSubmit} className="mb-6">
          <label className="block mb-2 font-medium">Enter Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. 20250001"
            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Student
          </button>
        </form>

        {/* Category selection (only visible if student ID entered) */}
        {studentId && (
          <div>
            <label className="block mb-2 font-medium">
              Select Information to View:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Category --</option>
              <option value="academic">Academic Performance</option>
              <option value="sports">Sports Performance</option>
              <option value="extracurricular">Extracurricular Activities</option>
            </select>
          </div>
        )}

        {/* Display area for selected category */}
        {selectedCategory && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            {/* TODO: Replace these placeholders with API-fetched data */}
            {selectedCategory === "academic" && (
              <p>Academic performance will appear here after fetching from backend.</p>
            )}
            {selectedCategory === "sports" && (
              <p>Sports performance will appear here after fetching from backend.</p>
            )}
            {selectedCategory === "extracurricular" && (
              <p>Extracurricular activities will appear here after fetching from backend.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
