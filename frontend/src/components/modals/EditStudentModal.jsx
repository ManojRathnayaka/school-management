import { useState, useEffect } from "react";
import { User, Mail, Hash, Calendar, Home, Phone, GraduationCap } from "lucide-react";
import { GRADES, SECTIONS } from "../../constants";
import { studentAPI } from "../../services/api";

export default function EditStudentModal({ show, student, onClose, onSave }) {
  const [formData, setFormData] = useState({
    student: {
      first_name: "",
      last_name: "",
      email: "",
      grade: "",
      section: "",
      admission_number: "",
      date_of_birth: "",
      address: ""
    },
    parent: {
      first_name: "",
      last_name: "",
      email: "",
      contact_number: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [loadingParent, setLoadingParent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show && student) {
      const modal = document.getElementById(`edit_student_modal_${student.student_id}`);
      if (modal) modal.showModal();
      
      setFormData(prev => ({
        ...prev,
        student: {
          first_name: student.first_name || "",
          last_name: student.last_name || "",
          email: student.email || "",
          grade: student.grade || "",
          section: student.section || "",
          admission_number: student.admission_number || "",
          date_of_birth: student.date_of_birth || "",
          address: student.address || ""
        }
      }));
      
      fetchParentDetails(student.student_id);
      setError("");
    }
  }, [show, student]);

  const fetchParentDetails = async (studentId) => {
    setLoadingParent(true);
    try {
      const response = await studentAPI.getStudentParents(studentId);
      if (response.data.parent) {
        setFormData(prev => ({
          ...prev,
          parent: {
            first_name: response.data.parent.first_name || "",
            last_name: response.data.parent.last_name || "",
            email: response.data.parent.email || "",
            contact_number: response.data.parent.contact_number || ""
          }
        }));
      }
    } catch (err) {
      console.error('Error fetching parent:', err);
      setError("Failed to load parent details");
    } finally {
      setLoadingParent(false);
    }
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      student: { ...prev.student, [name]: value }
    }));
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      parent: { ...prev.parent, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await studentAPI.updateStudent(student.student_id, formData);
      onSave();
      handleClose();
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const modal = document.getElementById(`edit_student_modal_${student?.student_id}`);
    if (modal) modal.close();
    setError("");
    onClose();
  };

  if (!student) return null;

  const gradeOptions = [{ value: "", label: "Select Grade" }, ...GRADES];
  const sectionOptions = [{ value: "", label: "Select Section" }, ...SECTIONS];

  return (
    <dialog id={`edit_student_modal_${student.student_id}`} className="modal">
      <div className="modal-box max-w-4xl max-h-[90vh]">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>✕</button>
        </form>

        <h3 className="font-bold text-xl mb-6">Edit Student</h3>
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        
        {loadingParent && (
          <div className="flex justify-center items-center py-4">
            <span className="loading loading-spinner loading-md text-primary"></span>
            <span className="ml-2">Loading parent details...</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-base-content flex items-center">
              <GraduationCap className="w-5 h-5 text-primary mr-2" />
              Student Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">First Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    className="input input-bordered input-sm w-full pl-10"
                    value={formData.student.first_name}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Last Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    className="input input-bordered input-sm w-full pl-10"
                    value={formData.student.last_name}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Email</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered input-sm w-full pl-10"
                    value={formData.student.email}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Admission Number</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="text"
                    name="admission_number"
                    placeholder="Admission Number"
                    className="input input-bordered input-sm w-full pl-10"
                    value={formData.student.admission_number}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Date of Birth</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="date"
                    name="date_of_birth"
                    className="input input-bordered input-sm w-full pl-10"
                    value={formData.student.date_of_birth}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Grade</span>
                </label>
                <select
                  name="grade"
                  className="select select-bordered select-sm w-full"
                  value={formData.student.grade}
                  onChange={handleStudentChange}
                  required
                >
                  {gradeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Section</span>
                </label>
                <select
                  name="section"
                  className="select select-bordered select-sm w-full"
                  value={formData.student.section}
                  onChange={handleStudentChange}
                  required
                >
                  {sectionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Address</span>
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 w-4 h-4 text-base-content/50" />
                  <textarea
                    name="address"
                    placeholder="Address"
                    className="textarea textarea-bordered pl-10 w-full"
                    rows="3"
                    value={formData.student.address}
                    onChange={handleStudentChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Parent Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-base-content flex items-center">
              <User className="w-5 h-5 text-primary mr-2" />
              Parent Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">First Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    className="input input-bordered input-sm w-full pl-10"
                    value={formData.parent.first_name}
                    onChange={handleParentChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Last Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    className="input input-bordered input-sm w-full pl-10"
                    value={formData.parent.last_name}
                    onChange={handleParentChange}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Email</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered input-sm w-full pl-10"
                    value={formData.parent.email}
                    onChange={handleParentChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text text-base-content/70">Contact Number</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="tel"
                    name="contact_number"
                    placeholder="Contact Number"
                    className="input input-bordered input-sm w-full pl-10"
                    value={formData.parent.contact_number}
                    onChange={handleParentChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || loadingParent}>
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}