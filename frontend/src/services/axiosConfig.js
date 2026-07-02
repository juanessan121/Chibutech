import axios from 'axios';

// Prioridad para decidir a dónde hablarle a la API:
//   1. window.__API_BASE_URL__ — si existe public/config.js con un valor (override manual).
//   2. En localhost/127.0.0.1 (desarrollo con Docker) — el backend en el puerto 8080.
//   3. Cualquier otro dominio (producción) — ruta relativa "/api", asumiendo que el
//      frontend compilado quedó servido por el mismo Laravel (mismo dominio, sin CORS).
const esLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const urlPorDefecto = esLocal ? 'http://localhost:8080/api' : '/api';

const api = axios.create({
  baseURL: window.__API_BASE_URL__ || urlPorDefecto,
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
