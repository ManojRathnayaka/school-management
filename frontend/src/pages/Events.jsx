import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Events() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/login");
      else if (user && user.is_approved === false) navigate("/pending");
    }
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  // Define sidebar items based on role
  const getSidebarItems = () => {
    const commonItems = {
      dashboard: "Dashboard"
    };

    switch (user.role) {
      case "principal":
        return {
          ...commonItems,
          "student-registration": "Student Registration",
          students: "Students",
          scholarships: "Scholarship Management",
          events: "Event Management",
          "academic-sports": "Academic & Sports"
        };
      case "teacher":
        return {
          ...commonItems,
          "student-registration": "Student Registration",
          students: "Students",
          events: "Event Management",
          "academic-sports": "Academic & Sports"
        };
      case "student":
        return {
          ...commonItems,
          scholarships: "Scholarships",
          "academic-sports": "Academic & Sports"
        };
      case "parent":
        return {
          ...commonItems,
          scholarships: "Scholarships",
          "academic-sports": "Academic & Sports",
          "parent-portal": "Parent Portal"
        };
      default:
        return commonItems;
    }
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-4 border-b h-14 flex items-center">
          <h1 className="text-lg font-semibold text-gray-800">School Portal</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {Object.entries(sidebarItems).map(([key, label]) => (
              <li key={key}>
                <button
                  onClick={() => key === "dashboard" ? navigate("/dashboard") : navigate(`/${key}`)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    key === "events"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Header */}
        <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
          <div></div>
          <div className="relative">
            <button
              onClick={() => setActiveSection(activeSection === "profile" ? "" : "profile")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </div>
              <span className="text-sm">{user.first_name}</span>
            </button>
            {activeSection === "profile" && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user.first_name} {user.last_name}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Event Management</h2>
            <p className="text-gray-600">Event management functionality will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}