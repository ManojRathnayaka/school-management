// Component imports
import Layout from "../components/Layout";

export default function ParentPortal() {
  return (
    <Layout activePage="parent-portal">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Parent Portal</h2>
        <p className="text-gray-600">Parent portal functionality will be implemented here.</p>
      </div>
    </Layout>
  );
}