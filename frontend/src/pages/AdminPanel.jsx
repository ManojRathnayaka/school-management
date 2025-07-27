// React imports
import { useState } from "react";

// Context imports
import { useAuth } from "../context/AuthContext";

// Service imports
import axios from "axios";
import { useForm } from "../hooks/useForm";
import { USER_ROLES, GRADES } from "../constants";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  role: USER_ROLES.TEACHER,
  grade: "",
  contact_number: "",
};

export default function AdminPanel() {
  const { logout } = useAuth();
  const [tempPassword, setTempPassword] = useState("");
  const {
    form,
    error,
    success,
    setFormError,
    setFormSuccess,
    handleInputChange,
    resetForm,
  } = useForm(initialForm);

  const handleRoleChange = (e) => {
    handleInputChange(e);
    if (e.target.value !== USER_ROLES.TEACHER) {
      handleInputChange({ target: { name: "grade", value: "" } });
      handleInputChange({ target: { name: "contact_number", value: "" } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setTempPassword("");

    const submitData = { ...form };
    if (form.role !== USER_ROLES.TEACHER) {
      delete submitData.grade;
      delete submitData.contact_number;
    }

    try {
      const response = await axios.post("/api/create-user", submitData, {
        withCredentials: true,
      });
      setFormSuccess("User created successfully!");
      setTempPassword(response.data.tempPassword || "");
      resetForm();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "User creation failed.";
      setFormError(errorMessage);
    }
  };

  const isTeacher = form.role === USER_ROLES.TEACHER;
  const roleOptions = [
    { value: USER_ROLES.TEACHER, label: "Teacher" },
    { value: USER_ROLES.PRINCIPAL, label: "Principal" },
    { value: USER_ROLES.ADMIN, label: "Admin" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Panel - Create New User
        </h2>
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
              Basic Information
            </h3>
          </div>

          <Input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleInputChange} required />
          <Input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleInputChange} required />
          <Input type="email" name="email" placeholder="Email" value={form.email} onChange={handleInputChange} required />
          <Select name="role" value={form.role} onChange={handleRoleChange} options={roleOptions} required />

          {isTeacher && (
            <>
              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                  Teacher Information
                </h3>
              </div>
              <Select name="grade" value={form.grade} onChange={handleInputChange} options={[{ value: "", label: "Select Grade" }, ...GRADES]} required />
              <Input type="tel" name="contact_number" placeholder="Contact Number" value={form.contact_number} onChange={handleInputChange} />
            </>
          )}

          <div className="md:col-span-2 mt-4">
            <Button type="submit" className="w-full">
              Create User
            </Button>
          </div>
        </form>

        {tempPassword && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 font-semibold mb-2">
              User Created Successfully!
            </p>
            <p className="text-green-700">
              Temporary Password:{" "}
              <span className="font-mono bg-green-100 px-2 py-1 rounded">
                {tempPassword}
              </span>
            </p>
          </div>
        )}
      </div>
      <Button variant="danger" className="mt-8" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}