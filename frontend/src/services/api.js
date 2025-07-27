import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/login", { email, password }),
  logout: () => api.post("/logout"),
  getCurrentUser: () => api.get("/me"),
  resetPassword: (email, tempPassword, newPassword, confirmPassword) =>
    api.post("/reset-password-first-login", {
      email,
      tempPassword,
      newPassword,
      confirmPassword,
    }),
};

// User Management API
export const userAPI = {
  createUser: (userData) => api.post("/create-user", userData),
};

// Student Management API
export const studentAPI = {
  registerStudent: (studentData) => api.post("/register-student", studentData),
};

export default api; 