// React imports
import { useState, useEffect } from "react";
import {
  Users,
  Search,
  GraduationCap,
  Mail,
  Eye,
  Edit,
  Trash2,
  IdCard,
  Settings,
} from "lucide-react";

// Component imports
import Layout from "../components/Layout";

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
    limit: 10,
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

  // Grade options using your constants
  const gradeOptions = [{ value: "", label: "All Grades" }, ...GRADES];

  const sectionOptions = [{ value: "", label: "All Sections" }, ...SECTIONS];

  return (
    <Layout activePage="students">
      <div className="p-6">
        {/* Main Container */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Header */}
            <div className="mb-6">
              <h1 className="card-title text-3xl text-base-content">
                <Users className="w-8 h-8 text-primary mr-2" />
                Students
              </h1>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Search Students
                  </span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="text"
                    placeholder="Search by student name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered input-sm w-full pl-10"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">Grade</span>
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="select select-bordered select-sm w-full"
                >
                  {gradeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/70">
                    Section
                  </span>
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="select select-bordered select-sm w-full"
                >
                  {sectionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <span className="ml-4 text-base-content/70">
                  Loading students...
                </span>
              </div>
            ) : (
              <>
                {/* Students Table */}
                {students.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr className="bg-base-200">
                          <th className="text-base-content font-semibold w-1/4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Student
                            </div>
                          </th>
                          <th className="text-base-content font-semibold w-1/6">
                            <div className="flex items-center gap-2">
                              <IdCard className="w-4 h-4" />
                              Admission No.
                            </div>
                          </th>
                          <th className="text-base-content font-semibold w-1/8">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4" />
                              Grade
                            </div>
                          </th>
                          <th className="text-base-content font-semibold w-1/4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email
                            </div>
                          </th>
                          <th className="text-base-content font-semibold w-1/12">
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              Actions
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr
                            key={student.student_id}
                            className="hover:bg-base-200/50 transition-colors"
                          >
                            <td>
                              <div className="flex items-center space-x-3">
                                <div className="avatar placeholder">
                                  <div className="bg-primary text-primary-content rounded-full w-10">
                                    <span className="text-sm font-medium">
                                      {student.first_name?.[0]}
                                      {student.last_name?.[0]}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-semibold text-base-content">
                                    {student.first_name} {student.last_name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="inline-block font-mono text-sm bg-base-200 px-2 py-1 rounded-md">
                                {student.admission_number}
                              </div>
                            </td>
                            <td>
                              <div className="badge badge-outline badge-primary">
                                {student.grade}
                                {student.section}
                              </div>
                            </td>
                            <td>
                              <span className="text-sm text-base-content/70">
                                {student.email}
                              </span>
                            </td>
                            <td>
                              <div className="flex justify-end space-x-1">
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleViewStudent(student)}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => handleEditStudent(student)}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  className="btn btn-sm btn-error"
                                  onClick={() => handleDeleteStudent(student)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="hero bg-base-200 rounded-lg">
                    <div className="hero-content text-center py-16">
                      <div className="max-w-md">
                        <Search className="w-24 h-24 text-base-content/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-base-content mb-2">
                          {debouncedSearchTerm ||
                          selectedGrade ||
                          selectedSection
                            ? "No students found"
                            : "No students yet"}
                        </h3>
                        <p className="text-base-content/70">
                          {debouncedSearchTerm ||
                          selectedGrade ||
                          selectedSection
                            ? "Try adjusting your search criteria or filters."
                            : "Students will appear here once they are added to the system."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="join">
                      <button
                        className="join-item btn"
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={!pagination.hasPrev}
                      >
                        Previous
                      </button>
                      <button className="join-item btn btn-primary">
                        {pagination.currentPage}
                      </button>
                      <button
                        className="join-item btn"
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={!pagination.hasNext}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
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
      </div>
    </Layout>
  );
}
