import { AlertTriangle } from "lucide-react";

export default function DeleteConfirmationModal({ modalId, onConfirm, loading = false }) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleClose = () => {
    document.getElementById(modalId).close();
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg flex items-center gap-2 text-error">
          <AlertTriangle className="w-5 h-5" />
          Confirm Deletion
        </h3>
        <p className="py-4 text-base-content/70">
          Are you sure you want to delete this achievement? This action cannot be undone.
        </p>
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
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </dialog>
  );
}