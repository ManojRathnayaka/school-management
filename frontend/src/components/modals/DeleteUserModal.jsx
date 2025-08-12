// components/modals/DeleteUserModal.js
import { useState } from "react";
import Button from "../Button";
import { userAPI } from "../../services/api";

export default function DeleteUserModal({ show, user, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await userAPI.deleteUser(user.user_id);
      onConfirm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  if (!show || !user) return null;

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
            {user.first_name} {user.last_name}
          </span>{" "}
          ({user.role})? This action cannot be undone.
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
            {loading ? "Deleting..." : "Delete User"}
          </Button>
        </div>
      </div>
    </div>
  );
}