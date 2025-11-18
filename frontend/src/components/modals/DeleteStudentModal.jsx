// components/modals/DeleteStudentModal.js
import { useState, useEffect } from "react";
import { AlertTriangle, Trash2, User, Users } from "lucide-react";
import { studentAPI } from "../../services/api";

export default function DeleteStudentModal({ show, student, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && student) {
      // Open the DaisyUI modal
      const modal = document.getElementById(`delete_student_modal_${student.student_id}`);
      if (modal) {
        modal.showModal();
      }
      
      // Clear error when modal opens
      setError("");
    }
  }, [show, student]);

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await studentAPI.deleteStudent(student.student_id);
      
      // Call onConfirm to refresh the parent component's data
      onConfirm();
      
      // Close the modal
      handleClose();
      
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || "Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const modal = document.getElementById(`delete_student_modal_${student?.student_id}`);
    if (modal) {
      modal.close();
    }
    setError("");
    onClose();
  };

  if (!student) return null;

  return (
    <dialog id={`delete_student_modal_${student.student_id}`} className="modal">
      <div className="modal-box">
        {/* Close button */}
        <form method="dialog">
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </button>
        </form>

        {/* Warning icon and header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-12 h-12 text-error" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-error">Confirm Deletion</h3>
            <p className="text-base-content/70 text-sm">This action cannot be undone</p>
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <div className="alert alert-error mb-4">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Student information card */}
        <div className="card bg-error/10 border border-error/20 mb-6">
          <div className="card-body p-4">
            <div className="flex items-start gap-3">
              <div className="avatar placeholder">
                <div className="bg-error text-error-content rounded-full w-10">
                  <span className="text-sm font-medium">
                    {student.first_name?.[0]}{student.last_name?.[0]}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-base-content/70" />
                  <span className="font-semibold text-base-content">
                    {student.first_name} {student.last_name}
                  </span>
                </div>
                <div className="text-sm text-base-content/70 space-y-1">
                  <p>Admission No: <span className="font-mono font-medium">{student.admission_number}</span></p>
                  <p>Grade: <span className="font-medium">{student.grade}{student.section}</span></p>
                  {student.email && <p>Email: {student.email}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning message */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-base-content mb-1">Complete Account Deletion</p>
              <p className="text-base-content/70">
                Deleting this student will also permanently remove their associated parent account 
                and all related data from the system.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation text */}
        <p className="text-base-content mb-6">
          Are you sure you want to delete this student? This will permanently remove:
        </p>
        
        <ul className="list-disc list-inside text-sm text-base-content/70 mb-6 space-y-1 ml-4">
          <li>Student account and profile</li>
          <li>Associated parent account</li>
          <li>All academic records</li>
          <li>Login credentials for both accounts</li>
        </ul>

        <div className="bg-error/5 border border-error/20 rounded-lg p-3 mb-6">
          <p className="text-sm font-medium text-error text-center">
            This action cannot be undone!
          </p>
        </div>

        {/* Action buttons */}
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Student
              </>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}