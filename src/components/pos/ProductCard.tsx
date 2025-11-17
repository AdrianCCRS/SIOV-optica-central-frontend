import { formatCurrency } from '../../utils/format';

interface Producto {
  id: number;
  nombre: string;
  referencia: string;
  precio_unitario: number;
  stock_actual: number;
  stock_minimo: number;
}

interface ProductCardProps {
  producto: Producto;
  onSelect: (productoId: number) => void;
}

export default function ProductCard({ producto, onSelect }: ProductCardProps) {
  const sinStock = producto.stock_actual <= 0;
  const stockBajo = producto.stock_actual <= producto.stock_minimo;

  return (
    <div
      style={{
        backgroundColor: sinStock ? '#fff5f5' : 'white',
        border: sinStock ? '2px solid #fc8181' : '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px',
        cursor: sinStock ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        opacity: sinStock ? 0.6 : 1,
      }}
      onClick={() => !sinStock && onSelect(producto.id)}
      onMouseEnter={(e) => {
        if (!sinStock) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
          e.currentTarget.style.borderColor = 'var(--color-primary-dark)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = sinStock ? '#fc8181' : '#e2e8f0';
      }}
    >
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '15px',
        fontWeight: '600',
        color: '#2d3748',
        lineHeight: '1.4',
      }}>
        {producto.nombre}
      </h3>
      <p style={{
        margin: '0 0 12px 0',
        fontSize: '12px',
        color: '#718096',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Ref: {producto.referencia}
      </p>
      <p style={{
        margin: '0 0 8px 0',
        fontSize: '20px',
        fontWeight: '700',
        color: '#2d3748',
      }}>
        {formatCurrency(producto.precio_unitario)}
      </p>
      <div style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: sinStock ? '#fed7d7' : stockBajo ? '#fef5e7' : '#c6f6d5',
        color: sinStock ? '#c53030' : stockBajo ? '#d69e2e' : '#2f855a',
      }}>
        Stock: {producto.stock_actual}
      </div>
    </div>
  );
}
