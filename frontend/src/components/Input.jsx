export default function Input({ className = "", ...props }) {
  const combinedClasses = `p-2 border rounded w-full ${className}`;

  return <input className={combinedClasses} {...props} />;
} 