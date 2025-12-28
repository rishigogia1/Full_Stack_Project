import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage:", token ? "present" : "missing");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Added Authorization header");
  }
  return config;
});

export default api;
