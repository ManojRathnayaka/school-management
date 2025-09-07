import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import CreateUserForm from "../components/CreateUserForm";
import UserManagement from "../components/UserManagement";
import { UserPlus, Users, LogOut } from "lucide-react";

export default function AdminPanel() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="h-screen flex bg-base-200">
      {/* Left Sidebar */}
      <div className="w-64 bg-base-100 shadow-lg flex flex-col">
        {/* Header */}
        <div className="h-14 px-4 flex items-center border-b border-base-300">
          <h1 className="text-lg font-bold text-base-content">Admin Panel</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab("create")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "create"
                    ? "bg-primary text-primary-content"
                    : "text-base-content hover:bg-base-200 hover:text-base-content"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Create User
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("manage")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "manage"
                    ? "bg-primary text-primary-content"
                    : "text-base-content hover:bg-base-200 hover:text-base-content"
                }`}
              >
                <Users className="w-4 h-4" />
                Manage Users
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Logout Button has been moved from here */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Header */}
        <div className="h-14 bg-base-100 px-4 flex items-center justify-between border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">
            {activeTab === "create" ? "Create User" : "Manage Users"}
          </h2>
          
          {/* Logout Button moved here */}
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === "create" && <CreateUserForm />}
          {activeTab === "manage" && <UserManagement />}
        </div>
      </div>
    </div>
  );
}