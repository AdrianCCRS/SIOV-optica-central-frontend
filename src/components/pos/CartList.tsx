import CartItem from './CartItem';

interface CartListProps {
  items: Array<{
    producto: {
      id: number;
      nombre: string;
      precio_unitario: number;
      porcentaje_iva: number;
      stock_actual: number;
    };
    cantidad: number;
    total: number;
  }>;
  onUpdateQuantity: (productoId: number, cantidad: number) => void;
  onRemoveItem: (productoId: number) => void;
}

export default function CartList({ items, onUpdateQuantity, onRemoveItem }: CartListProps) {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      borderTop: '2px solid #f1f5f9',
      borderBottom: '2px solid #f1f5f9',
      margin: '0 -20px',
      padding: '12px 20px',
      minHeight: 0,
    }}>
      {items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#a0aec0',
        }}>
          <p style={{ fontSize: '15px', fontWeight: '500' }}>
            Carrito vacío
          </p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>
            Selecciona productos para comenzar
          </p>
        </div>
      ) : (
        items.map((item) => (
          <CartItem
            key={item.producto.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemoveItem}
          />
        ))
      )}
    </div>
  );
}
