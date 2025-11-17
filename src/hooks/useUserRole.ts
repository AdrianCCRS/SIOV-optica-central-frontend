import { useAuthStore } from '../store/authStore';
import { getUserRole, UserRole, type UserRoleType } from '../types/roles';
import type { AuthUser } from '../services/auth.service';

interface UseUserRoleReturn {
  role: UserRoleType;
  isAdministrador: boolean;
  isBodeguero: boolean;
  isCajero: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
}

/**
 * Hook personalizado para obtener información del rol del usuario
 */
export function useUserRole(): UseUserRoleReturn {
  const { user, isLoading } = useAuthStore();
  
  const role = getUserRole(user?.role?.type);
  
  return {
    role,
    isAdministrador: role === UserRole.ADMINISTRADOR,
    isBodeguero: role === UserRole.BODEGUERO,
    isCajero: role === UserRole.CAJERO || role === UserRole.AUTHENTICATED,
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}
