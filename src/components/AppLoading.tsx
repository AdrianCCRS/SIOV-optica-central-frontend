interface AppLoadingProps {
  message?: string;
}

export default function AppLoading({ message = 'Cargando...' }: AppLoadingProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
    }}>
      {/* Logo o título */}
      <div style={{
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#2c3e50',
          marginBottom: '8px',
        }}>
          Óptica Central
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#7f8c8d',
        }}>
          Sistema de Ventas
        </p>
      </div>

      {/* Spinner animado */}
      <div style={{
        position: 'relative',
        width: '64px',
        height: '64px',
        marginBottom: '24px',
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #4CAF50',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>

      {/* Mensaje */}
      <p style={{
        fontSize: '16px',
        color: '#5f6368',
        marginBottom: '8px',
      }}>
        {message}
      </p>

      {/* Subtext */}
      <p style={{
        fontSize: '14px',
        color: '#95989a',
      }}>
        Por favor espere...
      </p>

      {/* Animación CSS */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
