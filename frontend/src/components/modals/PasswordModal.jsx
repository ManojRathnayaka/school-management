import Button from "../Button";

export default function PasswordModal({ isOpen, password, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Password Reset Successful</h3>
        <p className="text-gray-600 mb-4">
          New temporary password has been generated:
        </p>
        <div className="bg-gray-100 p-3 rounded border mb-4">
          <code className="text-lg font-mono">{password}</code>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Please share this password with the user. They will be required to change it on their next login.
        </p>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}