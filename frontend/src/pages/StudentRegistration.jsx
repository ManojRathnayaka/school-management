// React imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Context imports
import { useAuth } from "../context/AuthContext";

// Service imports
import axios from "axios";
import { useForm } from "../hooks/useForm";
import { GRADES, SECTIONS } from "../constants";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Layout from "../components/Layout";

const initialForm = {
  student: {
    first_name: "",
    last_name: "",
    email: "",
    admission_number: "",
    date_of_birth: "",
    grade: "",
    section: "",
    address: "",
  },
  parent: {
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
  },
};

export default function StudentRegistration() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sharedPassword, setSharedPassword] = useState("");
  const {
    form,
    error,
    success,
    setFormError,
    setFormSuccess,
    handleInputChange,
    resetForm,
  } = useForm(initialForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSharedPassword("");

    try {
      const response = await axios.post("/api/register-student", form, {
        withCredentials: true,
      });
      setFormSuccess("Student and parent registered successfully!");
      setSharedPassword(response.data.sharedPassword);
      resetForm();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed.";
      setFormError(errorMessage);
    }
  };

  if (loading || !user) return null;

  const gradeOptions = [{ value: "", label: "Select Grade" }, ...GRADES];
  const sectionOptions = [{ value: "", label: "Select Section" }, ...SECTIONS];

  return (
    <Layout activePage="student-registration">
      <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Student Registration
        </h2>
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="student.first_name" placeholder="First Name" value={form.student.first_name} onChange={handleInputChange} required />
              <Input name="student.last_name" placeholder="Last Name" value={form.student.last_name} onChange={handleInputChange} required />
              <Input name="student.email" type="email" placeholder="Email" value={form.student.email} onChange={handleInputChange} required />
              <Input name="student.admission_number" placeholder="Admission Number" value={form.student.admission_number} onChange={handleInputChange} required />
              <Input name="student.date_of_birth" type="date" placeholder="Date of Birth" value={form.student.date_of_birth} onChange={handleInputChange} required />
              <Select name="student.grade" value={form.student.grade} onChange={handleInputChange} options={gradeOptions} required />
              <Select name="student.section" value={form.student.section} onChange={handleInputChange} options={sectionOptions} required />
              <textarea name="student.address" placeholder="Address" className="p-2 border rounded md:col-span-2" rows="3" value={form.student.address} onChange={handleInputChange} required />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Parent Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="parent.first_name" placeholder="First Name" value={form.parent.first_name} onChange={handleInputChange} required />
              <Input name="parent.last_name" placeholder="Last Name" value={form.parent.last_name} onChange={handleInputChange} required />
              <Input name="parent.email" type="email" placeholder="Email" value={form.parent.email} onChange={handleInputChange} required />
              <Input name="parent.contact_number" type="tel" placeholder="Contact Number" value={form.parent.contact_number} onChange={handleInputChange} required />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Register Student
          </Button>
        </form>

        {sharedPassword && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 font-semibold mb-2">
              Registration Successful!
            </p>
            <p className="text-green-700">
              Shared Password:{" "}
              <span className="font-mono bg-green-100 px-2 py-1 rounded">
                {sharedPassword}
              </span>
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
} 