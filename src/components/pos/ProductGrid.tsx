import ProductCard from './ProductCard';

interface Producto {
  id: number;
  nombre: string;
  referencia: string;
  precio_unitario: number;
  stock_actual: number;
  stock_minimo: number;
}

interface ProductGridProps {
  productos: Producto[];
  isLoading: boolean;
  onSelectProduct: (productoId: number) => void;
}

export default function ProductGrid({ productos, isLoading, onSelectProduct }: ProductGridProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '16px',
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 280px)',
      paddingRight: '8px',
      paddingTop: '8px',
    }}>
      {isLoading ? (
        <div style={{
          gridColumn: '1 / -1',
          textAlign: 'center',
          padding: '40px',
          color: '#718096',
        }}>
          Cargando productos...
        </div>
      ) : productos.length === 0 ? (
        <div style={{
          gridColumn: '1 / -1',
          textAlign: 'center',
          padding: '40px',
          color: '#a0aec0',
        }}>
          No se encontraron productos
        </div>
      ) : (
        productos.map((producto) => (
          <ProductCard
            key={producto.id}
            producto={producto}
            onSelect={onSelectProduct}
          />
        ))
      )}
    </div>
  );
}
