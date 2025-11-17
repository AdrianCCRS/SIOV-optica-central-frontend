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
  activo: boolean;
  nombres?: string;
  apellidos?: string;
  role?: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
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
      
      // Obtener usuario con rol poblado
      try {
        const userWithRole = await this.me();
        localStorage.setItem('user', JSON.stringify(userWithRole));
        return {
          jwt: response.data.jwt,
          user: userWithRole
        };
      } catch (error) {
        // Si falla, guardar el usuario sin rol
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
    }
    
    return response.data;
  },

  // Obtener usuario actual con rol
  async me(): Promise<AuthUser> {
    const token = localStorage.getItem('jwt_token');
    const response = await authApi.get('/api/users/me?populate=role', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
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
