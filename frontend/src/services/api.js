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
  // Placeholder endpoints for future implementation
  deleteStudent: (studentId) => api.delete(`/students/${studentId}`)
};

export default api;
