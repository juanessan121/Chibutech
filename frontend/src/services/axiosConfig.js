import axios from 'axios';

// Configuración base para cuando nos conectemos al backend PHP
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajustaremos esto cuando se levante el API final
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const storageStr = localStorage.getItem('auth-storage');
  if (storageStr) {
    try {
      const parsed = JSON.parse(storageStr);
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // token corrupto — se ignora y continúa sin header
    }
  }
  return config;
});

export default api;
