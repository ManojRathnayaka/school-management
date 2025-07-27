import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children, allowedRoles = [], loadingComponent = null }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
        return;
      }
      
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        navigate("/dashboard");
        return;
      }
    }
  }, [user, loading, navigate, allowedRoles]);

  if (loading) {
    return loadingComponent || <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
} 