import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";
import { Edit, RotateCcwKey, Trash2, Check, X, Search } from "lucide-react";
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
    page: 1,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToReset, setUserToReset] = useState(null);
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
        params.append("roles", debouncedRoles.join(","));
      }

      if (debouncedSearch.trim()) {
        params.append("search", debouncedSearch);
      }

      const response = await userAPI.getUsers(params.toString());
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, debouncedRoles, filters.page]);

  const handleRoleFilter = (role) => {
    const newRoles = filters.roles.includes(role)
      ? filters.roles.filter((r) => r !== role)
      : [...filters.roles, role];
    setFilters({ ...filters, roles: newRoles, page: 1 });
  };

  const startEdit = (userItem) => {
    setEditingUser(userItem.user_id);
    setEditForm({
      first_name: userItem.first_name,
      last_name: userItem.last_name,
      email: userItem.email,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const saveUser = async (userId) => {
    try {
      await userAPI.updateUser(userId, editForm);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleResetPasswordClick = (userItem) => {
    setUserToReset(userItem);
    setShowPasswordModal(true);
  };

  const handleResetPasswordConfirm = async () => {
    try {
      const response = await userAPI.resetUserPassword(userToReset.user_id);
      setGeneratedPassword(response.data.tempPassword);
      return Promise.resolve();
    } catch (err) {
      console.error("Failed to reset password:", err);
      return Promise.reject(err);
    }
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setUserToReset(null);
    setGeneratedPassword("");
  };

  const handleDeleteClick = (userItem) => {
    setUserToDelete(userItem);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
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
    <div className="p-4">
      {/* Filters - Search and Role filters side by side */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Search Users</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              className="input input-bordered input-sm w-full pl-8 text-sm"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
            />
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 opacity-50" />
          </div>
        </div>

        {/* Role Filters */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Filter by Role</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {allRoles.map((role) => (
              <div key={role} className="form-control">
                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.roles.includes(role)}
                    onChange={() => handleRoleFilter(role)}
                    className="checkbox checkbox-primary mr-2"
                  />
                  <span className="label-text capitalize">{role}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-8">
                  <span className="loading loading-spinner loading-md"></span>
                  <div className="ml-2">Loading...</div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-8 text-base-content/60"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((userItem) => (
                <tr key={userItem.user_id}>
                  <td>
                    {editingUser === userItem.user_id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input input-bordered input-sm flex-1"
                          value={editForm.first_name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              first_name: e.target.value,
                            })
                          }
                          placeholder="First"
                        />
                        <input
                          type="text"
                          className="input input-bordered input-sm flex-1"
                          value={editForm.last_name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              last_name: e.target.value,
                            })
                          }
                          placeholder="Last"
                        />
                      </div>
                    ) : (
                      <div>
                        {`${userItem.first_name} ${userItem.last_name}`}
                      </div>
                    )}
                  </td>
                  <td>
                    {editingUser === userItem.user_id ? (
                      <input
                        type="email"
                        className="input input-bordered input-sm w-full"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                    ) : (
                      <div>{userItem.email}</div>
                    )}
                  </td>
                  <td>
                    <div className="badge badge-outline capitalize">
                      {userItem.role}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {editingUser === userItem.user_id ? (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => saveUser(userItem.user_id)}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={cancelEdit}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => startEdit(userItem)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleResetPasswordClick(userItem)}
                          >
                            <RotateCcwKey className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-error btn-sm"
                            onClick={() => handleDeleteClick(userItem)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Mobile Card View - Hidden on desktop */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-md"></span>
            <div className="ml-2">Loading...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            No users found
          </div>
        ) : (
          users.map((userItem) => (
            <div key={userItem.user_id} className="card bg-base-200 shadow-md">
              <div className="card-body p-4">
                {editingUser === userItem.user_id ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered input-sm flex-1"
                        value={editForm.first_name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            first_name: e.target.value,
                          })
                        }
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        className="input input-bordered input-sm flex-1"
                        value={editForm.last_name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            last_name: e.target.value,
                          })
                        }
                        placeholder="Last Name"
                      />
                    </div>
                    <input
                      type="email"
                      className="input input-bordered input-sm w-full"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      placeholder="Email"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => saveUser(userItem.user_id)}
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={cancelEdit}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {`${userItem.first_name} ${userItem.last_name}`}
                        </h3>
                        <p className="text-sm text-base-content/70 break-all">
                          {userItem.email}
                        </p>
                      </div>
                      <div className="badge badge-outline capitalize">
                        {userItem.role}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="btn btn-primary btn-sm flex-1"
                        onClick={() => startEdit(userItem)}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        className="btn btn-secondary btn-sm flex-1"
                        onClick={() => handleResetPasswordClick(userItem)}
                      >
                        <RotateCcwKey className="w-4 h-4" />
                        Reset
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDeleteClick(userItem)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            className="btn btn-outline"
            disabled={pagination.currentPage === 1}
            onClick={() =>
              setFilters({ ...filters, page: pagination.currentPage - 1 })
            }
          >
            Previous
          </button>
          <span className="text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            className="btn btn-outline"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() =>
              setFilters({ ...filters, page: pagination.currentPage + 1 })
            }
          >
            Next
          </button>
        </div>
      )}

      <PasswordModal
        isOpen={showPasswordModal}
        user={userToReset}
        password={generatedPassword}
        onClose={handlePasswordModalClose}
        onConfirm={handleResetPasswordConfirm}
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