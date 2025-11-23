import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../constants";

const sidebarConfig = {
  common: [{ path: "/dashboard", label: "Dashboard" }],
  [USER_ROLES.PRINCIPAL]: [
    { path: "/student-registration", label: "Student Registration", icon: UserPlus },
    { path: "/students", label: "Students", icon: Users },
    { path: "/announcements", label: "Announcements", icon: Megaphone },
    { path: "/Academic&sportsachiv", label: "Achievements", icon: Award },
    { path: "/auditorium-booking-principal", label: "Auditorium Booking", icon: CalendarDays },
    { path: "/scholarship-list", label: "Scholarship management", icon: Home, icon: BookOpenCheck },
    { path: "/HostelAdmin", label: "Hostel management", icon: Home, icon: Home },
  ],
  [USER_ROLES.TEACHER]: [
    { path: "/student-registration", label: "Student Registration", icon: UserPlus },
    { path: "/students", label: "Students", icon: Users },
    { path: "/Academic&sportsachiv", label: "Achievements", icon: Award },
    { path: "/auditorium-booking", label: "Auditorium Booking", icon: CalendarDays },
    { path: "/class-performance", label: "Class Performance", icon: ClipboardList },
    { path: "/HostelAdmin", label: "Hostel management", icon: Home },
  ],
  [USER_ROLES.STUDENT]: [
    { path: "/achievements", label: "Achievements" },
    { path: "/scholarships", label: "Scholarships" },
    { path: "/hostal-application", label: "Hostel Application" },
  ],
  [USER_ROLES.PARENT]: [
    { path: "/achievements", label: "Achievements" },
    { path: "/scholarships", label: "Scholarships" },
    { path: "/parent-portal", label: "Parent Portal" },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const sidebarItems = [
    ...sidebarConfig.common,
    ...(sidebarConfig[user.role] || []),
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r">
      <div className="p-4 h-14 flex items-center">
        <h1 className="text-lg font-semibold text-gray-800">School Portal</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                replace
                className={({ isActive }) =>
                  `block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}