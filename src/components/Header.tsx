import { useAuthStore } from '../store/authStore';

type POSPage = 'pos' | 'ventas' | 'historico';
type BodegaPage = 'productos' | 'categorias' | 'movimientos';

interface HeaderProps {
  currentPage: POSPage | BodegaPage;
  onNavigate: (page: POSPage | BodegaPage) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { user, logout } = useAuthStore();

  // Determinar el tipo de rol del usuario
  const roleType = user?.role?.type?.toLowerCase();
  const isBodeguero = roleType === 'bodeguero';
  const isCajero = roleType === 'cajero' || roleType === 'authenticated';

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      window.location.href = '/';
    }
  };

  // Título según el rol
  const getTitle = () => {
    if (isBodeguero) return 'Gestión de Bodega';
    if (isCajero) return 'Sistema de Ventas';
    return 'Sistema';
  };

  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#4CAF50',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>
            Óptica Central - {getTitle()}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {user?.nombres && user?.apellidos 
                ? `${user.nombres} ${user.apellidos}`
                : user?.username || user?.email}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {user?.role?.name || user?.username || user?.email}
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid white',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        backgroundColor: 'rgba(0,0,0,0.1)',
      }}>
        {isBodeguero ? (
          // Tabs para bodeguero
          <>
            <button
              onClick={() => onNavigate('productos' as any)}
              style={{
                padding: '12px 24px',
                backgroundColor: currentPage === 'productos' ? 'white' : 'transparent',
                color: currentPage === 'productos' ? '#4CAF50' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                borderBottom: currentPage === 'productos' ? '3px solid #4CAF50' : 'none',
              }}
            >
              Productos
            </button>
            <button
              onClick={() => onNavigate('categorias' as any)}
              style={{
                padding: '12px 24px',
                backgroundColor: currentPage === 'categorias' ? 'white' : 'transparent',
                color: currentPage === 'categorias' ? '#4CAF50' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                borderBottom: currentPage === 'categorias' ? '3px solid #4CAF50' : 'none',
              }}
            >
              Categorías
            </button>
            <button
              onClick={() => onNavigate('movimientos' as any)}
              style={{
                padding: '12px 24px',
                backgroundColor: currentPage === 'movimientos' ? 'white' : 'transparent',
                color: currentPage === 'movimientos' ? '#4CAF50' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                borderBottom: currentPage === 'movimientos' ? '3px solid #4CAF50' : 'none',
              }}
            >
              Movimientos de Inventario
            </button>
          </>
        ) : (
          // Tabs para cajero (POS)
          <>
            <button
              onClick={() => {
                console.log('Navegando a: pos');
                onNavigate('pos' as any);
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: currentPage === 'pos' ? 'white' : 'transparent',
                color: currentPage === 'pos' ? '#4CAF50' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                borderBottom: currentPage === 'pos' ? '3px solid #4CAF50' : 'none',
              }}
            >
              Punto de Venta
            </button>
            <button
              onClick={() => {
                console.log('Navegando a: ventas');
                onNavigate('ventas' as any);
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: currentPage === 'ventas' ? 'white' : 'transparent',
                color: currentPage === 'ventas' ? '#4CAF50' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                borderBottom: currentPage === 'ventas' ? '3px solid #4CAF50' : 'none',
              }}
            >
              Ventas del Día
            </button>
            <button
              onClick={() => {
                console.log('Navegando a: historico');
                onNavigate('historico' as any);
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: currentPage === 'historico' ? 'white' : 'transparent',
                color: currentPage === 'historico' ? '#4CAF50' : 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                borderBottom: currentPage === 'historico' ? '3px solid #4CAF50' : 'none',
              }}
            >
              Histórico de Ventas
            </button>
          </>
        )}
      </div>
    </header>
  );
}
