import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function ParentPortal() {
  const [studentId, setStudentId] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [activities, setActivities] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSelectedCategory("");
    setStudentInfo(null);
    setPerformance(null);
    setActivities(null);

    try {
      // Fetch basic student information
      const response = await axios.get(
        `http://localhost:4000/api/parent-portal/student/${studentId}`,
        { withCredentials: true }
      );
      setStudentInfo(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Student not found. Please check the Student ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    setError("");

    try {
      if (category === "academic" || category === "sports") {
        // Fetch performance data
        const response = await axios.get(
          `http://localhost:4000/api/parent-portal/student/${studentId}/performance`,
          { withCredentials: true }
        );
        setPerformance(response.data);
      } else if (category === "extracurricular") {
        // Fetch activities data
        const response = await axios.get(
          `http://localhost:4000/api/parent-portal/student/${studentId}/activities`,
          { withCredentials: true }
        );
        setActivities(response.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = () => {
    if (!performance) return 0;
    const total =
      parseFloat(performance.academic_score || 0) +
      parseFloat(performance.sports_score || 0) +
      parseFloat(performance.discipline_score || 0) +
      parseFloat(performance.leadership_score || 0);
    return (total / 4).toFixed(2);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100 border-green-300";
    if (score >= 60) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  return (
    <Layout activePage="parent-portal">
      <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-700 mb-6">
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-2">Parent Portal</h2>
              <p className="text-blue-100">Mahamaya Girls' College, Kandy</p>
              <p className="text-sm text-blue-200 mt-2">View your child's academic performance and activities</p>
            </div>

            {/* Student ID Input */}
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="bg-gradient-to-r from-yellow-50 to-blue-50 p-5 rounded-lg border-l-4 border-yellow-500">
                <label className="block mb-3 font-bold text-gray-700 flex items-center">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">🔍</span>
                  Enter Student ID or Admission Number
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter Student ID (e.g., 6) or Admission Number (e.g., 20250001)"
                    className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-3 flex-1 transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                <p className="font-semibold">⚠️ {error}</p>
              </div>
            )}
          </div>

          {/* Student Information Card */}
          {studentInfo && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center">
                <span className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">👧</span>
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Student Name</p>
                  <p className="font-bold text-blue-900 text-lg">
                    {studentInfo.first_name} {studentInfo.last_name}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Admission Number</p>
                  <p className="font-bold text-gray-800">{studentInfo.admission_number}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Grade & Section</p>
                  <p className="font-bold text-blue-700 text-lg">
                    {studentInfo.grade}{studentInfo.section}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Class</p>
                  <p className="font-bold text-gray-800">{studentInfo.class_name || "N/A"}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Class Teacher</p>
                  <p className="font-bold text-gray-800">{studentInfo.class_teacher || "N/A"}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                  <p className="font-bold text-gray-800">
                    {new Date(studentInfo.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Category Selection */}
              <div className="mt-6">
                <label className="block mb-3 font-bold text-gray-700">
                  Select Information to View:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleCategoryChange("academic")}
                    className={`p-5 rounded-lg border-2 font-bold transition-all transform hover:scale-105 ${
                      selectedCategory === "academic"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-700 shadow-lg"
                        : "bg-white text-blue-700 border-blue-300 hover:border-blue-500"
                    }`}
                  >
                    <div className="text-3xl mb-2">📚</div>
                    Academic Performance
                  </button>
                  <button
                    onClick={() => handleCategoryChange("sports")}
                    className={`p-5 rounded-lg border-2 font-bold transition-all transform hover:scale-105 ${
                      selectedCategory === "sports"
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white border-green-700 shadow-lg"
                        : "bg-white text-green-700 border-green-300 hover:border-green-500"
                    }`}
                  >
                    <div className="text-3xl mb-2">🏆</div>
                    Sports Performance
                  </button>
                  <button
                    onClick={() => handleCategoryChange("extracurricular")}
                    className={`p-5 rounded-lg border-2 font-bold transition-all transform hover:scale-105 ${
                      selectedCategory === "extracurricular"
                        ? "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white border-yellow-700 shadow-lg"
                        : "bg-white text-yellow-700 border-yellow-300 hover:border-yellow-500"
                    }`}
                  >
                    <div className="text-3xl mb-2">⭐</div>
                    Extracurricular Activities
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && selectedCategory && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading data...</p>
            </div>
          )}

          {/* Academic Performance */}
          {selectedCategory === "academic" && performance && !loading && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center">
                <span className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">📖</span>
                Academic Performance
              </h3>

              {/* Overall Score */}
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-lg border-2 border-blue-300 text-center">
                <p className="text-gray-700 font-semibold mb-2">Overall Performance Score</p>
                <p className={`text-5xl font-bold ${getScoreColor(calculateOverallScore())}`}>
                  {calculateOverallScore()}%
                </p>
              </div>

              {/* Individual Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`p-5 rounded-lg border-2 ${getScoreBgColor(performance.academic_score)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-700">📚 Academic Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(performance.academic_score)}`}>
                      {performance.academic_score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${performance.academic_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`p-5 rounded-lg border-2 ${getScoreBgColor(performance.discipline_score)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-700">⭐ Discipline Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(performance.discipline_score)}`}>
                      {performance.discipline_score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                      style={{ width: `${performance.discipline_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`p-5 rounded-lg border-2 ${getScoreBgColor(performance.leadership_score)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-700">👑 Leadership Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(performance.leadership_score)}`}>
                      {performance.leadership_score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all"
                      style={{ width: `${performance.leadership_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Teacher Comments */}
              {performance.comments && (
                <div className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
                  <p className="font-bold text-gray-700 mb-2">📝 Teacher's Comments</p>
                  <p className="text-gray-800">{performance.comments}</p>
                </div>
              )}

              {/* Last Updated */}
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                  Last updated: {new Date(performance.updated_at).toLocaleString()} by{" "}
                  {performance.updated_by_teacher}
                </p>
              </div>
            </div>
          )}

          {/* Sports Performance */}
          {selectedCategory === "sports" && performance && !loading && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
              <h3 className="text-2xl font-bold text-green-700 mb-5 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">🏆</span>
                Sports Performance
              </h3>

              <div className={`p-6 rounded-lg border-2 ${getScoreBgColor(performance.sports_score)} mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-700">Sports Score</span>
                  <span className={`text-4xl font-bold ${getScoreColor(performance.sports_score)}`}>
                    {performance.sports_score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all"
                    style={{ width: `${performance.sports_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Performance Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Academic Score</p>
                  <p className="text-2xl font-bold text-blue-700">{performance.academic_score}%</p>
                </div>
                <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Discipline Score</p>
                  <p className="text-2xl font-bold text-purple-700">{performance.discipline_score}%</p>
                </div>
              </div>

              {performance.comments && (
                <div className="mt-6 bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                  <p className="font-bold text-gray-700 mb-2">📝 Teacher's Comments</p>
                  <p className="text-gray-800">{performance.comments}</p>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                  Last updated: {new Date(performance.updated_at).toLocaleString()} by{" "}
                  {performance.updated_by_teacher}
                </p>
              </div>
            </div>
          )}

          {/* Extracurricular Activities */}
          {selectedCategory === "extracurricular" && activities && !loading && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
              <h3 className="text-2xl font-bold text-yellow-700 mb-5 flex items-center">
                <span className="bg-yellow-100 text-yellow-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">⭐</span>
                Extracurricular Activities
              </h3>

              {activities.scholarships && activities.scholarships.length > 0 ? (
                <div className="space-y-4">
                  {activities.scholarships.map((scholarship) => (
                    <div
                      key={scholarship.scholarship_id}
                      className="bg-gradient-to-r from-blue-50 to-yellow-50 p-5 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-bold text-blue-700">
                          Scholarship Application #{scholarship.scholarship_id}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            scholarship.status === "approved"
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : scholarship.status === "rejected"
                              ? "bg-red-100 text-red-700 border border-red-300"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                          }`}
                        >
                          {scholarship.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {scholarship.sports && (
                          <div className="bg-white p-4 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-600 mb-1">🏆 Sports Activities</p>
                            <p className="font-semibold text-gray-800">{scholarship.sports}</p>
                          </div>
                        )}
                        {scholarship.social_works && (
                          <div className="bg-white p-4 rounded-lg border border-yellow-200">
                            <p className="text-sm text-gray-600 mb-1">🤝 Social Works</p>
                            <p className="font-semibold text-gray-800">{scholarship.social_works}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {scholarship.reason_academic && (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                            📖 Academic Excellence
                          </span>
                        )}
                        {scholarship.reason_sports && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            🏆 Sports Achievement
                          </span>
                        )}
                        {scholarship.reason_cultural && (
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                            🎭 Cultural Achievement
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600">
                        Submitted: {new Date(scholarship.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-yellow-50 rounded-lg">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-600 text-lg">No extracurricular activities recorded yet.</p>
                </div>
              )}
            </div>
          )}

          {/* No Data Found */}
          {selectedCategory && !loading && !performance && !activities && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-600 text-lg">No data available for this category.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
