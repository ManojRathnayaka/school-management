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

export const announcementAPI = {
  // Get latest announcements for dashboard
  getLatest: (limit = 5) => api.get(`/announcements/latest?limit=${limit}`),
  
  // Get all announcements (for management page)
  getAll: () => api.get("/announcements"),
  
  // Create announcement (Principal only)
  create: (announcementData) => api.post("/announcements", announcementData),
  
  // Update announcement (Principal only)
  update: (id, announcementData) => api.put(`/announcements/${id}`, announcementData),
  
  // Delete announcement (Principal only)
  delete: (id) => api.delete(`/announcements/${id}`)
};

export const achievementAPI = {
  getAll: (params = {}) => {
    const { page = 1, limit = 12, search = '', grade = '', category = '' } = params;
    return api.get("/achievements", {
      params: {
        page,
        limit,
        search,
        grade,
        category
      }
    });
  },
  getById: (id) => api.get(`/achievements/${id}`),
  getByCategory: (category, limit = 10) => api.get(`/achievements/category/${category}`, {
    params: { limit }
  }),
  create: (formData) => api.post("/achievements", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, formData) => api.put(`/achievements/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id) => api.delete(`/achievements/${id}`)
};

export default api;