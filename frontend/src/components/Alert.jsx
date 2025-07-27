const alertTypeClasses = {
  error: "bg-red-100 border-red-400 text-red-700",
  success: "bg-green-100 border-green-400 text-green-700",
  info: "bg-blue-100 border-blue-400 text-blue-700",
};

export default function Alert({ type = "info", message }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`mb-4 p-3 border rounded ${alertTypeClasses[type]}`}>
      {message}
    </div>
  );
} 