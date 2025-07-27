import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../constants";

const sidebarConfig = {
  common: [{ path: "/dashboard", label: "Dashboard" }],
  [USER_ROLES.PRINCIPAL]: [
    { path: "/student-registration", label: "Student Registration" },
    { path: "/students", label: "Students" },
    { path: "/scholarships", label: "Scholarship Management" },
    { path: "/events", label: "Event Management" },
    { path: "/academic-sports", label: "Academic & Sports" },
  ],
  [USER_ROLES.TEACHER]: [
    { path: "/student-registration", label: "Student Registration" },
    { path: "/students", label: "Students" },
    { path: "/events", label: "Event Management" },
    { path: "/academic-sports", label: "Academic & Sports" },
  ],
  [USER_ROLES.STUDENT]: [
    { path: "/scholarships", label: "Scholarships" },
    { path: "/academic-sports", label: "Academic & Sports" },
  ],
  [USER_ROLES.PARENT]: [
    { path: "/scholarships", label: "Scholarships" },
    { path: "/academic-sports", label: "Academic & Sports" },
    { path: "/parent-portal", label: "Parent Portal" },
  ],
};

function NavLink({ path, label, activePath, onClick }) {
  const isActive = path.substring(1) === activePath;
  const classes = `w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "bg-blue-100 text-blue-700"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
  }`;

  return (
    <li>
      <button onClick={() => onClick(path)} className={classes}>
        {label}
      </button>
    </li>
  );
}

export default function Sidebar({ activePage }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const getSidebarItems = () => [
    ...sidebarConfig.common,
    ...(sidebarConfig[user.role] || []),
  ];

  const sidebarItems = getSidebarItems();

  return (
    <div className="w-64 bg-white shadow-sm border-r">
      <div className="p-4 border-b h-14 flex items-center">
        <h1 className="text-lg font-semibold text-gray-800">School Portal</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              path={item.path}
              label={item.label}
              activePath={activePage}
              onClick={navigate}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
} 