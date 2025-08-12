import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";
import Alert from "./Alert";
import Button from "./Button";
import Input from "./Input";
import PasswordModal from "./modals/PasswordModal";
import DeleteUserModal from "./modals/DeleteUserModal";

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    roles: [],
    page: 1
  });
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState("");

  // Debounce search and role filters
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedRoles = useDebounce(filters.roles, 500);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page,
        limit: 10,
      });
      
      if (debouncedRoles.length > 0) {
        params.append('roles', debouncedRoles.join(','));
      }
      
      if (debouncedSearch.trim()) {
        params.append('search', debouncedSearch);
      }

      const response = await userAPI.getUsers(params.toString());
      setUsers(response.data.users);
      setPagination(response.data.pagination);
      setError("");
    } catch (err) {
      setError("Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, debouncedRoles, filters.page]);

  const handleRoleFilter = (role) => {
    const newRoles = filters.roles.includes(role)
      ? filters.roles.filter(r => r !== role)
      : [...filters.roles, role];
    setFilters({ ...filters, roles: newRoles, page: 1 });
  };

  const startEdit = (userItem) => {
    setEditingUser(userItem.user_id);
    setEditForm({
      first_name: userItem.first_name,
      last_name: userItem.last_name,
      email: userItem.email
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const saveUser = async (userId) => {
    try {
      await userAPI.updateUser(userId, editForm);
      setSuccess("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const resetPassword = async (userId) => {
    try {
      const response = await userAPI.resetUserPassword(userId);
      setGeneratedPassword(response.data.tempPassword);
      setShowPasswordModal(true);
      setSuccess("Password reset successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  const handleDeleteClick = (userItem) => {
    setUserToDelete(userItem);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setSuccess("User deleted successfully");
    setShowDeleteModal(false);
    setUserToDelete(null);
    fetchUsers();
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const allRoles = ["admin", "principal", "teacher"];

  return (
    <div>
      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div>
          <Input
            placeholder="Search by name..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Role:
          </label>
          <div className="flex flex-wrap gap-4">
            {allRoles.map((role) => (
              <label key={role} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.roles.includes(role)}
                  onChange={() => handleRoleFilter(role)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700 capitalize">{role}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-72">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((userItem) => (
                <tr key={userItem.user_id} className="border-t">
                  <td className="px-4 py-2">
                    {editingUser === userItem.user_id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                          className="text-sm px-2 py-1 w-24"
                        />
                        <Input
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                          className="text-sm px-2 py-1 w-24"
                        />
                      </div>
                    ) : (
                      `${userItem.first_name} ${userItem.last_name}`
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingUser === userItem.user_id ? (
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="text-sm px-2 py-1"
                      />
                    ) : (
                      userItem.email
                    )}
                  </td>
                  <td className="px-4 py-2 capitalize">{userItem.role}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 flex-nowrap">
                      {editingUser === userItem.user_id ? (
                        <>
                          <Button 
                            className="px-3 py-1.5 text-sm"
                            onClick={() => saveUser(userItem.user_id)}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="secondary" 
                            className="px-3 py-1.5 text-sm"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            className="px-3 py-1.5 text-sm"
                            onClick={() => startEdit(userItem)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="secondary" 
                            className="px-3 py-1.5 text-sm whitespace-nowrap"
                            onClick={() => resetPassword(userItem.user_id)}
                          >
                            Reset Password
                          </Button>
                          {userItem.user_id !== user.user_id && (
                            <Button 
                              variant="danger" 
                              className="px-3 py-1.5 text-sm"
                              onClick={() => handleDeleteClick(userItem)}
                            >
                              Delete
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <Button
            variant="secondary"
            className="px-4 py-2 text-sm"
            disabled={pagination.currentPage === 1}
            onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            className="px-4 py-2 text-sm"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
          >
            Next
          </Button>
        </div>
      )}

      <PasswordModal 
        isOpen={showPasswordModal}
        password={generatedPassword}
        onClose={() => {
          setShowPasswordModal(false);
          setGeneratedPassword("");
        }}
      />

      <DeleteUserModal
        show={showDeleteModal}
        user={userToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}