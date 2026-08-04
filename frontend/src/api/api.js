import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Attach the JWT issued at login/register (if any) to every outgoing request.
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("student");
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // malformed localStorage value — ignore and send the request unauthenticated
    }
  }
  return config;
});

// If the token is invalid/expired, the backend returns 401/403 — clear the
// stale session so ProtectedRoute sends the user back to the login screen.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("student");
    }
    return Promise.reject(error);
  }
);

export default API;
