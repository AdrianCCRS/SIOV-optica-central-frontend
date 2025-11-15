import { useAuthStore } from '../store/authStore';

export default function Header() {
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
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px' }}>SIOV - Sistema de Ventas</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {user?.username || user?.email}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            {user?.email}
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
    </header>
  );
}
