interface PaymentMethodSelectorProps {
  value: 'efectivo' | 'tarjeta' | 'transferencia';
  onChange: (method: 'efectivo' | 'tarjeta' | 'transferencia') => void;
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div style={{ marginTop: '12px', flexShrink: 0 }}>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        fontSize: '12px',
        color: '#4a5568',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
      }}>
        Método de Pago
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as any)}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          outline: 'none',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontWeight: '500',
          color: '#2d3748',
        }}
      >
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta">Tarjeta</option>
        <option value="transferencia">Transferencia</option>
      </select>
    </div>
  );
}
