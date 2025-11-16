interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
  message = 'Cargando...', 
  size = 'md' 
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: '30px',
    md: '50px',
    lg: '70px'
  };

  const borderWidth = {
    sm: '3px',
    md: '5px',
    lg: '7px'
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        gap: '20px'
      }}
    >
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: `${borderWidth[size]} solid #e0e0e0`,
          borderTop: `${borderWidth[size]} solid #4CAF50`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
