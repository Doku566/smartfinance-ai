import axios from 'axios';
import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Transactions
export const getTransactions = async (filters?: any) => {
  const response = await api.get('/transactions', { params: filters });
  return response.data;
};

export const createTransaction = async (data: any) => {
  const response = await api.post('/transactions', data);
  return response.data;
};

export const updateTransaction = async (id: string, data: any) => {
  const response = await api.put(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id: string) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/transactions/analytics');
  return response.data;
};

// AI Services
export const getAIInsights = async () => {
  const response = await api.get('/ai/insights');
  return response.data;
};

export const getPredictions = async () => {
  const response = await api.get('/ai/predictions');
  return response.data;
};

export const chatWithAI = async (question: string) => {
  const response = await api.post('/ai/chat', { question });
  return response.data;
};

export default api;