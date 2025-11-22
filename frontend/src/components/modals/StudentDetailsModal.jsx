import { useState, useEffect } from "react";
import { User, IdCard, GraduationCap, Mail, Calendar, MapPin, Phone, Users, RotateCcw } from "lucide-react";
import { studentAPI } from "../../services/api";
import StudentPasswordResetModal from "./StudentPasswordResetModal";

export default function StudentDetailsModal({ show, student, onClose }) {
  const [parentInfo, setParentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Password reset modal state
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [resetUserType, setResetUserType] = useState(null); // 'student' or 'parent'
  const [resetUserName, setResetUserName] = useState("");
  const [resetUserEmail, setResetUserEmail] = useState("");

  useEffect(() => {
    if (show && student) {
      // Open the DaisyUI modal
      const modal = document.getElementById(`student_details_modal_${student.student_id}`);
      if (modal) {
        modal.showModal();
      }
      
      // Fetch parent information
      fetchParentInfo();
      setError("");
    }
  }, [show, student]);

  const fetchParentInfo = async () => {
    if (!student?.student_id) return;
    
    setLoading(true);
    try {
      const response = await studentAPI.getStudentParents(student.student_id);
      setParentInfo(response.data.parent);
    } catch (err) {
      console.error('Error fetching parent info:', err);
      setError("Failed to load parent information");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const modal = document.getElementById(`student_details_modal_${student?.student_id}`);
    if (modal) {
      modal.close();
    }
    setParentInfo(null);
    setError("");
    onClose();
  };

  // Handle student password reset
  const handleResetStudentPassword = () => {
    setResetUserType('student');
    setResetUserName(`${student.first_name} ${student.last_name}`);
    setResetUserEmail(student.email);
    setShowPasswordResetModal(true);
  };

  // Handle parent password reset
  const handleResetParentPassword = () => {
    if (!parentInfo) return;
    setResetUserType('parent');
    setResetUserName(`${parentInfo.first_name} ${parentInfo.last_name}`);
    setResetUserEmail(parentInfo.email);
    setShowPasswordResetModal(true);
  };

  // Confirm password reset
  const handlePasswordResetConfirm = async () => {
    try {
      let response;
      if (resetUserType === 'student') {
        response = await studentAPI.resetStudentPassword(student.student_id);
      } else {
        response = await studentAPI.resetParentPassword(student.student_id);
      }
      return response.data; // Returns { tempPassword, ...otherData }
    } catch (err) {
      console.error('Failed to reset password:', err);
      throw err;
    }
  };

  if (!student) return null;

  return (
    <>
      <dialog id={`student_details_modal_${student.student_id}`} className="modal">
        <div className="modal-box max-w-4xl">
          {/* Close button */}
          <form method="dialog">
            <button 
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleClose}
            >
              ✕
            </button>
          </form>

          {/* Modal header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-12">
                <span className="text-lg font-bold">
                  {student.first_name?.[0]}{student.last_name?.[0]}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl text-base-content">Student Details</h3>
              <p className="text-base-content/70">{student.first_name} {student.last_name}</p>
            </div>
          </div>

          {/* Error alert */}
          {error && (
            <div className="alert alert-warning mb-4">
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Information Card */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="card-title text-base-content flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Student Information
                  </h4>
                  <button
                    className="btn btn-sm btn-accent gap-2"
                    onClick={handleResetStudentPassword}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Password
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-1">
                        First Name
                      </label>
                      <p className="text-base-content font-medium">{student.first_name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-1">
                        Last Name
                      </label>
                      <p className="text-base-content font-medium">{student.last_name}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-1 flex items-center gap-1">
                      <IdCard className="w-4 h-4" />
                      Admission Number
                    </label>
                    <div className="badge badge-primary badge-lg font-mono">
                      {student.admission_number}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-1 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="text-base-content">{student.email}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-1 flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        Grade
                      </label>
                      <div className="badge badge-secondary badge-lg">
                        Grade {student.grade}{student.section}
                      </div>
                    </div>
                    
                    {student.date_of_birth && (
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-1 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Date of Birth
                        </label>
                        <p className="text-base-content">
                          {new Date(student.date_of_birth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {student.address && (
                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Address
                      </label>
                      <p className="text-base-content">{student.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Parent Information Card */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="card-title text-base-content flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Parent Information
                  </h4>
                  {parentInfo && (
                    <button
                      className="btn btn-sm btn-accent gap-2"
                      onClick={handleResetParentPassword}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset Password
                    </button>
                  )}
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                    <span className="ml-3 text-base-content/70">Loading parent information...</span>
                  </div>
                ) : parentInfo ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-1">
                          First Name
                        </label>
                        <p className="text-base-content font-medium">{parentInfo.first_name}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-1">
                          Last Name
                        </label>
                        <p className="text-base-content font-medium">{parentInfo.last_name}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-1 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <p className="text-base-content">{parentInfo.email}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-1 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        Contact Number
                      </label>
                      <p className="text-base-content font-medium">{parentInfo.contact_number}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
                    <p className="text-base-content/70">No parent information available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      {/* Password Reset Modal */}
      <StudentPasswordResetModal
        isOpen={showPasswordResetModal}
        userType={resetUserType}
        userName={resetUserName}
        userEmail={resetUserEmail}
        onClose={() => {
          setShowPasswordResetModal(false);
          setResetUserType(null);
          setResetUserName("");
          setResetUserEmail("");
        }}
        onConfirm={handlePasswordResetConfirm}
      />
    </>
  );
}