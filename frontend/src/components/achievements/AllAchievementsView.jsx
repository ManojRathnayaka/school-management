import { useState, useEffect } from "react";
import { achievementAPI } from "../../services/api";
import { GraduationCap, Trophy, Palette, Star, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AchievementModal from "./AchievementModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const API_BASE_URL = 'http://localhost:4000';

const CATEGORIES = [
  { 
    value: "academic", 
    label: "Academic Excellence", 
    icon: GraduationCap, 
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  { 
    value: "sports", 
    label: "Sports Champions", 
    icon: Trophy, 
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  { 
    value: "arts_cultural", 
    label: "Arts & Cultural", 
    icon: Palette, 
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  { 
    value: "extracurricular", 
    label: "Extracurricular", 
    icon: Star, 
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
];

export default function AllAchievementsView() {
  const { user } = useAuth();
  const [achievementsByCategory, setAchievementsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievementToDelete, setAchievementToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const canManage = user?.role === "principal" || user?.role === "teacher";

  useEffect(() => {
    fetchAllAchievements();
  }, []);

  const fetchAllAchievements = async () => {
    try {
      setLoading(true);
      const results = await Promise.all(
        CATEGORIES.map(cat => achievementAPI.getByCategory(cat.value, 8))
      );
      
      const achievementsMap = {};
      CATEGORIES.forEach((cat, index) => {
        achievementsMap[cat.value] = results[index].data.achievements;
      });
      
      setAchievementsByCategory(achievementsMap);
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
      fetchAllAchievements();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const achievements = achievementsByCategory[category.value] || [];

        return (
          <div key={category.value}>
            <div className={`flex items-center gap-2 mb-4 pb-2 border-b-2 ${category.borderColor}`}>
              <Icon className={`w-6 h-6 ${category.color}`} />
              <h3 className={`text-2xl font-bold ${category.color}`}>
                {category.label}
              </h3>
              <span className="badge badge-ghost ml-2">{achievements.length}</span>
            </div>

            {achievements.length === 0 ? (
              <div className={`text-center py-8 rounded-lg ${category.bgColor} border ${category.borderColor}`}>
                <Icon className={`w-12 h-12 mx-auto ${category.color} opacity-50 mb-2`} />
                <p className="text-base-content/50">No {category.label.toLowerCase()} yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.achievement_id} 
                    className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow border ${category.borderColor}`}
                  >
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
                        <h4 className="font-bold text-sm line-clamp-1">{achievement.student_name}</h4>
                        <div className={`badge badge-sm ${category.color.replace('text-', 'badge-')}`}>
                          {achievement.grade}
                        </div>
                      </div>
                      <p className={`font-semibold text-sm ${category.color} line-clamp-2`}>
                        {achievement.title}
                      </p>
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
            )}
          </div>
        );
      })}

      {/* Modals */}
      <AchievementModal 
        modalId="edit_achievement_modal"
        achievement={selectedAchievement}
        onSuccess={() => {
          setSelectedAchievement(null);
          fetchAllAchievements();
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