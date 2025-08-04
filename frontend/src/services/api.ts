import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'doctor' | 'admin';
  avatar?: string;
  lastLogin?: string;
}

export interface Patient {
  _id: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  medicalHistory?: {
    conditions?: string[];
    medications?: string[];
    allergies?: string[];
    surgeries?: string[];
  };
  lifestyle?: {
    smoking?: boolean;
    alcohol?: boolean;
    exercise?: 'none' | 'light' | 'moderate' | 'heavy';
    diet?: 'poor' | 'fair' | 'good' | 'excellent';
  };
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Prediction {
  _id: string;
  patient: Patient;
  createdBy: User;
  age: number;
  sex: 'male' | 'female';
  chestPainType: 'typical angina' | 'atypical angina' | 'non-anginal pain' | 'asymptomatic';
  restingBP: number;
  cholesterol: number;
  fastingBS: number;
  restingECG: 'normal' | 'ST-T wave abnormality' | 'left ventricular hypertrophy';
  maxHR: number;
  exerciseAngina: boolean;
  oldpeak: number;
  stSlope: 'up' | 'flat' | 'down';
  prediction: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  notes?: string;
  recommendations: string[];
  followUpDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PredictionData {
  patientId: string;
  age: number;
  sex: 'male' | 'female';
  chestPainType: 'typical angina' | 'atypical angina' | 'non-anginal pain' | 'asymptomatic';
  restingBP: number;
  cholesterol: number;
  fastingBS: number;
  restingECG: 'normal' | 'ST-T wave abnormality' | 'left ventricular hypertrophy';
  maxHR: number;
  exerciseAngina: boolean;
  oldpeak: number;
  stSlope: 'up' | 'flat' | 'down';
  notes?: string;
}

export interface MLPredictionData {
  age: number;
  sex: 'male' | 'female';
  chestPainType: 'typical angina' | 'atypical angina' | 'non-anginal pain' | 'asymptomatic';
  restingBP: number;
  cholesterol: number;
  fastingBS: number;
  restingECG: 'normal' | 'ST-T wave abnormality' | 'left ventricular hypertrophy';
  maxHR: number;
  exerciseAngina: boolean;
  oldpeak: number;
  stSlope: 'up' | 'flat' | 'down';
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth API
export const authAPI = {
  login: (data: LoginData) => api.post('/auth/login', data),
  register: (data: RegisterData) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: Partial<User>) => api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
};

// Patients API
export const patientsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    gender?: string;
  }) => api.get('/patients', { params }),
  getById: (id: string) => api.get(`/patients/${id}`),
  create: (data: Omit<Patient, '_id' | 'patientId' | 'createdBy' | 'isActive' | 'createdAt' | 'updatedAt'>) =>
    api.post('/patients', data),
  update: (id: string, data: Partial<Patient>) => api.put(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`),
  getPredictions: (id: string, params?: { page?: number; limit?: number }) =>
    api.get(`/patients/${id}/predictions`, { params }),
  getStats: () => api.get('/patients/stats/overview'),
};

// Predictions API
export const predictionsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    riskLevel?: string;
    patientId?: string;
  }) => api.get('/predictions', { params }),
  getById: (id: string) => api.get(`/predictions/${id}`),
  create: (data: PredictionData) => api.post('/predictions', data),
  update: (id: string, data: { notes?: string; recommendations?: string[]; followUpDate?: string }) =>
    api.put(`/predictions/${id}`, data),
  delete: (id: string) => api.delete(`/predictions/${id}`),
  getStats: () => api.get('/predictions/stats/overview'),
};

// ML API
export const mlAPI = {
  predict: (data: MLPredictionData) => api.post('/ml/predict', data),
  batchPredict: (data: { patients: MLPredictionData[] }) => api.post('/ml/batch-predict', data),
  getModelInfo: () => api.get('/ml/model-info'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 