import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/login");
      else if (user && user.is_approved === false) navigate("/pending");
    }
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {user.first_name} {user.last_name}!
        </h2>
        <p className="mb-2">
          Role: <span className="font-semibold">{user.role}</span>
        </p>
        <p className="mb-6">
          Email: <span className="font-mono">{user.email}</span>
        </p>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
