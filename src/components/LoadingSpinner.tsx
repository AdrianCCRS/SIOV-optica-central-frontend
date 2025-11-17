import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showBranding?: boolean;
  subtitle?: string;
}

export default function LoadingSpinner({ 
  message = 'Cargando...', 
  size = 'md',
  showBranding = false,
  subtitle = 'Por favor espere...'
}: LoadingSpinnerProps) {
  const sizeClass = `loading-spinner-${size}`;

  return (
    <div className="loading-container">
      <div className="loading-content">
        {/* Branding (solo si showBranding es true) */}
        {showBranding && (
          <div className="loading-branding">
            <h1 className="loading-brand-title">
              Óptica Central
            </h1>
            <p className="loading-brand-subtitle">
              Sistema de Ventas
            </p>
          </div>
        )}

        {/* Spinner animado */}
        <div className={`loading-spinner ${sizeClass}`}>
          <div className="loading-spinner-circle" />
        </div>

        {/* Mensaje */}
        <p className="loading-message">
          {message}
        </p>

        {/* Subtitle */}
        {subtitle && (
          <p className="loading-subtext">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
