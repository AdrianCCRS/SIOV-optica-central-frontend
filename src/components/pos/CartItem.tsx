import { formatCurrency } from '../../utils/format';

interface CartItemProps {
  item: {
    producto: {
      id: number;
      nombre: string;
      precio_unitario: number;
      porcentaje_iva: number;
      stock_actual: number;
    };
    cantidad: number;
    total: number;
  };
  onUpdateQuantity: (productoId: number, cantidad: number) => void;
  onRemove: (productoId: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div style={{
      padding: '16px 0',
      borderBottom: '1px solid #f1f5f9',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
      }}>
        <div style={{ flex: 1 }}>
          <p style={{
            margin: '0 0 4px 0',
            fontWeight: '600',
            fontSize: '14px',
            color: '#2d3748',
          }}>
            {item.producto.nombre}
          </p>
          <p style={{
            margin: '0',
            fontSize: '13px',
            color: '#718096',
          }}>
            {formatCurrency(item.producto.precio_unitario)} × {item.cantidad}
          </p>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: '#a0aec0',
          }}>
            IVA {item.producto.porcentaje_iva}%
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <button
            onClick={() => onUpdateQuantity(item.producto.id, item.cantidad - 1)}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              color: '#4a5568',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f7fafc';
              e.currentTarget.style.borderColor = '#cbd5e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            −
          </button>
          <input
            type="number"
            value={item.cantidad}
            onChange={(e) => onUpdateQuantity(item.producto.id, Number(e.target.value))}
            style={{
              width: '52px',
              height: '32px',
              textAlign: 'center',
              border: '2px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2d3748',
            }}
            min="1"
            max={item.producto.stock_actual}
          />
          <button
            onClick={() => onUpdateQuantity(item.producto.id, item.cantidad + 1)}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              color: '#4a5568',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f7fafc';
              e.currentTarget.style.borderColor = '#cbd5e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            +
          </button>
          <button
            onClick={() => onRemove(item.producto.id)}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid #fed7d7',
              backgroundColor: '#fff5f5',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '20px',
              fontWeight: '400',
              color: '#e53e3e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#feb2b2';
              e.currentTarget.style.borderColor = '#fc8181';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff5f5';
              e.currentTarget.style.borderColor = '#fed7d7';
            }}
            title="Eliminar producto"
          >
            ×
          </button>
        </div>
      </div>
      <p style={{
        margin: '0',
        textAlign: 'right',
        fontWeight: '700',
        fontSize: '15px',
        color: '#2d3748',
      }}>
        {formatCurrency(item.total)}
      </p>
    </div>
  );
}
