import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { productosService } from '../services/productos.service';
import { clientesService } from '../services/clientes.service';
import { ventasService } from '../services/ventas.service';
import { useCarritoStore } from '../store/carritoStore';
import NuevoClienteModal from '../components/NuevoClienteModal';

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
      alert(`¡Venta registrada exitosamente!\nFactura: ${data.numero_factura}\nTotal: $${data.total.toFixed(2)}`);
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

    const data = {
      cliente_id: clienteSeleccionado,
      metodo_pago: metodoPago,
      productos: items.map(item => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio_unitario,
        porcentaje_iva: item.producto.porcentaje_iva,
      })),
    };

    registrarVentaMutation.mutate(data);
  };

  const totales = calcularTotales();
  console.log(clientes)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', padding: '20px', height: '100%' }}>
      {/* Panel izquierdo - Productos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input
          type="text"
          placeholder="Buscar producto por nombre o referencia..."
          value={busquedaProducto}
          onChange={(e) => setBusquedaProducto(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', overflowY: 'auto' }}>
          {cargandoProductos ? (
            <p>Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p>No se encontraron productos</p>
          ) : (
            productos.map((producto) => (
              <div
                key={producto.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: producto.stock_actual <= 0 ? '#ffebee' : '#fff',
                }}
                onClick={() => handleAgregarProducto(producto.id)}
              >
                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{producto.nombre}</h3>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>Ref: {producto.referencia}</p>
                <p style={{ margin: '4px 0', fontSize: '16px', fontWeight: 'bold' }}>
                  ${producto.precio_unitario.toFixed(2)}
                </p>
                <p style={{ margin: '4px 0', fontSize: '12px', color: producto.stock_actual <= producto.stock_minimo ? 'red' : 'green' }}>
                  Stock: {producto.stock_actual}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Panel derecho - Carrito y Checkout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '2px solid #ddd', paddingLeft: '20px' }}>
        <h2>Carrito de Compra</h2>

        {/* Selector de cliente */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Cliente:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={clienteSeleccionado || ''}
              onChange={(e) => setClienteSeleccionado(Number(e.target.value))}
              style={{ flex: 1, padding: '8px' }}
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombres} {cliente.apellidos} - {cliente.numero_identificacion}
                </option>
              ))}
            </select>
            <button
              onClick={() => setMostrarModalCliente(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
              title="Crear nuevo cliente"
            >
              + Nuevo
            </button>
          </div>
        </div>

        {/* Items del carrito */}
        <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
          {items.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>Carrito vacío</p>
          ) : (
            items.map((item) => (
              <div key={item.producto.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px' }}>{item.producto.nombre}</p>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
                      ${item.producto.precio_unitario.toFixed(2)} (IVA {item.producto.porcentaje_iva}%)
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}>-</button>
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => actualizarCantidad(item.producto.id, Number(e.target.value))}
                      style={{ width: '50px', textAlign: 'center' }}
                      min="1"
                      max={item.producto.stock_actual}
                    />
                    <button onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}>+</button>
                    <button onClick={() => eliminarProducto(item.producto.id)} style={{ color: 'red' }}>×</button>
                  </div>
                </div>
                <p style={{ margin: '4px 0', textAlign: 'right', fontWeight: 'bold' }}>
                  ${item.total.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Método de pago */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Método de Pago:</label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value as any)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        {/* Totales */}
        <div style={{ borderTop: '2px solid #333', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Subtotal:</span>
            <span>${totales.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>IVA:</span>
            <span>${totales.totalIva.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>${totales.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={limpiarCarrito}
            style={{ flex: 1, padding: '12px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            disabled={items.length === 0}
          >
            Limpiar
          </button>
          <button
            onClick={handleRegistrarVenta}
            style={{ flex: 2, padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
            disabled={registrarVentaMutation.isPending || items.length === 0 || !clienteSeleccionado}
          >
            {registrarVentaMutation.isPending ? 'Procesando...' : 'Registrar Venta'}
          </button>
        </div>
      </div>

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
