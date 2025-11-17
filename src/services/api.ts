import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

// Configuración base de Axios para conectar con Strapi
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instancia separada para autenticación (sin /api)
export const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      window.location.href = import.meta.env.VITE_APP_BASE_URL || '/';
    }
    return Promise.reject(error);
  }
);

export default api;
