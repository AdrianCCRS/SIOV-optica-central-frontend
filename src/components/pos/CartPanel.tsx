import ClienteSelector from './ClienteSelector';
import CartList from './CartList';
import PaymentMethodSelector from './PaymentMethodSelector';
import TotalesSummary from './TotalesSummary';
import CheckoutActions from './CheckoutActions';

interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  numero_identificacion: string;
}

interface CartPanelProps {
  clientes: Cliente[];
  selectedClienteId: number | null;
  onSelectCliente: (clienteId: number) => void;
  onNewCliente: () => void;
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
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  onChangeMetodoPago: (method: 'efectivo' | 'tarjeta' | 'transferencia') => void;
  totales: {
    subtotal: number;
    totalIva: number;
    total: number;
  };
  onClearCart: () => void;
  onCheckout: () => void;
  isProcessing: boolean;
}

export default function CartPanel({
  clientes,
  selectedClienteId,
  onSelectCliente,
  onNewCliente,
  items,
  onUpdateQuantity,
  onRemoveItem,
  metodoPago,
  onChangeMetodoPago,
  totales,
  onClearCart,
  onCheckout,
  isProcessing,
}: CartPanelProps) {
  const isCheckoutDisabled = isProcessing || items.length === 0 || !selectedClienteId;
  const hasItems = items.length > 0;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        // mejor maxHeight que height fija
        // NO ocultes el overflow de todo el panel
        overflow: 'hidden',
      }}
    >
      <h2
        style={{
          margin: '0 0 16px 0',
          fontSize: '20px',
          fontWeight: '700',
          color: '#1a202c',
          flexShrink: 0,
        }}
      >
        Carrito de Compra
      </h2>

      <ClienteSelector
        clientes={clientes}
        selectedClienteId={selectedClienteId}
        onSelectCliente={onSelectCliente}
        onNewCliente={onNewCliente}
      />

      {/* Wrapper scrollable de la lista */}
      <div
        style={{
          flex: 1,        // ocupa todo el espacio disponible
          minHeight: 0,   // clave para que flex permita encogerse y no haga overflow
          overflowY: 'auto',
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        <CartList
          items={items}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      </div>

      <PaymentMethodSelector value={metodoPago} onChange={onChangeMetodoPago} />

      <TotalesSummary
        subtotal={totales.subtotal}
        totalIva={totales.totalIva}
        total={totales.total}
      />

      <CheckoutActions
        onClear={onClearCart}
        onCheckout={onCheckout}
        isCheckoutDisabled={isCheckoutDisabled}
        isProcessing={isProcessing}
        hasItems={hasItems}
      />
    </div>
  );
}


