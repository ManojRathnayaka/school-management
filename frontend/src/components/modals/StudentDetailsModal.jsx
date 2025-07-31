// components/modals/StudentDetailsModal.js
import Button from "../Button";

export default function StudentDetailsModal({ show, student, onClose }) {
  if (!show || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Student Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <p className="text-gray-900">
              {student.first_name} {student.last_name}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admission Number
            </label>
            <p className="text-gray-900">{student.admission_number}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <p className="text-gray-900">
              {student.grade}{student.section}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900">{student.email}</p>
          </div>
          
          {student.date_of_birth && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <p className="text-gray-900">
                {new Date(student.date_of_birth).toLocaleDateString()}
              </p>
            </div>
          )}
          
          {student.address && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <p className="text-gray-900">{student.address}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}