import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect if we're not already on the login or signup page
    // and it's not the /me endpoint (initial auth check)
    if (error.response?.status === 401 && 
        !window.location.pathname.includes('/login') && 
        !window.location.pathname.includes('/signup') &&
        !error.config?.url?.includes('/auth/me')) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
