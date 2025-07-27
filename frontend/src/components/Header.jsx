// React imports
import { useState } from "react";

// Context imports
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Header() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setProfileOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <div />
      <div className="relative">
        <button
          onClick={() => setProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
            {user.first_name.charAt(0)}
            {user.last_name.charAt(0)}
          </div>
          <span className="text-sm">{user.first_name}</span>
        </button>
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                <div className="font-medium">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-gray-500">{user.email}</div>
              </div>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 