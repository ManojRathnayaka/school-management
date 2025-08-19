// React imports
import { useState } from "react";

// Context imports
import { useAuth } from "../context/AuthContext";

// Service imports
import { studentAPI } from "../services/api";
import { useForm } from "../hooks/useForm";
import { GRADES, SECTIONS } from "../constants";
import Layout from "../components/Layout";
import { User, Mail, Hash, Calendar, Home, Phone, List } from "lucide-react";

// Initial form shape
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
      const response = await studentAPI.registerStudent(form);
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
      <div className="p-6">
        <div className="card bg-base-100 shadow-lg rounded-lg border">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-2 text-center text-primary">
              Student Registration
            </h2>

            {error && (
              <div className="alert alert-error my-4">
                <div className="flex-1">
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="alert alert-success my-4">
                <div className="flex-1">
                  <span>{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                  Student Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <User size={18} />
                      </span>
                      <input
                        name="student.first_name"
                        placeholder="First Name"
                        value={form.student.first_name}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <User size={18} />
                      </span>
                      <input
                        name="student.last_name"
                        placeholder="Last Name"
                        value={form.student.last_name}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Mail size={18} />
                      </span>
                      <input
                        name="student.email"
                        type="email"
                        placeholder="Email"
                        value={form.student.email}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Admission Number</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Hash size={18} />
                      </span>
                      <input
                        name="student.admission_number"
                        placeholder="Admission Number"
                        value={form.student.admission_number}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date of Birth</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Calendar size={18} />
                      </span>
                      <input
                        name="student.date_of_birth"
                        type="date"
                        placeholder="Date of Birth"
                        value={form.student.date_of_birth}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Grade</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <List size={18} />
                      </span>
                      <select
                        name="student.grade"
                        value={form.student.grade}
                        onChange={handleInputChange}
                        required
                        className="select select-bordered pl-10 w-full"
                      >
                        {gradeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Section</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <List size={18} />
                      </span>
                      <select
                        name="student.section"
                        value={form.student.section}
                        onChange={handleInputChange}
                        required
                        className="select select-bordered pl-10 w-full"
                      >
                        {sectionOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2 form-control">
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-neutral-400">
                        <Home size={18} />
                      </span>
                      <textarea
                        name="student.address"
                        placeholder="Address"
                        className="textarea textarea-bordered pl-10 w-full"
                        rows="3"
                        value={form.student.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                  Parent Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <User size={18} />
                      </span>
                      <input
                        name="parent.first_name"
                        placeholder="First Name"
                        value={form.parent.first_name}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <User size={18} />
                      </span>
                      <input
                        name="parent.last_name"
                        placeholder="Last Name"
                        value={form.parent.last_name}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Mail size={18} />
                      </span>
                      <input
                        name="parent.email"
                        type="email"
                        placeholder="Email"
                        value={form.parent.email}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Contact Number</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Phone size={18} />
                      </span>
                      <input
                        name="parent.contact_number"
                        type="tel"
                        placeholder="Contact Number"
                        value={form.parent.contact_number}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered pl-10 w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button type="submit" className="btn btn-primary">
                  Register Student
                </button>
              </div>
            </form>

            {sharedPassword && (
              <div className="mt-6 alert alert-success">
                <div className="flex-1">
                  <p className="font-semibold">Registration Successful!</p>
                  <p className="mt-2">
                    Shared Password:
                    <span className="font-mono bg-base-200 px-2 py-1 rounded ml-2">
                      {sharedPassword}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
