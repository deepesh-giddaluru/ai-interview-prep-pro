import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'api';

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
adminApi.interceptors.request.use(
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

// Handle response errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API endpoints
export const adminApiService = {
  // Get all users with pagination and search
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => {
    const response = await adminApi.get('/admin/users', { params });
    return response.data;
  },

  // Get user details
  getUserDetails: async (userId: string) => {
    const response = await adminApi.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string) => {
    const response = await adminApi.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId: string, role: 'user' | 'admin') => {
    const response = await adminApi.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Get analytics dashboard data
  getAnalytics: async () => {
    const response = await adminApi.get('/admin/analytics');
    return response.data;
  },

  // Get active users
  getActiveUsers: async () => {
    const response = await adminApi.get('/admin/active-users');
    return response.data;
  },

  // Get interview statistics
  getInterviewStats: async (period?: '24h' | '7d' | '30d') => {
    const response = await adminApi.get('/admin/interview-stats', {
      params: { period },
    });
    return response.data;
  },
};

export default adminApi;

// Made with Bob