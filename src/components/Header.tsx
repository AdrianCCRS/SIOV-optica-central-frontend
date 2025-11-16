import { useAuthStore } from '../store/authStore';

interface HeaderProps {
  currentPage: 'pos' | 'ventas' | 'historico';
  onNavigate: (page: 'pos' | 'ventas' | 'historico') => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      window.location.href = '/';
    }
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
          <h1 style={{ margin: 0, fontSize: '24px' }}>Óptica Central - Sistema de Ventas</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {user?.nombres && user?.apellidos 
                ? `${user.nombres} ${user.apellidos}`
                : user?.username || user?.email}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {user?.username || user?.email}
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
        <button
          onClick={() => onNavigate('pos')}
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
          onClick={() => onNavigate('ventas')}
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
          onClick={() => onNavigate('historico')}
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
      </div>
    </header>
  );
}
