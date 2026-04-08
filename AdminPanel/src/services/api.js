import axios from 'axios';

export const API_BASE_URL = 'http://192.168.1.19:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const adminAuthAPI = {
  login: (email, password) => api.post('/admin/login', { email, password }),
  verifyToken: () => api.get('/admin/verify'),
  sendOTP: (email) => api.post('/admin/forgot-password/send-otp', { email }),
  verifyOTP: (email, otp) => api.post('/admin/forgot-password/verify-otp', { email, otp }),
  resetPassword: (email, otp, newPassword) => api.post('/admin/forgot-password/reset-password', { email, otp, newPassword }),
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  }
};

export const adminManagementAPI = {
  getAdmins: () => api.get('/admin/admins'),
  getAdminById: (id) => api.get(`/admin/admins/${id}`),
  createAdmin: (adminData) => api.post('/admin/admins', adminData),
  updateAdmin: (id, adminData) => api.put(`/admin/admins/${id}`, adminData),
  deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getRecentUsers: () => api.get('/admin/users/recent'),
  
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/status`),
  
  getCards: () => api.get('/admin/cards'),
  deleteCard: (id) => api.delete(`/admin/cards/${id}`),
  updateCard: (id, data) => api.put(`/admin/cards/${id}`, data),
  getUsersCards: (id) => api.get(`/admin/users/${id}/cards`),
};

export default api;