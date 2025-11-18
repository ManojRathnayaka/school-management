// components/modals/EditStudentModal.js
import { useState, useEffect } from "react";
import { GRADES, SECTIONS } from "../../constants";
import { studentAPI } from "../../services/api";

export default function EditStudentModal({ show, student, onClose, onSave }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    grade: "",
    section: "",
    admission_number: "",
    date_of_birth: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && student) {
      // Open the DaisyUI modal
      const modal = document.getElementById(`edit_student_modal_${student.student_id}`);
      if (modal) {
        modal.showModal();
      }
      
      // Populate form data
      setFormData({
        first_name: student.first_name || "",
        last_name: student.last_name || "",
        email: student.email || "",
        grade: student.grade || "",
        section: student.section || "",
        admission_number: student.admission_number || "",
        date_of_birth: student.date_of_birth,
        address: student.address || ""
      });
      
      // Clear error when modal opens
      setError("");
    }
  }, [show, student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updateData = {
        student: formData
      };

      await studentAPI.updateStudent(student.student_id, updateData);
      
      // Call onSave to refresh the parent component's data
      onSave();
      
      // Close the modal
      handleClose();
      
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const modal = document.getElementById(`edit_student_modal_${student?.student_id}`);
    if (modal) {
      modal.close();
    }
    setError("");
    onClose();
  };

  if (!student) return null;

  return (
    <dialog id={`edit_student_modal_${student.student_id}`} className="modal">
      <div className="modal-box max-w-2xl">
        {/* Close button */}
        <form method="dialog">
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </button>
        </form>

        {/* Modal header */}
        <h3 className="font-bold text-xl mb-6">Edit Student</h3>
        
        {/* Error alert */}
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter first name"
              className="input input-bordered w-full"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Last Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter last name"
              className="input input-bordered w-full"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Admission Number */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Admission Number</span>
            </label>
            <input
              type="text"
              name="admission_number"
              placeholder="Enter admission number"
              className="input input-bordered w-full"
              value={formData.admission_number}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Date of Birth</span>
            </label>
            <input
              type="date"
              name="date_of_birth"
              className="input input-bordered w-full"
              value={formData.date_of_birth}
              onChange={handleInputChange}
            />
          </div>

          {/* Grade */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Grade</span>
            </label>
            <select
              name="grade"
              className="select select-bordered w-full"
              value={formData.grade}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Grade</option>
              {GRADES.map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Section</span>
            </label>
            <select
              name="section"
              className="select select-bordered w-full"
              value={formData.section}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Section</option>
              {SECTIONS.map((section) => (
                <option key={section.value} value={section.value}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <textarea
              name="address"
              placeholder="Enter address"
              className="textarea textarea-bordered w-full"
              rows="3"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          {/* Action buttons */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}