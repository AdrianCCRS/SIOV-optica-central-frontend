import { create } from 'zustand';
import type { AuthUser } from '../services/auth.service';
import { authService } from '../services/auth.service';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  initAuth: async () => {
    set({ isLoading: true });
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated) {
      try {
        // Siempre obtener el usuario fresco del servidor con el rol poblado
        const userWithRole = await authService.me();
        localStorage.setItem('user', JSON.stringify(userWithRole));
        set({ user: userWithRole, isAuthenticated: true, isLoading: false });
      } catch (error) {
        // Si falla, intentar con el usuario del localStorage
        const user = authService.getCurrentUser();
        set({ user, isAuthenticated: !!user, isLoading: false });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
