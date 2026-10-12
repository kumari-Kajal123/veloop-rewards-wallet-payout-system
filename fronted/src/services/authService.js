
import api from "./api";

const authService = {
  // Register a new user
  register: (userData) =>
    api.post("/auth/register", userData),

  // Login existing user
  login: (credentials) =>
    api.post("/auth/login", credentials),

  // Get logged-in user's profile
  getCurrentUser: () =>
    api.get("/auth/me"),

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
