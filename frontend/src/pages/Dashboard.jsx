import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

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

  // Render overview cards
  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {user.first_name} {user.last_name}!
        </h2>
        <p className="text-gray-600 mb-6">
          Role: <span className="font-semibold capitalize">{user.role}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold text-blue-600">1,247</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Active Scholarships</h3>
          <p className="text-2xl font-bold text-green-600">23</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Events</h3>
          <p className="text-2xl font-bold text-purple-600">8</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Award Winners</h3>
          <p className="text-2xl font-bold text-orange-600">156</p>
        </div>
      </div>
    </div>
  );

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderOverview();
      case "student-registration":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Student Registration</h2>
            <p className="text-gray-600">Student registration functionality will be implemented here.</p>
          </div>
        );
      case "students":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Students</h2>
            <p className="text-gray-600">Student list and management functionality will be implemented here.</p>
          </div>
        );
      case "scholarships":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">
              {user.role === "principal" ? "Scholarship Management" : "Scholarships"}
            </h2>
            <p className="text-gray-600">
              {user.role === "principal" 
                ? "Manage scholarships, approve/reject applications."
                : user.role === "student"
                ? "View and apply for available scholarships."
                : "View scholarship information."
              }
            </p>
          </div>
        );
      case "events":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Event Management</h2>
            <p className="text-gray-600">Event management functionality will be implemented here.</p>
          </div>
        );
      case "academic-sports":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Academic & Sports</h2>
            <p className="text-gray-600">
              {["principal", "teacher"].includes(user.role)
                ? "Manage academic achievements and sports records."
                : "View academic achievements and sports records."
              }
            </p>
          </div>
        );
      case "parent-portal":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Parent Portal</h2>
            <p className="text-gray-600">Connect with students and teachers, view child information.</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

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
                  onClick={() => key === "dashboard" ? setActiveSection(key) : navigate(`/${key}`)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === key
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
              onClick={() => setActiveSection(activeSection === "profile" ? "dashboard" : "profile")}
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
          {renderContent()}
        </div>
      </div>
    </div>
  );
}