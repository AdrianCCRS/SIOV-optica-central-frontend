import { useAuthStore } from '../store/authStore';
import StockAlerts from './StockAlerts';
import './Header.css';

type POSPage = 'pos' | 'ventas' | 'historico';
type BodegaPage = 'productos' | 'categorias' | 'movimientos';
type AdminPage = 'dashboard' | 'productos' | 'categorias' | 'movimientos' | 'clientes' | 'ventas' | 'historico' | 'usuarios';

interface HeaderProps {
  currentPage: POSPage | BodegaPage | AdminPage;
  onNavigate: (page: POSPage | BodegaPage | AdminPage) => void;
}

// Iconos SVG
const Icons = {
  Logo: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Package: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  Tag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  ShoppingCart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  DollarSign: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  UsersGroup: () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
),

};

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { user, logout } = useAuthStore();

  // Determinar el tipo de rol del usuario
  const roleType = user?.role?.type?.toLowerCase();
  const isBodeguero = roleType === 'bodeguero';
  const isCajero = roleType === 'cajero' || roleType === 'authenticated';
  const isAdministrador = roleType === 'administrador';
  // Mostrar alertas de stock solo para bodeguero y administrador
  const showStockAlerts = isBodeguero || isAdministrador;

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      window.location.href = import.meta.env.VITE_APP_BASE_URL || '/';
    }
  };

  // Título según el rol
  const getTitle = () => {
    if (isAdministrador) return 'Panel de Administración';
    if (isBodeguero) return 'Gestión de Bodega';
    if (isCajero) return 'Sistema de Ventas';
    return 'Sistema';
  };

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (user?.nombres && user?.apellidos) {
      return `${user.nombres[0]}${user.apellidos[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="app-header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="header-branding">
          <div className="header-logo">
            <Icons.Logo />
          </div>
          <div className="header-title-group">
            <h1 className="header-title">Óptica Central</h1>
            <p className="header-subtitle">{getTitle()}</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-user-info">
            <div className="user-avatar">{getUserInitials()}</div>
            <div className="user-details">
              <div className="user-name">
                {user?.nombres && user?.apellidos 
                  ? `${user.nombres} ${user.apellidos}`
                  : user?.username || user?.email}
              </div>
              <div className="user-role">
                {user?.role?.name || 'Usuario'}
              </div>
            </div>
          </div>
          
          {/* Alertas de stock bajo */}
          {showStockAlerts && (
            <StockAlerts 
              onViewDetails={() => onNavigate('productos' as any)} 
            />
          )}
          
          <button onClick={handleLogout} className="logout-button">
            <Icons.LogOut />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="header-nav">
        {isAdministrador ? (
          // Tabs para administrador
          <>
            <button
              onClick={() => onNavigate('dashboard' as any)}
              className={`nav-button ${currentPage === 'dashboard' ? 'nav-button-active' : ''}`}
            >
              <Icons.Dashboard />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate('productos' as any)}
              className={`nav-button ${currentPage === 'productos' ? 'nav-button-active' : ''}`}
            >
              <Icons.Package />
              <span>Productos</span>
            </button>
            <button
              onClick={() => onNavigate('categorias' as any)}
              className={`nav-button ${currentPage === 'categorias' ? 'nav-button-active' : ''}`}
            >
              <Icons.Tag />
              <span>Categorías</span>
            </button>
            <button
              onClick={() => onNavigate('movimientos' as any)}
              className={`nav-button ${currentPage === 'movimientos' ? 'nav-button-active' : ''}`}
            >
              <Icons.Activity />
              <span>Inventario</span>
            </button>
            <button
              onClick={() => onNavigate('clientes' as any)}
              className={`nav-button ${currentPage === 'clientes' ? 'nav-button-active' : ''}`}
            >
              <Icons.Users />
              <span>Clientes</span>
            </button>
            <button
              onClick={() => onNavigate('ventas' as any)}
              className={`nav-button ${currentPage === 'ventas' ? 'nav-button-active' : ''}`}
            >
              <Icons.DollarSign />
              <span>Ventas del Día</span>
            </button>
            <button
              onClick={() => onNavigate('historico' as any)}
              className={`nav-button ${currentPage === 'historico' ? 'nav-button-active' : ''}`}
            >
              <Icons.Clock />
              <span>Histórico</span>
            </button>
            <button
              onClick={() => onNavigate('usuarios' as any)}
              className={`nav-button ${currentPage === 'usuarios' ? 'nav-button-active' : ''}`}
            >
              <Icons.Users />
              <span>Usuarios</span>
            </button>
          </>
        ) : isBodeguero ? (
          // Tabs para bodeguero
          <>
            <button
              onClick={() => onNavigate('productos' as any)}
              className={`nav-button ${currentPage === 'productos' ? 'nav-button-active' : ''}`}
            >
              <Icons.Package />
              <span>Productos</span>
            </button>
            <button
              onClick={() => onNavigate('categorias' as any)}
              className={`nav-button ${currentPage === 'categorias' ? 'nav-button-active' : ''}`}
            >
              <Icons.Tag />
              <span>Categorías</span>
            </button>
            <button
              onClick={() => onNavigate('movimientos' as any)}
              className={`nav-button ${currentPage === 'movimientos' ? 'nav-button-active' : ''}`}
            >
              <Icons.Activity />
              <span>Movimientos de Inventario</span>
            </button>
          </>
        ) : (
          // Tabs para cajero
          <>
            <button
              onClick={() => onNavigate('pos' as any)}
              className={`nav-button ${currentPage === 'pos' ? 'nav-button-active' : ''}`}
            >
              <Icons.ShoppingCart />
              <span>Punto de Venta</span>
            </button>
            <button
              onClick={() => onNavigate('ventas' as any)}
              className={`nav-button ${currentPage === 'ventas' ? 'nav-button-active' : ''}`}
            >
              <Icons.DollarSign />
              <span>Ventas del Día</span>
            </button>
            <button
              onClick={() => onNavigate('historico' as any)}
              className={`nav-button ${currentPage === 'historico' ? 'nav-button-active' : ''}`}
            >
              <Icons.Clock />
              <span>Histórico de Ventas</span>
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
