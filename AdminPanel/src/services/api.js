import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.35:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getRecentUsers: () => api.get('/admin/users/recent'),
  
  // Users
  getUsers: (page = 1, search = '', sortBy = 'createdAt', sortOrder = 'desc') => 
    api.get(`/admin/users?page=${page}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  
  // Cards
  getCards: (page = 1, search = '', sortBy = 'createdAt', sortOrder = 'desc') => 
    api.get(`/admin/cards?page=${page}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`),
  deleteCard: (id) => api.delete(`/admin/cards/${id}`),
  updateCard: (id, data) => api.put(`/admin/cards/${id}`, data),
};

export default api;
