// React imports
import { useState, useEffect } from "react";

// Component imports
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";

// Modal imports
import StudentDetailsModal from "../components/modals/StudentDetailsModal";
import EditStudentModal from "../components/modals/EditStudentModal";
import DeleteStudentModal from "../components/modals/DeleteStudentModal";

// Service imports
import { studentAPI } from "../services/api";

// Hook imports
import { useDebounce } from "../hooks/useDebounce";

// Constants
import { GRADES, SECTIONS } from "../constants";

export default function Students() {
  // State management
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 15,
    hasNext: false,
    hasPrev: false,
  });

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch students function
  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await studentAPI.getStudents({
        page,
        limit: pagination.limit,
        search: debouncedSearchTerm,
        grade: selectedGrade,
        section: selectedSection,
      });

      setStudents(response.data.students);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchStudents(1); // Reset to page 1 when search/filters change
  }, [debouncedSearchTerm, selectedGrade, selectedSection]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchStudents(newPage);
  };

  // Handle view student details
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  // Handle edit student
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  // Handle delete student
  const handleDeleteStudent = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      // TODO: Implement actual delete API call
      // await studentAPI.deleteStudent(selectedStudent.student_id);
      alert(
        `Delete functionality for ${selectedStudent.first_name} ${selectedStudent.last_name} will be implemented soon.`
      );
      setShowDeleteModal(false);
      setSelectedStudent(null);
      // fetchStudents(pagination.currentPage); // Refresh list after delete
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete student");
    }
  };

  // Grade options using your constants
  const gradeOptions = [{ value: "", label: "All Grades" }, ...GRADES];

  const sectionOptions = [{ value: "", label: "All Sections" }, ...SECTIONS];

  return (
    <Layout activePage="students">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Students</h2>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              type="text"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              options={gradeOptions}
              className="w-full"
            />
            <Select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              options={sectionOptions}
              className="w-full"
            />
          </div>

          {/* Results Info */}
          {!loading && (
            <div className="text-sm text-gray-600 mb-4">
              Showing {students.length} of {pagination.totalRecords} students
              {(debouncedSearchTerm || selectedGrade || selectedSection) && (
                <span className="ml-2">
                  (filtered
                  {debouncedSearchTerm && ` by "${debouncedSearchTerm}"`}
                  {selectedGrade && ` - Grade ${selectedGrade}`}
                  {selectedSection && ` - Section ${selectedSection}`})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Students Table */}
            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                        Admission No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.student_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.admission_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.grade}
                          {student.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="primary"
                              size="small"
                              onClick={() => handleViewStudent(student)}
                            >
                              View
                            </Button>
                            <Button
                              variant="secondary"
                              size="small"
                              onClick={() => handleEditStudent(student)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleDeleteStudent(student)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {debouncedSearchTerm || selectedGrade || selectedSection
                  ? "No students found matching your criteria."
                  : "No students found."}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const startPage = Math.max(1, pagination.currentPage - 2);
                      const pageNumber = startPage + i;

                      if (pageNumber > pagination.totalPages) return null;

                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            pageNumber === pagination.currentPage
                              ? "primary"
                              : "secondary"
                          }
                          size="small"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    }
                  )}

                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Student Details Modal */}
      <StudentDetailsModal
        show={showDetailsModal}
        student={selectedStudent}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedStudent(null);
        }}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        show={showEditModal}
        student={selectedStudent}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
        onSave={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
          fetchStudents(pagination.currentPage); // Refresh list
        }}
      />

      {/* Delete Student Modal */}
      <DeleteStudentModal
        show={showDeleteModal}
        student={selectedStudent}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedStudent(null);
        }}
        onConfirm={() => {
          setShowDeleteModal(false);
          setSelectedStudent(null);
          fetchStudents(pagination.currentPage); // Refresh list
        }}
      />
    </Layout>
  );
}
