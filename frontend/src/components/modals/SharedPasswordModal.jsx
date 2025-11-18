import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function SharedPasswordModal({ sharedPassword, modalId = "success_modal" }) {
  const [copied, setCopied] = useState(false);

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(sharedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box max-w-md">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        {/* Success Icon */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h3 className="font-bold text-xl text-success">Registration Successful!</h3>
        </div>

        {/* Password Display */}
        <div className="bg-base-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-base-content/70 mb-2">Shared Password:</p>
          <div className="bg-base-100 rounded border-2 border-dashed border-primary/30 p-3">
            <p className="font-mono text-lg font-bold text-center text-primary break-all">
              {sharedPassword}
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
            <p>Please share this password with the student and parent for their first login.</p>
          </div>
        </div>
      </div>
    </dialog>
  );
}