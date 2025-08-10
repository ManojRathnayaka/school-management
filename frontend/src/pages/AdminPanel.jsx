import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import CreateUserForm from "../components/CreateUserForm";
import UserManagement from "../components/UserManagement";
import Button from "../components/Button";

export default function AdminPanel() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <Button variant="danger" className="px-3 py-1.5 text-sm" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("create")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "create"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Create User
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "manage"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Manage Users
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "create" && <CreateUserForm />}
        {activeTab === "manage" && <UserManagement />}
      </div>
    </div>
  );
}