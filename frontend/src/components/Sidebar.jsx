import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../constants";
import {
  UserPlus,
  BookOpenCheck,
  CalendarDays,
  Award,
  UserCheck,
  ClipboardList,
  Home,
  Users,
  GraduationCap,
  Megaphone,
  LayoutDashboard,
  School,
  Menu,
  X,
} from "lucide-react";

const sidebarConfig = {
  common: [{ path: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  [USER_ROLES.PRINCIPAL]: [
    { path: "/student-registration", label: "Student Registration", icon: UserPlus },
    { path: "/students", label: "Students", icon: Users },
    { path: "/announcements", label: "Announcements", icon: Megaphone },
    { path: "/Academic&sportsachiv", label: "Achievements", icon: Award },
    { path: "/auditorium-booking-principal", label: "Auditorium Booking", icon: CalendarDays },
    { path: "/scholarship-list", label: "Scholarship Management", icon: BookOpenCheck },
    { path: "/HostelAdmin", label: "Hostel management",icon: Home },
  ],
  [USER_ROLES.TEACHER]: [
    { path: "/student-registration", label: "Student Registration", icon: UserPlus },
    { path: "/students", label: "Students", icon: Users },
    { path: "/Academic&sportsachiv", label: "Achievements", icon: Award },
    { path: "/auditorium-booking", label: "Auditorium Booking", icon: CalendarDays },
    { path: "/class-performance", label: "Class Performance", icon: ClipboardList },
    { path: "/HostelAdmin", label: "Hostel management",icon: Home },
  ],
  [USER_ROLES.STUDENT]: [
    { path: "/Academic&sportsachiv", label: "Achievements", icon: Award },
    { path: "/scholarships", label: "Scholarships", icon: GraduationCap },
    { path: "/hostal-application", label: "Hostel Application", icon: Home },
  ],
  [USER_ROLES.PARENT]: [
    { path: "/Academic&sportsachiv", label: "Achievements", icon: Award },
    { path: "/parent-portal", label: "Parent Portal", icon: UserCheck },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) return null;

  const sidebarItems = [
    ...sidebarConfig.common,
    ...(sidebarConfig[user.role] || []),
  ];

  return (
    <>
      {/* --- Mobile Trigger Button (Only visible when sidebar is CLOSED) --- */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-[60] p-2 rounded-md bg-white shadow-md md:hidden text-gray-600 hover:text-blue-600"
          aria-label="Open Sidebar"
        >
          <Menu size={24} />
        </button>
      )}

      {/* --- Mobile Overlay (Backdrop) --- */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- Main Sidebar Container --- */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-50 shadow-sm border-r border-slate-200
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 bg-slate-100/50">
          <div className="flex items-center gap-3">
            <School className="text-blue-600" />
            <span className="font-bold text-lg text-slate-800">School Portal</span>
          </div>

          {/* Close Button - Visible only on Mobile inside the header */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-slate-500 hover:text-red-600 p-1"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-3.5rem)]">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    replace
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-100 text-blue-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}