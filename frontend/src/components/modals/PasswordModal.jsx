import { useState } from "react";
import { Copy, Check, AlertTriangle } from "lucide-react";
import Button from "../Button";

export default function PasswordModal({ isOpen, user, password, onClose, onConfirm }) {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

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
    await onConfirm();
    setShowPassword(true);
  };

  const handleClose = () => {
    setShowPassword(false);
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        {!showPassword ? (
          // Confirmation Step
          <>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Confirm Password Reset</h3>
            </div>
            
            <p className="text-gray-600 mb-4 text-center">
              Are you sure you want to reset the password for:
            </p>
            
            <div className="bg-gray-50 p-3 rounded border mb-4 text-center">
              <p className="font-semibold">{user?.first_name} {user?.last_name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            
            <p className="text-sm text-gray-500 mb-6 text-center">
              This will generate a new temporary password that the user must change on their next login.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleConfirm}
              >
                Reset Password
              </Button>
            </div>
          </>
        ) : (
          // Password Display Step
          <>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">Password Reset Successful!</h3>
            </div>

            <p className="text-gray-600 mb-4 text-center">
              New temporary password for <strong>{user?.first_name} {user?.last_name}</strong>:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="bg-white rounded border-2 border-dashed border-blue-300 p-3">
                <code className="text-lg font-mono font-bold text-center text-blue-600 break-all block">
                  {password}
                </code>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <button
                onClick={copyPassword}
                className={`inline-flex items-center px-4 py-2 rounded text-sm font-medium ${
                  copied 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
                }`}
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
            
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> Please share this password with the user. 
                They will be required to change it on their next login.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleClose}>Close</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}