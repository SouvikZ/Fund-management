import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transactions API
export const transactionsAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: (period) => api.get('/dashboard/summary', { params: { period } }),
  getBalance: () => api.get('/dashboard/balance'),
  getRecent: () => api.get('/dashboard/recent'),
};

// Calendar API
export const calendarAPI = {
  getMonthData: (year, month) => api.get(`/calendar/month/${year}/${month}`),
  getDateTransactions: (date) => api.get(`/calendar/date/${date}`),
};

// Reminders API
export const remindersAPI = {
  getAll: (upcoming) => api.get('/reminders', { params: { upcoming } }),
  getById: (id) => api.get(`/reminders/${id}`),
  create: (data) => api.post('/reminders', data),
  update: (id, data) => api.put(`/reminders/${id}`, data),
  delete: (id) => api.delete(`/reminders/${id}`),
};

export default api;

