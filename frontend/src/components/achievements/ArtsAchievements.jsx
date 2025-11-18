import { useState, useEffect } from "react";
import { achievementAPI } from "../../services/api";
import { useDebounce } from "../../hooks/useDebounce";
import { GRADES } from "../../constants";
import { Search, Trash2, Edit, Palette } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AchievementModal from "./AchievementModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const API_BASE_URL = 'http://localhost:4000';

export default function ArtsAchievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievementToDelete, setAchievementToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const canManage = user?.role === "principal" || user?.role === "teacher";

  useEffect(() => {
    fetchAchievements();
  }, [debouncedSearch, grade, page]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementAPI.getAll({
        search: debouncedSearch,
        grade,
        category: "arts_cultural",
        page,
        limit: 12,
      });
      setAchievements(response.data.achievements);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching achievements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (achievement) => {
    setSelectedAchievement(achievement);
    document.getElementById('edit_achievement_modal').showModal();
  };

  const handleDeleteClick = (achievement) => {
    setAchievementToDelete(achievement);
    document.getElementById('delete_confirmation_modal').showModal();
  };

  const handleDeleteConfirm = async () => {
    if (!achievementToDelete) return;
    
    try {
      setDeleteLoading(true);
      await achievementAPI.delete(achievementToDelete.achievement_id);
      document.getElementById('delete_confirmation_modal').close();
      setAchievementToDelete(null);
      fetchAchievements();
    } catch (err) {
      console.error("Error deleting achievement:", err);
      alert("Failed to delete achievement");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="label">
            <span className="label-text text-base-content/70">Search</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Search by name or title..."
              className="input input-bordered input-sm w-full pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full">
          <label className="label">
            <span className="label-text text-base-content/70">Filter by Grade</span>
          </label>
          <select
            className="select select-bordered select-sm w-full"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="">All Grades</option>
            {GRADES.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.achievement_id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                {achievement.image_path && (
                  <figure className="h-32">
                    <img
                      src={getImageUrl(achievement.image_path)}
                      alt={achievement.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </figure>
                )}
                <div className="card-body p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="card-title text-base">{achievement.student_name}</h3>
                    <div className="badge badge-secondary badge-sm">
                      <Palette className="w-3 h-3 mr-1" />
                      {achievement.grade}
                    </div>
                  </div>
                  <p className="font-semibold text-sm text-purple-600">{achievement.title}</p>
                  {achievement.details && (
                    <p className="text-xs text-base-content/60 line-clamp-2">{achievement.details}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-base-content/50">
                      {new Date(achievement.achievement_date).toLocaleDateString()}
                    </p>
                    {canManage && (
                      <div className="flex gap-1">
                        <button
                          className="btn btn-xs btn-ghost text-primary"
                          onClick={() => handleEdit(achievement)}
                          title="Edit"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          className="btn btn-xs btn-ghost text-error"
                          onClick={() => handleDeleteClick(achievement)}
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {achievements.length === 0 && (
            <div className="text-center py-12">
              <Palette className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
              <p className="text-base-content/50 text-lg">No arts & cultural achievements found.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  «
                </button>
                <button className="join-item btn btn-sm">
                  Page {page} of {totalPages}
                </button>
                <button
                  className="join-item btn btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <AchievementModal 
        modalId="edit_achievement_modal"
        achievement={selectedAchievement}
        onSuccess={() => {
          setSelectedAchievement(null);
          fetchAchievements();
        }}
      />
      
      <DeleteConfirmationModal
        modalId="delete_confirmation_modal"
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}