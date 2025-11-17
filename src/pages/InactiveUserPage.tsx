import { authService } from '../services/auth.service';
import './styles/InactiveUserPage.css';

export default function InactiveUserPage() {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <div className="inactive-container">
      <div className="inactive-card">
        <div className="inactive-content">
          {/* Icono de usuario inactivo */}
          <div className="inactive-icon-container">
            <svg
              className="inactive-icon"
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
          <h1 className="inactive-title">
            Usuario Inactivo
          </h1>

          {/* Mensaje */}
          <div className="inactive-message">
            <p>
              Hola <span className="inactive-user-name">{user?.nombres} {user?.apellidos}</span>,
            </p>
            <p>
              Tu cuenta actualmente está <span className="inactive-status">inactiva</span>.
            </p>
            <p className="inactive-help-text">
              Por favor, comunícate con un <span className="inactive-user-name">administrador</span> del sistema
              para solicitar la habilitación de tu cuenta.
            </p>
          </div>

          {/* Información de contacto */}
          <div className="inactive-info-box">
            <p className="inactive-info-item">
              <span className="inactive-info-label">Usuario:</span> {user?.username}
            </p>
            <p className="inactive-info-item">
              <span className="inactive-info-label">Email:</span> {user?.email}
            </p>
          </div>

          {/* Botón de cerrar sesión */}
          <button
            onClick={handleLogout}
            className="inactive-logout-button"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
