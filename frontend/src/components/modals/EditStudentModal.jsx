// components/modals/EditStudentModal.js
import { useState, useEffect } from "react";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import { GRADES, SECTIONS } from "../../constants";
import { studentAPI } from "../../services/api";

export default function EditStudentModal({ show, student, onClose, onSave }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    grade: "",
    section: "",
    admission_number: "",
    date_of_birth: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (student) {
      setFormData({
        first_name: student.first_name || "",
        last_name: student.last_name || "",
        email: student.email || "",
        grade: student.grade || "",
        section: student.section || "",
        admission_number: student.admission_number || "",
        date_of_birth: student.date_of_birth || "",
        address: student.address || ""
      });
    }
    // Clear error when modal opens
    setError("");
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updateData = {
        student: formData
      };

      await studentAPI.updateStudent(student.student_id, updateData);
      
      // Call onSave to refresh the parent component's data
      onSave();
      
      // Close the modal
      onClose();
      
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  if (!show || !student) return null;

  // Prepare grade and section options
  const gradeOptions = [{ value: "", label: "Select Grade" }, ...GRADES];
  const sectionOptions = [{ value: "", label: "Select Section" }, ...SECTIONS];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Edit Student</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
            
            <Input
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
            
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <Input
              name="admission_number"
              placeholder="Admission Number"
              value={formData.admission_number}
              onChange={handleInputChange}
              required
            />

            <Input
              name="date_of_birth"
              type="date"
              placeholder="Date of Birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
            />
            
            <Select
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              options={gradeOptions}
              required
            />
            
            <Select
              name="section"
              value={formData.section}
              onChange={handleInputChange}
              options={sectionOptions}
              required
            />

            {/* Address field spanning two columns */}
            <div className="md:col-span-2">
              <textarea
                name="address"
                placeholder="Address"
                className="w-full p-2 border rounded"
                rows="3"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}