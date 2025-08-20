// React imports
import { useState } from "react";

// Context imports
import { useAuth } from "../context/AuthContext";

// Service imports
import { studentAPI } from "../services/api";
import { useForm } from "../hooks/useForm";
import { GRADES, SECTIONS } from "../constants";

// Component imports
import Layout from "../components/Layout";
import SharedPasswordModal from "../components/modals/SharedPasswordModal";

// Icon imports
import { UserPlus, User, Mail, Hash, Calendar, Home, Phone, GraduationCap } from "lucide-react";

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
      
      // Open the modal automatically
      document.getElementById('success_modal').showModal();
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
        {/* Main Container */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Header */}
            <div className="mb-6">
              <h1 className="card-title text-3xl text-base-content">
                <UserPlus className="w-8 h-8 text-primary mr-2" />
                Student Registration
              </h1>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Information Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-base-content flex items-center">
                  <GraduationCap className="w-5 h-5 text-primary mr-2" />
                  Student Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">First Name</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                      <input
                        name="student.first_name"
                        placeholder="First Name"
                        value={form.student.first_name}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered input-sm w-full pl-10"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">Last Name</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                      <input
                        name="student.last_name"
                        placeholder="Last Name"
                        value={form.student.last_name}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered input-sm w-full pl-10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">Email</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                      <input
                        name="student.email"
                        type="email"
                        placeholder="Email"
                        value={form.student.email}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered input-sm w-full pl-10"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">Admission Number</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                      <input
                        name="student.admission_number"
                        placeholder="Admission Number"
                        value={form.student.admission_number}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered input-sm w-full pl-10"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">Date of Birth</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                      <input
                        name="student.date_of_birth"
                        type="date"
                        placeholder="Date of Birth"
                        value={form.student.date_of_birth}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered input-sm w-full pl-10"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">Grade</span>
                    </label>
                    <select
                      name="student.grade"
                      value={form.student.grade}
                      onChange={handleInputChange}
                      required
                      className="select select-bordered select-sm w-full"
                    >
                      {gradeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">Section</span>
                    </label>
                    <select
                      name="student.section"
                      value={form.student.section}
                      onChange={handleInputChange}
                      required
                      className="select select-bordered select-sm w-full"
                    >
                      {sectionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">Address</span>
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 w-4 h-4 text-base-content/50" />
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

              {/* Parent Information Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-base-content flex items-center">
                  <User className="w-5 h-5 text-primary mr-2" />
                  Parent Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">First Name</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                      <input
                        name="parent.first_name"
                        placeholder="First Name"
                        value={form.parent.first_name}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered input-sm w-full pl-10"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">Last Name</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                      <input
                        name="parent.last_name"
                        placeholder="Last Name"
                        value={form.parent.last_name}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered input-sm w-full pl-10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">Email</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                      <input
                        name="parent.email"
                        type="email"
                        placeholder="Email"
                        value={form.parent.email}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered input-sm w-full pl-10"
                      />
                    </div>
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text text-base-content/70">Contact Number</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                      <input
                        name="parent.contact_number"
                        type="tel"
                        placeholder="Contact Number"
                        value={form.parent.contact_number}
                        onChange={handleInputChange}
                        required
                        className="input input-bordered input-sm w-full pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button type="submit" className="btn btn-primary">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register Student
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Success Modal */}
        <SharedPasswordModal 
          sharedPassword={sharedPassword} 
          modalId="success_modal" 
        />
      </div>
    </Layout>
  );
}