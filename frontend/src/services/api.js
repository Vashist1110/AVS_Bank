import axios from 'axios';

// Base API URL - using proxy in development, can be changed for production
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User APIs
export const userAPI = {
  // Register a new user
  register: (userData) => api.post('/register', userData),
  
  // Login user (via phone)
  login: (credentials) => api.post('/login', credentials),
  
  // Get user profile
  getProfile: () => api.get('/profile'),
  
  // Deposit money
  deposit: (amount) => api.post('/deposit', { amount }),
  
  // Withdraw money
  withdraw: (amount) => api.post('/withdraw', { amount }),
};

// Admin APIs
export const adminAPI = {
  // Admin login (via username)
  login: (credentials) => api.post('/admin/login', credentials),
  
  // Get all users
  listUsers: () => api.get('/admin/users'),
  
  // Update user
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  
  // Delete user
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  // Get dashboard data
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Create a new user
  createUser: (userData) => api.post('/admin/create-user', userData),
};

// Helper functions
export const authHelpers = {
  // Save token to localStorage
  saveToken: (token) => {
    localStorage.setItem('token', token);
  },
  
  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('token');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default api;
