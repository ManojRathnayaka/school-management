import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [mustReset, setMustReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setServerMessage("");
    setIsSubmitting(true);
    
    try {
      if (!mustReset) {
        const data = await login(email, password);
        if (data.mustResetPassword) {
          setMustReset(true);
          setServerMessage(data.message);
          setIsSubmitting(false);
          return;
        }
        if (data.user && data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        // Handle password reset
        const response = await axios.post("/api/reset-password-first-login", {
          email,
          tempPassword: password,
          newPassword,
          confirmPassword,
        }, {
          headers: { "Content-Type": "application/json" }
        });
        
        setUser(response.data.user);
        if (response.data.user && response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
        setMustReset(false);
        setServerMessage("");
        setEmail("");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {serverMessage && <div className="mb-4 text-blue-600 text-sm">{serverMessage}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <input
          type="password"
          placeholder={mustReset ? "Temporary Password" : "Password"}
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {mustReset && (
          <>
            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-4 p-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full mb-6 p-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </>
        )}
        <button
          type="submit"
          className={mustReset ? "w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" : "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"}
          disabled={isSubmitting}
        >
          {mustReset ? "Set New Password" : "Login"}
        </button>
      </form>
    </div>
  );
}