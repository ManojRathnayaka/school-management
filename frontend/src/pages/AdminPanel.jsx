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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Navigation Items for cleaner rendering
  const navItems = [
    { id: "create", label: "Create User", icon: UserPlus },
    { id: "manage", label: "Manage Users", icon: Users },
  ];

  return (
    <div className="h-screen flex bg-gray-50">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-64 
          bg-blue-50 border-r border-blue-100 transform transition-transform duration-200 ease-in-out
          flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sidebar Header / Branding */}
        <div className="h-14 px-4 flex items-center gap-3 border-b border-blue-100">
          <img 
            src={logo} 
            alt="School Logo" 
            className="h-8 w-8 object-contain"
          />
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-slate-800 leading-tight">
              Mahamaya
            </h1>
            <span className="text-xs text-slate-500 font-medium">
              Admin Panel
            </span>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto md:hidden text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false); // Close sidebar on mobile selection
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : "text-slate-600 hover:bg-blue-100/50 hover:text-blue-700"
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-100" : "text-slate-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-blue-100">
          <div className="text-xs text-center text-slate-400">
            &copy; {new Date().getFullYear()} Mahamaya Girls' College
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Content Header */}
        <header className="h-14 bg-blue-50/50 backdrop-blur-md border-b border-blue-100 px-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Trigger */}
            <button 
              onClick={toggleSidebar}
              className="p-1 -ml-1 rounded-md hover:bg-blue-100 text-slate-600 md:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <h2 className="text-lg font-semibold text-slate-800">
              {activeTab === "create" ? "Create User" : "Manage Users"}
            </h2>
          </div>
          
          <button 
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200" 
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === "create" && (
            <div className="max-w-4xl mx-auto">
              {/* Tabs for Single vs Bulk Creation */}
              <div className="bg-white p-1 rounded-xl border border-slate-200 inline-flex mb-6 shadow-sm">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    createTab === "single" 
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-black/5" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  onClick={() => setCreateTab("single")}
                >
                  Single User
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    createTab === "bulk" 
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-black/5" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  onClick={() => setCreateTab("bulk")}
                >
                  Bulk Import
                </button>
              </div>

              {/* Render appropriate form */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                {createTab === "single" && <CreateUserForm />}
                {createTab === "bulk" && <BulkUserForm />}
              </div>
            </div>
          )}

          {activeTab === "manage" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
              <UserManagement />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}