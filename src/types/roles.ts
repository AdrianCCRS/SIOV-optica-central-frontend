/**
 * Tipos de roles del sistema
 */
export const UserRole = {
  ADMINISTRADOR: 'administrador',
  BODEGUERO: 'bodeguero',
  CAJERO: 'cajero',
  AUTHENTICATED: 'authenticated',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

/**
 * Mapeo de roles a sus páginas iniciales
 */
export const ROLE_INITIAL_PAGES = {
  [UserRole.ADMINISTRADOR]: 'dashboard' as const,
  [UserRole.BODEGUERO]: 'productos' as const,
  [UserRole.CAJERO]: 'pos' as const,
  [UserRole.AUTHENTICATED]: 'pos' as const,
} as const;

/**
 * Páginas disponibles por rol
 */
export const ROLE_AVAILABLE_PAGES = {
  [UserRole.ADMINISTRADOR]: [
    'dashboard',
    'productos',
    'categorias',
    'movimientos',
    'clientes',
    'ventas',
    'historico',
  ] as const,
  [UserRole.BODEGUERO]: ['productos', 'categorias', 'movimientos'] as const,
  [UserRole.CAJERO]: ['pos', 'ventas', 'historico'] as const,
  [UserRole.AUTHENTICATED]: ['pos', 'ventas', 'historico'] as const,
} as const;

/**
 * Utilidad para verificar si un string es un rol válido
 */
export function isValidRole(role: string | undefined): role is UserRoleType {
  if (!role) return false;
  return Object.values(UserRole).includes(role as UserRoleType);
}

/**
 * Obtener el rol del usuario de forma segura
 */
export function getUserRole(roleType: string | undefined): UserRoleType {
  const normalizedRole = roleType?.toLowerCase();
  
  if (isValidRole(normalizedRole)) {
    return normalizedRole;
  }
  
  // Fallback al rol por defecto
  return UserRole.AUTHENTICATED;
}
