import axios from 'axios';

export const API_BASE_URL = 'http://192.168.1.35:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAuthAPI = {
  login: (email, password) => api.post('/admin/login', { email, password }),
  verifyToken: () => api.get('/admin/verify'),
};

export const adminManagementAPI = {
  getAdmins: () => api.get('/admin/admins'),
  getAdminById: (id) => api.get(`/admin/admins/${id}`),
  createAdmin: (adminData) => api.post('/admin/admins', adminData),
  updateAdmin: (id, adminData) => api.put(`/admin/admins/${id}`, adminData),
  deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
};

export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getRecentUsers: () => api.get('/admin/users/recent'),
  
  // Users
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  
  // Cards 
  getCards: () => api.get('/admin/cards'),
  deleteCard: (id) => api.delete(`/admin/cards/${id}`),
  updateCard: (id, data) => api.put(`/admin/cards/${id}`, data),
};

export default api;
