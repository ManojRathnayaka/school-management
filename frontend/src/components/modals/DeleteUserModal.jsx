import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
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

  const handleClose = () => {
    setError("");
    onClose();
  };

  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Delete User Account</h3>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-gray-600 mb-4 text-center">
          Are you sure you want to permanently delete:
        </p>

        <div className="bg-gray-50 p-3 rounded border mb-4 text-center">
          <p className="font-semibold">{user.first_name} {user.last_name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <div className="badge badge-outline mt-1">{user.role}</div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
          <div className="flex items-start">
            <Trash2 className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone. All user data and associated records will be permanently removed.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Deleting...
              </>
            ) : (
              "Delete User"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}