import { useNavigate } from "react-router-dom";

export default function DashboardCard({ title, description, icon: Icon, path }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <div className="card bg-base-100 shadow-md border border-base-300 hover:shadow-xl transition-shadow">
      <div className="card-body">
        <div className="flex items-center justify-between mb-2">
          <h3 className="card-title text-base-content">{title}</h3>
          {Icon && (
            <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
          )}
        </div>
        <p className="text-sm text-base-content/70 mb-4 min-h-[40px]">{description}</p>
        <div className="card-actions justify-end mt-auto">
          <button
            onClick={handleClick}
            className="btn btn-primary btn-block"
          >
            Access
          </button>
        </div>
      </div>
    </div>
  );
}