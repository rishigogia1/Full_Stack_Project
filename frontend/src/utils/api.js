import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // 🔥 IMPORTANT
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ❌ DO NOT send token on login
  if (token && !config.url.includes("/auth/login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
