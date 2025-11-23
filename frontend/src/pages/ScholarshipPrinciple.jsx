import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

import {
  BookOpen,
  Users,
  Star,
  Lightbulb,
  Trophy,
  School,
  HeartPulse,
  Award,
  Wallet,
} from "lucide-react";


export default function ScholarshipList() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);

   //Fetching Applications
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    axios
      .get("http://localhost:4000/api/scholarships", { withCredentials: true })
      .then((res) => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Error fetching applications");
        setLoading(false);
      });
  };

  //Approve/Reject Functions
  const handleApprove = (id) => {
    if (!window.confirm("Are you sure you want to approve this scholarship application?")) {
      return;
    }
    
    axios
      .put(`http://localhost:4000/api/scholarships/${id}/approve`, {}, { withCredentials: true })
      .then(() => {
        setApplications(applications.map((a) => (a.scholarship_id === id ? { ...a, status: "approved" } : a)));
        alert("Scholarship approved successfully");
        if (selectedApplication?.scholarship_id === id) {
          setSelectedApplication({ ...selectedApplication, status: "approved" });
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error approving scholarship");
      });
  };

  const handleReject = (id) => {
    if (!window.confirm("Are you sure you want to reject this scholarship application?")) {
      return;
    }
    
    axios
      .put(`http://localhost:4000/api/scholarships/${id}/reject`, {}, { withCredentials: true })
      .then(() => {
        setApplications(applications.map((a) => (a.scholarship_id === id ? { ...a, status: "rejected" } : a)));
        alert("Scholarship rejected successfully");
        if (selectedApplication?.scholarship_id === id) {
          setSelectedApplication({ ...selectedApplication, status: "rejected" });
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error rejecting scholarship");
      });
  };

  const viewDetails = (app) => {
    setSelectedApplication(app);
  };

  const closeDetails = () => {
    setSelectedApplication(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-700 bg-green-100 border border-green-300";
      case "rejected":
        return "text-red-700 bg-red-100 border border-red-300";
      default:
        return "text-amber-700 bg-amber-100 border border-amber-300";
    }
  };

  if (loading) {
     return (
          <Layout activePage="scholarship-list">
            <div className="flex justify-center items-center h-64 bg-gradient-to-br from-blue-50 via-white to-yellow-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                <p className="text-xl text-blue-700 font-semibold">Loading applications...</p>
              </div>
            </div>
          </Layout>
        );
  }

  return (
    <Layout activePage="scholarship-list">
      <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50  p-6">       
          {/* Header with School Colors */}
          <div className="bg-gradient-to-r from-[#0D47A1] to-blue-800 text-white p-8 rounded-2xl shadow-lg mb-8 border border-blue-900/40">
            <h2 className="text-3xl font-bold mb-2">Scholarship Applications</h2>
            <p className="text-blue-100">Mahamaya Girls' College, Kandy</p>
          </div>
        
          {/* Statistics Bar */}
            <div className="mb-6 p-5 bg-gradient-to-r from-yellow-50 to-blue-50 rounded-lg border-l-4 border-yellow-500 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-6">
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-gray-500 text-sm font-medium">Total Applications</p>
                <p className="text-2xl font-bold text-blue-700">{applications.length}</p>
              </div>
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{applications.filter(a => a.status === 'pending').length}</p>
              </div>
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-gray-500 text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-600">{applications.filter(a => a.status === 'approved').length}</p>
              </div>
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-gray-500 text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{applications.filter(a => a.status === 'rejected').length}</p>
              </div>
            </div>
        </div>
        

          {applications.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-yellow-50 rounded-lg">
              <svg className="mx-auto h-16 w-16 text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No scholarship applications found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="w-full mt-6 rounded-xl overflow-hidden shadow-lg">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-sm">ID</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Student Name</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Admission No</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Grade</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Status</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Submitted Date</th>
                    <th className="py-3 px-4 text-left font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-sm">
                  {applications.map((app, index) => (
                    <tr key={app.scholarship_id} className={`hover:bg-blue-50 border-b transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className=" px-4 py-3 text-blue-700 font-semibold">{app.scholarship_id}</td>
                      <td className=" px-4 py-3 font-medium">
                        {app.first_name} {app.last_name}
                      </td>
                      <td className=" px-4 py-3">{app.admission_number}</td>
                      <td className=" px-4 py-3 font-semibold text-blue-600">
                        {app.grade}{app.section}
                      </td>
                      <td className=" px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td className=" px-4 py-3 text-gray-700">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className=" py-3 px-4 flex gap-3">
                        <button
                          onClick={() => viewDetails(app)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                        >
                          View Details
                        </button>
                        {app.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(app.scholarship_id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(app.scholarship_id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal for viewing details */}
          {selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Modal Header with School Colors */}
                <div className="sticky top-0 bg-[#0D47A1] text-white p-6 flex justify-between items-center rounded-t-xl shadow-lg">
                  <div>
                    <h3 className="text-2xl font-bold">Application Details</h3>
                    <p className="text-blue-100 text-sm mt-1">Scholarship ID: {selectedApplication.scholarship_id}</p>
                  </div>
                  <button
                    onClick={closeDetails}
                    className="text-white hover:text-yellow-300 text-3xl font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 space-y-6 bg-gradient-to-br from-white via-blue-50 to-yellow-50">
                  {/* Student Information */}
                  <section className="bg-white rounded-lg p-5 shadow-md border-l-4 border-blue-600">
                    <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                      <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                        <BookOpen className="w-5 h-5" />
                      </span>
                      Student Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Student Name</p>
                        <p className="font-bold text-blue-900">{selectedApplication.student_name}</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Student ID</p>
                        <p className="font-bold text-gray-800">{selectedApplication.student_id}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Admission Number</p>
                        <p className="font-bold text-gray-800">{selectedApplication.admission_number}</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Grade</p>
                        <p className="font-bold text-blue-700 text-lg">
                          {selectedApplication.grade}{selectedApplication.section}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Status</p>
                        <p className={`font-bold text-lg ${selectedApplication.status === 'approved' ? 'text-green-600' : selectedApplication.status === 'rejected' ? 'text-red-600' : 'text-amber-600'}`}>
                          {selectedApplication.status.toUpperCase()}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Submitted Date</p>
                        <p className="font-bold text-gray-800">{new Date(selectedApplication.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </section>

                  {/* Parent Information */}
                  <section className="bg-white rounded-lg p-5 shadow-md border-l-4 border-yellow-500">
                    <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                      <span className="bg-yellow-100 text-yellow-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                         <Users className="w-5 h-5" />
                      </span>
                      Parent/Guardian Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-bold text-blue-700 mb-3 text-lg">Father's Details</h5>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-semibold text-gray-800">{selectedApplication.father_name || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Occupation</p>
                            <p className="font-semibold text-gray-800">{selectedApplication.father_occupation || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Monthly Income</p>
                            <p className="font-bold text-blue-700">Rs. {selectedApplication.father_income || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Contact</p>
                            <p className="font-semibold text-gray-800">{selectedApplication.father_contact || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h5 className="font-bold text-yellow-700 mb-3 text-lg">Mother's Details</h5>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-semibold text-gray-800">{selectedApplication.mother_name || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Occupation</p>
                            <p className="font-semibold text-gray-800">{selectedApplication.mother_occupation || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Monthly Income</p>
                            <p className="font-bold text-yellow-700">Rs. {selectedApplication.mother_income || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Contact</p>
                            <p className="font-semibold text-gray-800">{selectedApplication.mother_contact || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 bg-gradient-to-r from-blue-100 to-yellow-100 p-4 rounded-lg border-2 border-blue-300">
                      <p className="text-sm text-gray-700 mb-1">Total Family Income</p>
                      <p className="font-bold text-2xl text-blue-700">
                        Rs. {(parseFloat(selectedApplication.father_income || 0) + parseFloat(selectedApplication.mother_income || 0)).toFixed(2)}
                      </p>
                    </div>
                  </section>

                  {/* Medical Challenges */}
                  <section className="bg-white rounded-lg p-5 shadow-md border-l-4 border-blue-600">
                    <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                      <span className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                        <HeartPulse className="w-5 h-5" />
                      </span>
                      Medical or Physical Challenges
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800">{selectedApplication.medical_or_Physical_Challenges || "None mentioned"}</p>
                    </div>
                  </section>

                  {/* Extra-Curricular Activities */}
                  <section className="bg-white rounded-lg p-5 shadow-md border-l-4 border-yellow-500">
                    <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                      <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                        <Star className="w-5 h-5" />
                      </span>
                      Extra-Curricular Involvement
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-2 font-semibold">Sports</p>
                        <p className="font-semibold text-gray-800">{selectedApplication.sports || "None"}</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-sm text-gray-600 mb-2 font-semibold">Social Works</p>
                        <p className="font-semibold text-gray-800">{selectedApplication.social_works || "None"}</p>
                      </div>
                    </div>
                  </section>

                  {/* Reasons for Applying */}
                  <section className="bg-white rounded-lg p-5 shadow-md border-l-4 border-blue-600">
                    <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                      <span className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
                         <Lightbulb className="w-5 h-5" />
                      </span>
                      Reasons for Applying
                    </h4>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {selectedApplication.reason_financial_need && (
                        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-2">
                          <Wallet className="w-4 h-4" /> Financial Need
                        </span>
                      )}
                      {selectedApplication.reason_academic && (
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md items-center gap-2">
                          <School className="w-4 h-4" /> Academic Excellence
                        </span>
                      )}
                      {selectedApplication.reason_sports && (
                        <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md items-center gap-2">
                          <Trophy className="w-4 h-4" /> Sports Achievement
                        </span>
                      )}
                      {selectedApplication.reason_cultural && (
                        <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md items-center gap-2">
                          <Award className="w-4 h-4" /> Cultural/Arts Achievement
                        </span>
                      )}
                    </div>
                    {selectedApplication.reason_other && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-sm text-gray-600 mb-2 font-semibold">Other Reasons</p>
                        <p className="font-semibold text-gray-800">{selectedApplication.reason_other}</p>
                      </div>
                    )}
                  </section>

                  {/* Action Buttons */}
                  {selectedApplication.status === "pending" && (
                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        onClick={() => handleApprove(selectedApplication.scholarship_id)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105"
                      >
                        ✓ Approve Application
                      </button>
                      <button
                        onClick={() => handleReject(selectedApplication.scholarship_id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105"
                      >
                        ✗ Reject Application
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        
      </div>
    </Layout>
  );
}
