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
      console.log('Interceptor: Token added to request', config.url);
    } else {
      console.warn('Interceptor: No token found in localStorage');
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
  
  // Transfer money
  transfer: (amount, recipient_account) => api.post('/transfer', { amount, recipient_account }),
  
  // Submit KYC documents
  submitKYC: (formData) => {
    return api.post('/request-kyc-update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Request profile update
  requestUpdate: (updateData) => api.post('/request-update', updateData),
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
  
  // List pending KYC requests
  listKycRequests: () => api.get('/admin/kyc-requests'),

  // Process a KYC request (approve/reject)
  processKycRequest: (requestId, action) => api.post(`/admin/kyc-requests/${requestId}`, { action }),
  
  // List pending profile update requests
  listUpdateRequests: () => api.get('/admin/update-requests'),
  
  // Process a profile update request (approve/reject)
  processUpdateRequest: (requestId, action) => api.post(`/admin/update-requests/${requestId}`, { action }),
  
  // Create a new user
  createUser: (userData) => api.post('/admin/create-user', userData),
};

// Helper functions
export const authHelpers = {
  // Save token to localStorage
  saveToken: (token, role = 'user') => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
  },
  
  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  // Get user role
  getRole: () => {
    return localStorage.getItem('userRole') || 'user';
  },
  
  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Check if current user is admin
  isAdmin: () => {
    return localStorage.getItem('userRole') === 'admin';
  },
};

export default api;
