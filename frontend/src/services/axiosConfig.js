import axios from 'axios';

// Configuración base para cuando nos conectemos al backend PHP
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajustaremos esto cuando se levante el API final
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar automáticamente el token de seguridad
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
