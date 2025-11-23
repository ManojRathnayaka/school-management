           // React imports
import { useState } from "react";
import axios from "axios";
import { Search ,User2 ,Phone ,BookOpen,Trophy,Star,Crown,BarChart3} from "lucide-react";

// Component imports
import Layout from "../components/Layout";

//Component Structure & State Management

export default function ParentPortal() {
  const [studentId, setStudentId] = useState("");            // Stores admission number input
  const [studentInfo, setStudentInfo] = useState(null);      // Stores basic student info
  const [performance, setPerformance] = useState(null);      // Stores academic/sports scores
  const [activities, setActivities] = useState(null);        // Stores scholarship applications
  const [selectedCategory, setSelectedCategory] = useState("");   // Tracks which tab is active
  const [loading, setLoading] = useState(false);                 // Loading indicator
  const [error, setError] = useState("");                         // Error messages


   // handleSubmit - Fetching Student Information
  const handleSubmit = async (e) => {
    e.preventDefault();      // Prevents page reload
    setLoading(true);        // Shows loading spinner
    setError("");
    setSelectedCategory("");
    setStudentInfo(null);
    setPerformance(null);
    setActivities(null);

   try {
     // API call to backend with credentials (JWT cookie)
    const response = await axios.get(
    `http://localhost:4000/api/parent-portal/student/${studentId}`,
    { withCredentials: true }  // Sends JWT cookie for authentication
  );
  setStudentInfo(response.data); // Store student data in state
} catch (err) {
  console.error(err);
  if (err.response?.status === 403) {
    setError("Access denied. You don't have permission to view this student's information.");    // Parent trying to access another child
  } else {
    setError(err.response?.data?.message || "Student not found. Please check the admission number.");
  }
} finally {
  setLoading(false);     // Hide loading spinner
}
  };
   
  // handleCategoryChange - Loading Performance/Activities 
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


  // Calculate average of all scores
  const calculateOverallScore = () => {
    if (!performance) return 0;
    const total =
      parseFloat(performance.academic_score || 0) +
      parseFloat(performance.sports_score || 0) +
      parseFloat(performance.discipline_score || 0) +
      parseFloat(performance.leadership_score || 0);
    return (total / 4).toFixed(2);  // Returns average rounded to 2 decimals
  };

  // Color coding based on score
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";    // Excellent
    if (score >= 60) return "text-yellow-600";   // Good
    return "text-red-600";                       // Needs improvement
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100 border-green-300";
    if (score >= 60) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  return (
    <Layout activePage="parent-portal">
      <div className="bg-base-100">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl p-6   mb-6 ">
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-2">Parent Portal</h2>
              <p className="text-blue-100">Mahamaya Girls' College, Kandy</p>
              <p className="text-sm text-blue-200 mt-2">View your child's academic performance and activities</p>
            </div>

            {/* Student ID Input */}
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="bg-gradient-to-r from-[#FFFDE7] to-[#E3F2FD] p-6 rounded-2xl shadow-md">
                <label className="font-semibold text-gray-700 flex items-center gap-3 mb-4">
                  <span className="p-2 bg-blue-100 text-blue-700 rounded-full">
                     <Search className="w-5 h-5" />
                  </span>
                  Enter Student Admission Number
                </label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute top-1/2 left-4 -translate-y-1/2 text-gray-500" />
                    <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g., ADM2025XXX"
                    className="w-full border border-gray-300 rounded-xl py-3 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-600"
                    required
                  />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading || studentId === ''}
                    className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
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
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 ">
              <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center">
                <span className="bg-blue-100 text-blue-700 rounded-full w-11 h-11 flex items-center justify-center mr-3 shadow-inner">
                  <User2 className="w-6 h-6" /> 
                </span>
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Student Name</p>
                  <p className="font-bold text-blue-900 text-lg">
                    {studentInfo.first_name} {studentInfo.last_name}
                  </p>
                </div>
                <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Admission Number</p>
                  <p className="font-bold text-gray-800">{studentInfo.admission_number}</p>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Grade & Section</p>
                  <p className="font-bold text-blue-700 text-lg">
                    
                    {studentInfo.grade}{studentInfo.section}
                  </p>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl border border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Class</p>
                  <p className="font-bold text-gray-800">{studentInfo.class_name || "N/A"}</p>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Class Teacher</p>
                  <p className="font-bold text-gray-800">{studentInfo.class_teacher || "N/A"}</p>
                </div>
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                     <p className="text-sm text-gray-600 mb-1">Teacher Contact</p>
                     <p className="font-bold text-blue-700">
                      <Phone className="w-4 h-4 text-red-700" />
                      {studentInfo.teacher_contact && studentInfo.teacher_contact !== 'N/A' ? ` ${studentInfo.teacher_contact}` : 'N/A'}
                     </p>
                </div>
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                  <p className="font-bold text-gray-800">
                    {new Date(studentInfo.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Category Selection */}
              <div className="mt-6">
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  Select Information to View:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleCategoryChange("academic")}
                    className={`p-6 rounded-xl border-2 flex flex-col items-center font-semibold transition-all hover:scale-105 ${
                      selectedCategory === "academic"
                        ? "bg-blue-700 text-white border-blue-800 shadow-md"
                        : "bg-white text-blue-700 border-blue-300 hover:border-blue-500"
                    }`}
                  >
                    <BookOpen className="w-8 h-8 mb-2" />
                    Academic Performance
                  </button>
                  <button
                    onClick={() => handleCategoryChange("sports")}
                    className={`p-6 rounded-xl border-2 flex flex-col items-center font-semibold transition-all hover:scale-105 ${
                      selectedCategory === "sports"
                        ? "bg-green-700 text-white border-green-800 shadow-md"
                        : "bg-white text-green-700 border-green-300 hover:border-green-500"
                    }`}
                  >
                    <Trophy className="w-8 h-8 mb-2" />
                    Sports Performance
                  </button>
                  {/*<button
                    onClick={() => handleCategoryChange("extracurricular")}
                    className={`p-5 rounded-lg border-2 font-bold transition-all transform hover:scale-105 ${
                      selectedCategory === "extracurricular"
                        ? "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white border-yellow-700 shadow-lg"
                        : "bg-white text-yellow-700 border-yellow-300 hover:border-yellow-500"
                    }`}
                  >
                    <div className="text-3xl mb-2">⭐</div>
                    Extracurricular Activities
                  </button> */}
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
            <div className="bg-white rounded-xl shadow-xl p-8 border border-blue-200">
              <h3 className="text-3xl font-extrabold text-[#0D47A1] mb-8 flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-[#0D47A1] shadow">
                   <BookOpen className="w-7 h-7" />
                </div>
                Academic Performance
              </h3>

              {/* Overall Score */}
              <div className="mb-6 p-6 bg-blue-100 rounded-lg border-2 border-blue-300 text-center">
                <p className="text-gray-700 font-semibold mb-2">Overall Performance Score</p>
                <p className={`text-5xl font-bold ${getScoreColor(calculateOverallScore())}`}>
                  {calculateOverallScore()}%
                </p>
              </div>

              {/* Individual Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`p-5 rounded-lg border-2 ${getScoreBgColor(performance.academic_score)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="w-6 h-6 text-blue-700" />
                     Academic Score
                    <span className={`text-2xl font-bold ${getScoreColor(performance.academic_score)}`}>
                      {performance.academic_score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${performance.academic_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`p-5 rounded-lg border-2 ${getScoreBgColor(performance.discipline_score)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <Star className="w-6 h-6 text-yellow-600" />
                      Discipline Score
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
                    <Crown className="w-6 h-6 text-yellow-500" />
                       Leadership Score
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
                 <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-700 shadow">
                   <Trophy className="w-7 h-7" />
                 </div>
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
              <BarChart3 className="w-8 h-8 text-blue-700" />
              <p className="text-gray-500 mt-1">No data available for this category.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}