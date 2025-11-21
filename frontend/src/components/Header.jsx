import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Header() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good Morning");
      } else if (hour < 17) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return null;
  }

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-700 border-purple-200",
      teacher: "bg-blue-100 text-blue-700 border-blue-200",
      student: "bg-green-100 text-green-700 border-green-200",
      staff: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[role?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-3 flex justify-between items-center shadow-sm">
      {/* School Branding - Left Side */}
      {/* UPDATED: Added 'ml-12 md:ml-0' to push right on mobile, but reset on desktop */}
      <div className="flex items-center space-x-3 ml-12 md:ml-0">
        <img 
          src={logo} 
          alt="School Logo" 
          className="h-8 w-8 object-contain"
        />
        {/* Optional: hide text on very small screens if it still overlaps */}
        <h1 className="text-lg font-semibold text-gray-800 whitespace-nowrap">
          Mahamaya Girls' College
        </h1>
      </div>

      {/* User Section - Right Side */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold text-white shadow-md">
            {user.first_name.charAt(0).toUpperCase()}
            {user.last_name.charAt(0).toUpperCase()}
          </div>
          {/* Hidden on mobile to save space, visible on medium screens up */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm font-medium">
              {greeting}, {user.first_name}
            </span>
          </div>
        </button>

        {isProfileOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setProfileOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-md shadow-lg border border-gray-200/50 z-20">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold text-white shadow-md">
                      {user.first_name.charAt(0).toUpperCase()}
                      {user.last_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-gray-500 truncate">{user.email}</div>
                    </div>
                  </div>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}