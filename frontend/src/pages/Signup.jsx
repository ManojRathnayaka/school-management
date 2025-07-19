import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Signup failed");
      setSuccess("Signup successful! Await admin approval.");
      setTimeout(() => navigate("/pending"), 1500);
    } catch (err) {
      setError("Signup failed. Email may already be registered.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {success && (
          <div className="mb-4 text-green-600 text-sm">{success}</div>
        )}
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          className="w-full mb-4 p-2 border rounded"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          className="w-full mb-4 p-2 border rounded"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="w-full mb-6 p-2 border rounded"
          value={form.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="parent">Parent</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:underline text-sm">
            Already have an account? Login
          </a>
        </div>
      </form>
    </div>
  );
}
