import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PendingApproval() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Pending Approval</h2>
        <p className="mb-2">Your account is awaiting admin approval.</p>
        <p className="text-gray-500">
          Please check back later or contact your school administrator.
        </p>
      </div>
    </div>
  );
}
