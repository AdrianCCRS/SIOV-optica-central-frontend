import { authService } from '../services/auth.service';

export default function InactiveUserPage() {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
      }}>
        <div style={{ textAlign: 'center' }}>
          {/* Icono de usuario inactivo */}
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#fff3cd',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg
              style={{
                width: '48px',
                height: '48px',
                color: '#f59e0b',
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Título */}
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px',
          }}>
            Usuario Inactivo
          </h1>

          {/* Mensaje */}
          <div style={{
            color: '#666',
            marginBottom: '24px',
            lineHeight: '1.6',
          }}>
            <p style={{ marginBottom: '12px' }}>
              Hola <span style={{ fontWeight: '600' }}>{user?.nombres} {user?.apellidos}</span>,
            </p>
            <p style={{ marginBottom: '12px' }}>
              Tu cuenta actualmente está <span style={{ fontWeight: '600', color: '#f59e0b' }}>inactiva</span>.
            </p>
            <p style={{ fontSize: '14px', marginTop: '16px' }}>
              Por favor, comunícate con un <span style={{ fontWeight: '600' }}>administrador</span> del sistema
              para solicitar la habilitación de tu cuenta.
            </p>
          </div>

          {/* Información de contacto */}
          <div style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'left',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#555',
              marginBottom: '8px',
            }}>
              <span style={{ fontWeight: '600' }}>Usuario:</span> {user?.username}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#555',
            }}>
              <span style={{ fontWeight: '600' }}>Email:</span> {user?.email}
            </p>
          </div>

          {/* Botón de cerrar sesión */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#666',
              color: 'white',
              fontWeight: '500',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#555'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#666'}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
