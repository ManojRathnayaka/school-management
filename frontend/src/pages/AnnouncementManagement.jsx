import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { announcementAPI } from "../services/api";
import { Megaphone, Plus, Edit2, Trash2, Save, X } from "lucide-react";

export default function AnnouncementManagement() {
  const { user, loading } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await announcementAPI.getAll();
      setAnnouncements(response.data.announcements);
    } catch (err) {
      setError("Failed to fetch announcements");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({ title: "", content: "" });
    setEditingId(null);
    setShowForm(false);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.title.length > 200) {
      setError("Title must be 200 characters or less");
      return;
    }

    if (formData.content.length > 2000) {
      setError("Content must be 2000 characters or less");
      return;
    }

    try {
      if (editingId) {
        await announcementAPI.update(editingId, formData);
        setSuccess("Announcement updated successfully!");
      } else {
        await announcementAPI.create(formData);
        setSuccess("Announcement created successfully!");
      }
      
      await fetchAnnouncements();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content
    });
    setEditingId(announcement.announcement_id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const confirmDelete = async () => {
    try {
      await announcementAPI.delete(deleteId);
      setSuccess("Announcement deleted successfully!");
      await fetchAnnouncements();
    } catch (err) {
      setError("Failed to delete announcement");
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading || !user) return null;

  return (
    <Layout activePage="announcements">
      <div className="bg-base-100">
        <div className="card-body">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="card-title text-3xl text-base-content">
                <Megaphone className="w-8 h-8 text-primary mr-2" />
                Announcement Management
              </h1>
              <p className="text-base-content/70 mt-1">
                Create and manage school announcements
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </button>
            )}
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4">
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="card bg-base-200 shadow-sm mb-6">
              <div className="card-body">
                <h2 className="card-title text-xl">
                  {editingId ? "Edit Announcement" : "Create New Announcement"}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">
                        Title (max 200 characters)
                      </span>
                      <span className="label-text-alt text-base-content/50">
                        {formData.title.length}/200
                      </span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter announcement title"
                      value={formData.title}
                      onChange={handleInputChange}
                      maxLength={200}
                      required
                      className="input input-bordered input-sm w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content/70">
                        Content (max 2000 characters)
                      </span>
                      <span className="label-text-alt text-base-content/50">
                        {formData.content.length}/2000
                      </span>
                    </label>
                    <textarea
                      name="content"
                      placeholder="Enter announcement content"
                      value={formData.content}
                      onChange={handleInputChange}
                      maxLength={2000}
                      required
                      rows="6"
                      className="textarea textarea-bordered w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn btn-ghost"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Announcements List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-base-content">
              All Announcements ({announcements.length})
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 text-base-content/50">
                No announcements yet. Create your first one!
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement.announcement_id}
                  className="card bg-base-200 shadow-sm"
                >
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="card-title text-lg text-base-content">
                          {announcement.title}
                        </h3>
                        <p className="text-base-content/70 mt-2 whitespace-pre-wrap">
                          {announcement.content}
                        </p>
                        <div className="text-sm text-base-content/50 mt-3">
                          <span>
                            Posted by {announcement.first_name}{" "}
                            {announcement.last_name}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(announcement.created_at)}</span>
                          {announcement.updated_at !== announcement.created_at && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="italic">
                                Updated {formatDate(announcement.updated_at)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="btn btn-sm btn-ghost"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(announcement.announcement_id)}
                          className="btn btn-sm btn-ghost text-error"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${deleteId ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Announcement</h3>
          <p className="py-4">Are you sure you want to delete this announcement?</p>
          <div className="modal-action">
            <button onClick={() => setDeleteId(null)} className="btn">Cancel</button>
            <button onClick={confirmDelete} className="btn btn-error">Delete</button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}></div>
      </dialog>
    </Layout>
  );
}