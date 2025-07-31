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
  registerStudent: (studentData) => api.post("/students/register", studentData),
};

export default api;
