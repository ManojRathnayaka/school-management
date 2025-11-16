import { useState, useEffect } from "react";
import { Copy, Check, UserPlus } from "lucide-react";

export default function UserCreatedModal({ isOpen, tempPassword, onClose }) {
  const [copied, setCopied] = useState(false);

  // Reset copied state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        
        {/* Success Icon */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-success" />
          </div>
          <h3 className="font-bold text-xl text-success">User Created Successfully!</h3>
        </div>

        {/* Password Display */}
        <div className="bg-base-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-base-content/70 mb-2">Temporary Password:</p>
          <div className="bg-base-100 rounded border-2 border-dashed border-primary/30 p-3">
            <p className="font-mono text-lg font-bold text-center text-primary break-all">
              {tempPassword}
            </p>
          </div>
        </div>

        {/* Copy Button */}
        <div className="text-center mb-4">
          <button 
            onClick={copyPassword}
            className={`btn ${copied ? 'btn-success' : 'btn-primary'} btn-sm`}
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

        {/* Instructions */}
        <div className="alert alert-info">
          <div className="text-sm">
            <p className="font-medium">Important:</p>
            <p>Please share this temporary password with the user for their first login. They will be required to change it on their first sign-in.</p>
          </div>
        </div>

        {/* Close Button */}
        <div className="modal-action">
          <button className="btn btn-primary" onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}