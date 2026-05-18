import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.get('/auth/logout'),
  updateDetails: (data: { name?: string; email?: string }) =>
    api.put('/auth/updatedetails', data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/updatepassword', data),
  deleteAccount: () => api.delete('/auth/deleteaccount'),
};

export const interviewAPI = {
  save: (data: any) => api.post('/interviews', data),
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/interviews', { params }),
  getOne: (id: string) => api.get(`/interviews/${id}`),
  delete: (id: string) => api.delete(`/interviews/${id}`),
  getStats: () => api.get('/interviews/stats'),
};

export const dataAPI = {
  // Roadmaps
  saveRoadmap: (data: any) => api.post('/roadmaps', data),
  getRoadmaps: () => api.get('/roadmaps'),
  getRoadmap: (id: string) => api.get(`/roadmaps/${id}`),
  updateRoadmap: (id: string, data: any) => api.put(`/roadmaps/${id}`, data),
  deleteRoadmap: (id: string) => api.delete(`/roadmaps/${id}`),

  // Resume Analysis
  saveResumeAnalysis: (data: any) => api.post('/resume-analysis', data),
  getResumeAnalyses: () => api.get('/resume-analysis'),
  getResumeAnalysis: (id: string) => api.get(`/resume-analysis/${id}`),
  deleteResumeAnalysis: (id: string) => api.delete(`/resume-analysis/${id}`),

  // Progress
  getProgress: () => api.get('/progress'),
  updateProgress: (data: any) => api.put('/progress', data),

  // Dashboard
  getDashboard: () => api.get('/dashboard'),
};

export default api;

// Made with Bob
