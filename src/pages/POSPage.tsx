import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { productosService } from '../services/productos.service';
import { clientesService } from '../services/clientes.service';
import { ventasService } from '../services/ventas.service';
import { useCarritoStore } from '../store/carritoStore';
import NuevoClienteModal from '../components/NuevoClienteModal';
import { formatCurrency } from '../utils/format';
import SearchBar from '../components/pos/SearchBar';
import ProductGrid from '../components/pos/ProductGrid';
import CartPanel from '../components/pos/CartPanel';

export default function POSPage() {
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);

  const { items, agregarProducto, actualizarCantidad, eliminarProducto, limpiarCarrito, calcularTotales } = useCarritoStore();

  // Query para productos
  const { data: productos = [], isLoading: cargandoProductos } = useQuery({
    queryKey: ['productos', busquedaProducto],
    queryFn: () => busquedaProducto 
      ? productosService.buscarProductos(busquedaProducto)
      : productosService.obtenerProductosActivos(),
  });

  // Query para clientes
  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: clientesService.obtenerClientes,
  });

  // Mutation para registrar venta
  const registrarVentaMutation = useMutation({
    mutationFn: ventasService.registrarVenta,
    onSuccess: (data) => {
      alert(`¡Venta registrada exitosamente!\nFactura: ${data.numero_factura}\nTotal: ${formatCurrency(data.total)}`);
      limpiarCarrito();
      setClienteSeleccionado(null);
    },
    onError: (error: any) => {
      alert(`Error al registrar venta: ${error.response?.data?.error?.message || error.message}`);
    },
  });

  const handleAgregarProducto = (productoId: number) => {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
      if (producto.stock_actual <= 0) {
        alert('Producto sin stock disponible');
        return;
      }
      agregarProducto(producto, 1);
    }
  };

  const handleRegistrarVenta = () => {
    if (!clienteSeleccionado) {
      alert('Por favor selecciona un cliente');
      return;
    }

    if (items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Mapear método de pago a los valores del enum del backend
    type MedioPago = 'Efectivo' | 'Tarjeta Débito' | 'Tarjeta Crédito' | 'Transferencia' | 'Otro';
    const metodoPagoMap: Record<string, MedioPago> = {
      'efectivo': 'Efectivo',
      'tarjeta': 'Tarjeta Débito',
      'transferencia': 'Transferencia',
    };

    const data = {
      clienteId: clienteSeleccionado,
      medioPago: metodoPagoMap[metodoPago] || 'Efectivo' as MedioPago,
      productos: items.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
      })),
    };

    registrarVentaMutation.mutate(data);
  };

  const totales = calcularTotales();

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 0.7fr', 
      gap: '24px', 
      padding: '32px',
      backgroundColor: '#f8f9fa',
      minHeight: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Panel izquierdo - Productos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <SearchBar
          value={busquedaProducto}
          onChange={setBusquedaProducto}
          placeholder="Buscar producto por nombre o referencia..."
        />
        
        <ProductGrid
          productos={productos}
          isLoading={cargandoProductos}
          onSelectProduct={handleAgregarProducto}
        />
      </div>

      {/* Panel derecho - Carrito y Checkout */}
      <CartPanel
        clientes={clientes}
        selectedClienteId={clienteSeleccionado}
        onSelectCliente={setClienteSeleccionado}
        onNewCliente={() => setMostrarModalCliente(true)}
        items={items}
        onUpdateQuantity={actualizarCantidad}
        onRemoveItem={eliminarProducto}
        metodoPago={metodoPago}
        onChangeMetodoPago={setMetodoPago}
        totales={totales}
        onClearCart={limpiarCarrito}
        onCheckout={handleRegistrarVenta}
        isProcessing={registrarVentaMutation.isPending}
      />

      {/* Modal de nuevo cliente */}
      {mostrarModalCliente && (
        <NuevoClienteModal
          onClose={() => setMostrarModalCliente(false)}
          onClienteCreado={(cliente) => {
            setClienteSeleccionado(cliente.id);
            setMostrarModalCliente(false);
          }}
        />
      )}
    </div>
  );
}
