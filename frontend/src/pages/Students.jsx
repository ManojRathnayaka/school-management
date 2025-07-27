// Component imports
import Layout from "../components/Layout";

export default function Students() {
  return (
    <Layout activePage="students">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Students</h2>
        <p className="text-gray-600">Student management functionality will be implemented here.</p>
      </div>
    </Layout>
  );
}