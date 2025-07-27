import { COLOR_CLASSES } from "../constants";

export default function StatsCard({ title, value, color = "blue" }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold ${COLOR_CLASSES[color] || COLOR_CLASSES.blue}`}>{value}</p>
    </div>
  );
} 