import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res = await axios.get("api/hostel-applications");
        setApplications(res.data); 
      } catch (err) {
        console.error(err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleApplicationStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `api/hostel-applications/${id}/status`,
        { status: newStatus }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === id ? { ...app, status: newStatus } : app
        )
      );

      alert(`Application ${id} marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <p className="p-4">Loading applications...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <Layout activePage="hostelAdmin">
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">
              Hostel Admin Portal
            </h1>
          </div>
        </div>
      </header>

      {/* Applications Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Applications Management
        </h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Application ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Hostel Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.application_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {app.application_id}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {app.first_name} {app.last_name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {app.email}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {app.hostel_name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() =>
                          handleApplicationStatusChange(
                            app.application_id,
                            "approved"
                          )
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleApplicationStatusChange(
                            app.application_id,
                            "rejected"
                          )
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>

                      <button className="text-blue-600 hover:text-blue-900">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}
