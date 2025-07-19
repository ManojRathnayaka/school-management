import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "teacher",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") navigate("/login");
      else fetchPending();
    }
    // eslint-disable-next-line
  }, [user, loading]);

  const fetchPending = async () => {
    const res = await fetch("/api/pending-users", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setPendingUsers(data.users);
    }
  };

  const approveUser = async (user_id) => {
    await fetch("/api/approve-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ user_id }),
    });
    fetchPending();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("User creation failed");
      setSuccess("User created and approved!");
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "teacher",
      });
    } catch (err) {
      setError("User creation failed. Email may already be registered.");
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl mb-8">
        <h2 className="text-2xl font-bold mb-4">Pending User Approvals</h2>
        {pendingUsers.length === 0 ? (
          <p className="text-gray-500">No users pending approval.</p>
        ) : (
          <ul>
            {pendingUsers.map((u) => (
              <li
                key={u.user_id}
                className="flex justify-between items-center border-b py-2"
              >
                <span>
                  {u.first_name} {u.last_name} ({u.role}) - {u.email}
                </span>
                <button
                  onClick={() => approveUser(u.user_id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Create New User</h2>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {success && (
          <div className="mb-4 text-green-600 text-sm">{success}</div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            className="p-2 border rounded"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            className="p-2 border rounded"
            value={form.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-2 border rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="p-2 border rounded"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="p-2 border rounded"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="teacher">Teacher</option>
            <option value="principal">Principal</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 md:col-span-2"
          >
            Create User
          </button>
        </form>
      </div>
      <button
        onClick={logout}
        className="mt-8 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
