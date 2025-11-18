import { useState, useEffect } from "react";
import { useForm } from "../hooks/useForm";
import { USER_ROLES, GRADES } from "../constants";
import { userAPI } from "../services/api";
import { User, Mail, Phone, UserCheck, AlertCircle, Check } from "lucide-react";
import UserCreatedModal from "./modals/UserCreatedModal";

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  role: "",
  grade: "",
  contact_number: "",
};

export default function CreateUserForm() {
  const [tempPassword, setTempPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {
    form,
    error,
    success,
    setFormError,
    setFormSuccess,
    handleInputChange,
    resetForm,
  } = useForm(initialForm);

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setFormError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setFormError]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setFormSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, setFormSuccess]);

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
      const response = await userAPI.createUser(submitData);
      setTempPassword(response.data.tempPassword || "");
      setShowSuccessModal(true);
      resetForm();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "User creation failed.";
      setFormError(errorMessage);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setTempPassword("");
  };

  const isTeacher = form.role === USER_ROLES.TEACHER;

  const roleOptions = [
    { value: USER_ROLES.TEACHER, label: "Teacher" },
    { value: USER_ROLES.PRINCIPAL, label: "Principal" },
    { value: USER_ROLES.ADMIN, label: "Admin" },
  ];

  return (
    <div className="p-4">
      {/* Alert Messages */}
      {error && (
        <div className="alert alert-error mb-6">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-6">
          <Check className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">First Name</span>
              </label>
              <input
                type="text"
                name="first_name"
                placeholder="Enter first name"
                className="input input-bordered input-sm"
                value={form.first_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Last Name</span>
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Enter last name"
                className="input input-bordered input-sm"
                value={form.last_name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                className="input input-bordered input-sm w-full pl-8"
                value={form.email}
                onChange={handleInputChange}
                required
              />
              <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 opacity-50" />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Role</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {roleOptions.map((option) => (
                <div key={option.value} className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={form.role === option.value}
                      onChange={handleRoleChange}
                      className="radio radio-primary mr-2"
                      required
                    />
                    <span className="label-text">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Teacher Information */}
        <div className={`mb-6 transition-all duration-300 ease-in-out ${isTeacher ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Teacher Information
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Grade</span>
              </label>
              <select
                name="grade"
                className="select select-bordered select-sm"
                value={form.grade}
                onChange={handleInputChange}
                required={isTeacher}
              >
                <option value="">Select Grade</option>
                {GRADES.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Contact Number</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="contact_number"
                  placeholder="Enter contact number"
                  className="input input-bordered input-sm w-full pl-8"
                  value={form.contact_number}
                  onChange={handleInputChange}
                />
                <Phone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary btn-sm">
            <User className="w-4 h-4 mr-2" />
            Create User
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <UserCreatedModal
        isOpen={showSuccessModal}
        tempPassword={tempPassword}
        onClose={handleModalClose}
      />
    </div>
  );
}