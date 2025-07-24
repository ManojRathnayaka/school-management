import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setServerMessage("");
    try {
      const data = await login(email, password);
      if (data.user && data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user && data.user.is_approved === false) {
        navigate("/pending");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Display the actual error message from the server in different color
      if (err.response && err.response.data && err.response.data.message) {
        setServerMessage(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
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
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <a href="/signup" className="text-blue-600 hover:underline text-sm">
            Don't have an account? Sign up
          </a>
        </div>
      </form>
    </div>
  );
}