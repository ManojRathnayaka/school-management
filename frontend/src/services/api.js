import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
  resetPassword: (email, tempPassword, newPassword, confirmPassword) =>
    api.post("/auth/reset-password-first-login", {
      email,
      tempPassword,
      newPassword,
      confirmPassword,
    }),
};

export const userAPI = {
  createUser: (userData) => api.post("/auth/create-user", userData),
  // Get users with pagination and filters
  getUsers: (queryString) => {
    return api.get(`/auth/users?${queryString}`);
  },
  // Update user details
  updateUser: (userId, userData) => {
    return api.put(`/auth/users/${userId}`, userData);
  },
  // Reset user password
  resetUserPassword: (userId) => {
    return api.post(`/auth/users/${userId}/reset-password`);
  },
  // Delete user
  deleteUser: (userId) => {
    return api.delete(`/auth/users/${userId}`);
  },
};

export const studentAPI = {
  registerStudent: (studentData) => api.post("/students", studentData),
  
  getStudents: (params = {}) => {
    const { page = 1, limit = 15, search = '', grade = '', section = '' } = params;
    return api.get("/students/", {
      params: {
        page,
        limit,
        search,
        grade,
        section
      }
    });
  },
  
  updateStudent: (studentId, data) => api.put(`/students/${studentId}`, data),
  deleteStudent: (studentId) => api.delete(`/students/${studentId}`),
  
  // NEW: Get student with parent information
  getStudentParents: (studentId) => api.get(`/students/${studentId}/parents`)
};

export default api;