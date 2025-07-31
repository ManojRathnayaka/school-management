// components/modals/DeleteStudentModal.js
import { useState } from "react";
import Button from "../Button";
import { studentAPI } from "../../services/api";

export default function DeleteStudentModal({ show, student, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      // TODO: Implement actual delete API call
      // await studentAPI.deleteStudent(student.student_id);
      
      // For now, just show success message
      alert(`Delete functionality for ${student.first_name} ${student.last_name} will be implemented soon.`);
      onConfirm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  if (!show || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {student.first_name} {student.last_name}
          </span>{" "}
          (Grade {student.grade}{student.section})? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Student"}
          </Button>
        </div>
      </div>
    </div>
  );
}