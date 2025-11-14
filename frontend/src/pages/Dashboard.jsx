import { useAuth } from "../context/AuthContext";
import { useMemo, useState, useEffect } from "react";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import { USER_ROLES } from "../constants";
import { announcementAPI } from "../services/api";
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
} from "lucide-react";

const dashboardCardConfig = [
  {
    title: "Student Registration",
    description: "Register new students or manage existing ones",
    icon: UserPlus,
    path: "/student-registration",
    roles: [USER_ROLES.PRINCIPAL, USER_ROLES.TEACHER],
  },
  {
    title: "View Students",
    description: "Browse and search the directory of all students",
    icon: Users,
    path: "/students",
    roles: [USER_ROLES.PRINCIPAL, USER_ROLES.TEACHER],
  },
  {
    title: "Announcement Management",
    description: "Create, edit, and delete school announcements",
    icon: Megaphone,
    path: "/announcements",
    roles: [USER_ROLES.PRINCIPAL],
  },
  {
    title: "Scholarship Management",
    description: "Review, approve, or reject student applications",
    icon: BookOpenCheck,
    path: "/scholarship-list",
    roles: [USER_ROLES.PRINCIPAL],
  },
  {
    title: "Auditorium Booking",
    description: "Approve or reject venue bookings and view the schedule",
    icon: CalendarDays,
    path: "/auditorium-booking-principal",
    roles: [USER_ROLES.PRINCIPAL],
  },
  {
    title: "Auditorium Booking",
    description: "Book the auditorium for events or check availability",
    icon: CalendarDays,
    path: "/auditorium-booking",
    roles: [USER_ROLES.TEACHER],
  },
  {
    title: "Class Performance",
    description: "Update and manage student performance records",
    icon: ClipboardList,
    path: "/class-performance",
    roles: [USER_ROLES.TEACHER],
  },
  {
    title: "Scholarships",
    description: "View and apply for available scholarships",
    icon: GraduationCap,
    path: "/scholarships",
    roles: [USER_ROLES.STUDENT, USER_ROLES.PARENT],
  },
  {
    title: "Hostel Application",
    description: "Apply for or manage your hostel accommodation",
    icon: Home,
    path: "/hostal-application",
    roles: [USER_ROLES.STUDENT],
  },
  {
    title: "Academic & Sports",
    description: "Track and celebrate student achievements",
    icon: Award,
    path: "/academic-sports",
    roles: [
      USER_ROLES.PRINCIPAL,
      USER_ROLES.TEACHER,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT,
    ],
  },
  {
    title: "Parent Portal",
    description: "Access information and track student progress",
    icon: UserCheck,
    path: "/parent-portal",
    roles: [USER_ROLES.PARENT],
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoadingAnnouncements(true);
        const response = await announcementAPI.getLatest(5);
        setAnnouncements(response.data.announcements);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setIsLoadingAnnouncements(false);
      }
    };

    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  const accessibleCards = useMemo(() => {
    if (!user) return [];
    return dashboardCardConfig.filter((card) => card.roles.includes(user.role));
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Layout activePage="dashboard">
      <div className="space-y-8 p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-base-content">
              Welcome, {user.first_name} {user.last_name}!
            </h2>
            <p className="text-base-content/70 mt-1 text-base">
              Role:{" "}
              <span className="font-semibold capitalize badge badge-primary badge-lg">
                {user.role}
              </span>
            </p>
          </div>
          <div className="badge badge-outline badge-lg font-medium text-base px-4 py-4">
            {today}
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-2xl text-base-content flex items-center">
              <Megaphone className="w-6 h-6 text-primary mr-2" />
              Latest Announcements
            </h2>

            {isLoadingAnnouncements ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 text-base-content/50">
                No announcements at this time.
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.announcement_id}
                    className="bg-base-100 rounded-lg p-4 border border-base-300"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base-content text-lg">
                          {announcement.title}
                        </h3>
                        <p className="text-base-content/70 mt-2 text-sm whitespace-pre-wrap">
                          {announcement.content}
                        </p>
                      </div>
                      <div className="text-xs text-base-content/50 whitespace-nowrap">
                        {formatDate(announcement.created_at)}
                      </div>
                    </div>
                    <div className="text-xs text-base-content/50 mt-3">
                      Posted by {announcement.first_name}{" "}
                      {announcement.last_name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {accessibleCards.map((card) => (
            <DashboardCard
              key={card.path}
              title={card.title}
              description={card.description}
              icon={card.icon}
              path={card.path}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
