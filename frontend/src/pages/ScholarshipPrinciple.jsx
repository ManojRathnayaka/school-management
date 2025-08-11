import  { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function ScholarshipList({ /*user*/ }) {
  const [applications, setApplications] = useState([]);

//   useEffect(() => {
//     if (user?.role === "principal") {
//       axios
//         .get("http://localhost:4000/api/scholarships", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//         })
//         .then(res => setApplications(res.data))
//         .catch(err => console.error(err));
//     }
//   }, [user]);


    useEffect(() => {
    axios.get("http://localhost:4000/api/scholarships", { withCredentials: true })
      .then(res => setApplications(res.data))
      .catch(err => console.error(err));
  }, []);


  const handleApprove = (id) => {
    axios.put(`http://localhost:4000/api/scholarships/${id}/approve`, {}, { withCredentials: true })
      .then(() => setApplications(applications.map(a => a.scholarship_id === id ? { ...a, status: "approved" } : a)));
  };

  const handleReject = (id) => {
    axios.put(`http://localhost:4000/api/scholarships/${id}/reject`, {}, { withCredentials: true })
      .then(() => setApplications(applications.map(a => a.scholarship_id === id ? { ...a, status: "rejected" } : a)));
  };

//   if (user?.role !== "principal") {
//     return <p className="text-red-500">Access denied. Principals only.</p>;
//   }

  return (
    <Layout activePage="scholarship-list">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Scholarship Applications</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th>Student</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.scholarship_id}>
              <td>{app.first_name} {app.last_name}</td>
              <td>{app.grade}{app.section}</td>
              <td>{app.status}</td>
              <td>
                {app.status === "pending" && (
                  <>
                    <button onClick={() => handleApprove(app.scholarship_id)} className="bg-green-500 text-white px-2 py-1 mr-2">Approve</button>
                    <button onClick={() => handleReject(app.scholarship_id)} className="bg-red-500 text-white px-2 py-1">Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </Layout>
  );
}
