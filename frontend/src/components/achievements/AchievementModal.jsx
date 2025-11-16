import { useState, useEffect } from "react";
import { achievementAPI } from "../../services/api";
import { GRADES } from "../../constants";
import { Award, User, GraduationCap, Trophy, Calendar, FileText, Image as ImageIcon } from "lucide-react";

const ACHIEVEMENT_CATEGORIES = [
  { value: "academic", label: "Academic", color: "text-blue-600" },
  { value: "sports", label: "Sports", color: "text-green-600" },
  { value: "arts_cultural", label: "Arts & Cultural", color: "text-purple-600" },
  { value: "extracurricular", label: "Extracurricular", color: "text-orange-600" }
];

export default function AchievementModal({ modalId, achievement = null, onSuccess }) {
  const [formData, setFormData] = useState({
    student_name: "",
    grade: "",
    category: "",
    title: "",
    details: "",
    achievement_date: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (achievement) {
      setFormData({
        student_name: achievement.student_name,
        grade: achievement.grade,
        category: achievement.category,
        title: achievement.title,
        details: achievement.details || "",
        achievement_date: achievement.achievement_date?.split('T')[0] || "",
      });
      if (achievement.image_path) {
        const imageUrl = achievement.image_path.startsWith('http') 
          ? achievement.image_path 
          : `http://localhost:4000${achievement.image_path}`;
        setImagePreview(imageUrl);
      }
    } else {
      resetForm();
    }
  }, [achievement]);

  const resetForm = () => {
    setFormData({
      student_name: "",
      grade: "",
      category: "",
      title: "",
      details: "",
      achievement_date: "",
    });
    setImage(null);
    setImagePreview(null);
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });
      if (image) {
        submitData.append("image", image);
      }

      if (achievement) {
        await achievementAPI.update(achievement.achievement_id, submitData);
      } else {
        await achievementAPI.create(submitData);
      }

      document.getElementById(modalId).close();
      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${achievement ? 'update' : 'add'} achievement`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    document.getElementById(modalId).close();
    resetForm();
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box max-w-4xl">
        <form method="dialog">
          <button 
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </button>
        </form>
        
        <h3 className="font-bold text-2xl mb-6 flex items-center gap-2 text-base-content">
          <Award className="w-6 h-6 text-primary" />
          {achievement ? "Edit Achievement" : "Add New Achievement"}
        </h3>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-base-content flex items-center">
              <User className="w-5 h-5 text-primary mr-2" />
              Student Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Student Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="text"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered input-sm w-full pl-10"
                    placeholder="Enter student name"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Grade</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none z-10" />
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    required
                    className="select select-bordered select-sm w-full pl-10"
                  >
                    <option value="">Select Grade</option>
                    {GRADES.map((grade) => (
                      <option key={grade.value} value={grade.value}>
                        {grade.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Details */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b pb-2 text-base-content flex items-center">
              <Trophy className="w-5 h-5 text-primary mr-2" />
              Achievement Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Category</span>
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none z-10" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="select select-bordered select-sm w-full pl-10"
                  >
                    <option value="">Select Category</option>
                    {ACHIEVEMENT_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Achievement Date</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="date"
                    name="achievement_date"
                    value={formData.achievement_date}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered input-sm w-full pl-10"
                  />
                </div>
              </div>

              <div className="md:col-span-2 form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Title</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="input input-bordered input-sm w-full pl-10"
                    placeholder="e.g., First Place in Mathematics Olympiad"
                  />
                </div>
              </div>

              <div className="md:col-span-2 form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Details (Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-base-content/50" />
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    rows={3}
                    className="textarea textarea-bordered pl-10 w-full"
                    placeholder="Additional details about the achievement..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content/70 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Achievement Image (Optional, Max 5MB)
              </span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="file-input file-input-bordered file-input-sm w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {achievement ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  {achievement ? "Update Achievement" : "Add Achievement"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}