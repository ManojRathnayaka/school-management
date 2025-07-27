export default function Select({ options, className = "", ...props }) {
  const combinedClasses = `p-2 border rounded w-full ${className}`;

  return (
    <select className={combinedClasses} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
} 