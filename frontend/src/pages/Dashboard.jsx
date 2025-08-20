// React imports
import { useAuth } from "../context/AuthContext";

// Component imports
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null; 
  }

  return (
    <Layout activePage="dashboard">
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {user.first_name} {user.last_name}!
          </h2>
          <p className="text-gray-600 mb-6">
            Role: <span className="font-semibold capitalize">{user.role}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Students" value="1,247" color="blue" />
          <StatsCard title="Active Scholarships" value="23" color="green" />
          <StatsCard title="Upcoming Events" value="8" color="purple" />
          <StatsCard title="Award Winners" value="156" color="orange" />
        </div>
      </div>
    </Layout>
  );
}