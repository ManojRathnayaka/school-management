import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function AdminPanel() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "teacher",
    // Teacher-specific fields
    grade: "",
    contact_number: "",
  });
  const [tempPassword, setTempPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") navigate("/login");
    }
    // eslint-disable-next-line
  }, [user, loading]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    // Reset teacher-specific fields when role changes from teacher
    if (form.role === "teacher" && newRole !== "teacher") {
      setForm({
        ...form,
        role: newRole,
        grade: "",
        contact_number: "",
      });
    } else {
      setForm({ ...form, role: newRole });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setTempPassword("");
    
    // Prepare form data - only include teacher fields if role is teacher
    const submitData = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      role: form.role,
    };

    // Add teacher-specific fields if role is teacher
    if (form.role === "teacher") {
      submitData.grade = form.grade;
      submitData.contact_number = form.contact_number;
    }

    try {
      const response = await axios.post("/api/create-user", submitData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      setSuccess("User created successfully!");
      setTempPassword(response.data.tempPassword || "");
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        role: "teacher",
        grade: "",
        contact_number: "",
      });
    } catch (err) {
      // Axios automatically throws for HTTP error status codes
      const errorMessage = err.response?.data?.message || "User creation failed. Email may already be registered.";
      setError(errorMessage);
    }
  };

  if (loading || !user) return null;

  const isTeacher = form.role === "teacher";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel - Create New User</h2>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {success && (
          <div className="mb-4 text-green-600 text-sm">{success}</div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
              Basic Information
            </h3>
          </div>
          
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
          <select
            name="role"
            className="p-2 border rounded"
            value={form.role}
            onChange={handleRoleChange}
            required
          >
            <option value="teacher">Teacher</option>
            <option value="principal">Principal</option>
            <option value="admin">Admin</option>
          </select>

          {/* Teacher-specific fields */}
          {isTeacher && (
            <>
              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                  Teacher Information
                </h3>
              </div>
              
              <input
                type="text"
                name="grade"
                placeholder="Grade (optional - e.g., 5th, High School)"
                className="p-2 border rounded"
                value={form.grade}
                onChange={handleChange}
              />
              <input
                type="tel"
                name="contact_number"
                placeholder="Contact Number"
                className="p-2 border rounded"
                value={form.contact_number}
                onChange={handleChange}
              />
            </>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 md:col-span-2 mt-4"
          >
            Create User
          </button>
        </form>
        
        {tempPassword && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 font-semibold mb-2">User Created Successfully!</p>
            <p className="text-green-700">
              Temporary Password: <span className="font-mono bg-green-100 px-2 py-1 rounded">{tempPassword}</span>
            </p>
            <p className="text-sm text-green-600 mt-2">
              Please share this temporary password with the user. They will be required to change it on first login.
            </p>
          </div>
        )}
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