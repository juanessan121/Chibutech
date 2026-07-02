import axios from 'axios';

// La URL real se define en public/config.js (editable sin recompilar).
// Si ese archivo no cargó por algún motivo, cae de vuelta a localhost (desarrollo).
const api = axios.create({
  baseURL: window.__API_BASE_URL__ || 'http://localhost:8080/api',
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
