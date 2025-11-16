import { authApi } from './api';

export interface LoginCredentials {
  identifier: string; // email o username
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  blocked: boolean;
  nombres?: string;
  apellidos?: string;
}

export interface AuthResponse {
  jwt: string;
  user: AuthUser;
}

export const authService = {
  // Login de usuario
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authApi.post('/api/auth/local', credentials);
    
    // Guardar token en localStorage
    if (response.data.jwt) {
      localStorage.setItem('jwt_token', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Obtener usuario actual
  async me(): Promise<AuthUser> {
    const response = await authApi.get('/api/users/me');
    return response.data;
  },

  // Logout
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  },

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  },

  // Obtener usuario del localStorage
  getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  },
};
