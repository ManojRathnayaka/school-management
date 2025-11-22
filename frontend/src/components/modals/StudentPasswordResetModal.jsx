import { useState, useEffect } from "react";
import { Copy, Check, AlertTriangle, User, Users } from "lucide-react";

export default function StudentPasswordResetModal({ 
  isOpen, 
  userType, // 'student' or 'parent'
  userName, 
  userEmail,
  onClose, 
  onConfirm 
}) {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const modal = document.getElementById('password_reset_modal');
      if (modal) {
        modal.showModal();
      }
    }
  }, [isOpen]);

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await onConfirm();
      setPassword(result.tempPassword);
      setShowPassword(true);
    } catch (err) {
      console.error('Failed to reset password:', err);
      // Optionally show error message to user
      alert('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const modal = document.getElementById('password_reset_modal');
    if (modal) {
      modal.close();
    }
    setShowPassword(false);
    setCopied(false);
    setPassword("");
    onClose();
  };

  const Icon = userType === 'student' ? User : Users;
  const typeLabel = userType === 'student' ? 'Student' : 'Parent';

  if (!isOpen) return null;

  return (
    <dialog id="password_reset_modal" className="modal">
      <div className="modal-box max-w-md">
        {/* Close button */}
        <form method="dialog">
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleClose}
            type="button"
          >
            ✕
          </button>
        </form>

        {!showPassword ? (
          // Confirmation Step
          <>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Confirm Password Reset</h3>
            </div>
            
            <p className="text-base-content/70 mb-4 text-center">
              Are you sure you want to reset the password for:
            </p>
            
            <div className="bg-base-200 p-3 rounded border mb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-primary" />
                <span className="badge badge-primary badge-sm">{typeLabel}</span>
              </div>
              <p className="font-semibold text-base-content">{userName}</p>
              <p className="text-sm text-base-content/70">{userEmail}</p>
            </div>
            
            <p className="text-sm text-base-content/60 mb-6 text-center">
              This will generate a new temporary password that must be changed on the next login.
            </p>
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={handleClose}
                disabled={loading}
                type="button"
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleConfirm}
                disabled={loading}
                type="button"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </>
        ) : (
          // Password Display Step
          <>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-success mb-2">Password Reset Successful!</h3>
            </div>

            <p className="text-base-content/70 mb-4 text-center">
              New temporary password for <strong>{userName}</strong>:
            </p>
            
            <div className="bg-base-200 rounded-lg p-4 mb-4">
              <div className="bg-base-100 rounded border-2 border-dashed border-primary/30 p-3">
                <code className="text-lg font-mono font-bold text-center text-primary break-all block">
                  {password}
                </code>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <button
                onClick={copyPassword}
                className={`btn btn-sm ${copied ? 'btn-success' : 'btn-primary'}`}
                type="button"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Password
                  </>
                )}
              </button>
            </div>
            
            <div className="alert alert-info">
              <div className="text-sm">
                <p className="font-medium">Important:</p>
                <p>Please share this password with the {typeLabel.toLowerCase()}. They will be required to change it on their next login.</p>
              </div>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn btn-primary" 
                onClick={handleClose}
                type="button"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Backdrop - clicking outside closes the modal */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}