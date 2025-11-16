interface CheckoutActionsProps {
  onClear: () => void;
  onCheckout: () => void;
  isCheckoutDisabled: boolean;
  isProcessing: boolean;
  hasItems: boolean;
}

export default function CheckoutActions({ 
  onClear, 
  onCheckout, 
  isCheckoutDisabled, 
  isProcessing,
  hasItems 
}: CheckoutActionsProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      marginTop: '12px',
      flexShrink: 0,
    }}>
      <button
        onClick={onClear}
        disabled={!hasItems}
        style={{
          flex: 1,
          padding: '12px',
          backgroundColor: !hasItems ? '#f1f5f9' : '#718096',
          color: !hasItems ? '#a0aec0' : 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: !hasItems ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s',
          opacity: !hasItems ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (hasItems) {
            e.currentTarget.style.backgroundColor = '#4a5568';
          }
        }}
        onMouseLeave={(e) => {
          if (hasItems) {
            e.currentTarget.style.backgroundColor = '#718096';
          }
        }}
      >
        Limpiar
      </button>
      <button
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        style={{
          flex: 2,
          padding: '12px',
          backgroundColor: isCheckoutDisabled ? '#f1f5f9' : '#4CAF50',
          color: isCheckoutDisabled ? '#a0aec0' : 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isCheckoutDisabled ? 'not-allowed' : 'pointer',
          fontSize: '15px',
          fontWeight: '700',
          transition: 'all 0.2s',
          opacity: isCheckoutDisabled ? 0.6 : 1,
          boxShadow: isCheckoutDisabled ? 'none' : '0 2px 6px rgba(76, 175, 80, 0.3)',
        }}
        onMouseEnter={(e) => {
          if (!isCheckoutDisabled) {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isCheckoutDisabled) {
            e.currentTarget.style.backgroundColor = '#4CAF50';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(76, 175, 80, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        {isProcessing ? 'Procesando...' : 'Registrar Venta'}
      </button>
    </div>
  );
}
