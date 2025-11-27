import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import CreateUserForm from "../components/CreateUserForm";
import BulkUserForm from "../components/BulkUserForm";
import UserManagement from "../components/UserManagement";
import { UserPlus, Users, LogOut, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

export default function AdminPanel() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("create");
  const [createTab, setCreateTab] = useState("single");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen flex bg-base-200 overflow-hidden">
      {/* MOBILE OVERLAY BACKDROP */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-64 shadow-lg flex flex-col transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        bg-gradient-to-b from-blue-50 via-white to-blue-50
      `}
      >
        {/* Header inside Sidebar */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-blue-100">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="School Logo"
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-lg font-bold text-base-content">Admin Panel</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn btn-ghost btn-sm btn-square lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleNavClick("create")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "create"
                    ? "bg-primary text-primary-content shadow-md" 
                    : "text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Create User
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("manage")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "manage"
                    ? "bg-primary text-primary-content shadow-md"
                    : "text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm"
                }`}
              >
                <Users className="w-4 h-4" />
                Manage Users
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-blue-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="btn btn-ghost btn-sm btn-square lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-slate-800 truncate">
              {activeTab === "create" ? "Create User" : "Manage Users"}
            </h2>
          </div>

          <button className="btn btn-ghost btn-sm text-slate-600 hover:bg-blue-50" onClick={logout}>
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === "create" && (
            <div>
              <div className="tabs tabs-boxed mb-6 w-fit bg-white border border-blue-100">
                <button
                  className={`tab ${
                    createTab === "single" ? "tab-active" : ""
                  }`}
                  onClick={() => setCreateTab("single")}
                >
                  Single User
                </button>
                <button
                  className={`tab ${createTab === "bulk" ? "tab-active" : ""}`}
                  onClick={() => setCreateTab("bulk")}
                >
                  Bulk Import
                </button>
              </div>
              {createTab === "single" && <CreateUserForm />}
              {createTab === "bulk" && <BulkUserForm />}
            </div>
          )}
          {activeTab === "manage" && <UserManagement />}
        </div>
      </div>
    </div>
  );
}