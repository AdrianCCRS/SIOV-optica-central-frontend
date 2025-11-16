import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { inventarioService, type MovimientoInventario, type CreateMovimientoData } from '../services/inventario.service';
import { productosService, type Producto } from '../services/productos.service';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MovimientosInventarioPage() {
  const queryClient = useQueryClient();
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterTipo, setFilterTipo] = useState<'' | 'Entrada' | 'Salida' | 'Ajuste Inventario' | 'Devolución'>('');
  const [filterProducto, setFilterProducto] = useState<number | ''>('');
  const [formData, setFormData] = useState<{
    tipo_movimiento: 'Entrada' | 'Salida' | 'Ajuste Inventario' | 'Devolución';
    cantidad: string;
    motivo: string;
    fecha: string;
    producto: string;
  }>({
    tipo_movimiento: 'Entrada',
    cantidad: '',
    motivo: '',
    fecha: new Date().toISOString().split('T')[0],
    producto: ''
  });

  useEffect(() => {
    loadData();
  }, [filterTipo, filterProducto]);

  const loadData = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filterTipo) filters.tipo_movimiento = filterTipo;
      if (filterProducto) filters.productoId = filterProducto;
      
      const [movimientosData, productosData] = await Promise.all([
        inventarioService.getAll(filters),
        productosService.getAll()
      ]);
      
      setMovimientos(movimientosData);
      setProductos(productosData);
    } catch (error) {
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.producto) {
      alert('Debe seleccionar un producto');
      return;
    }

    if (!formData.motivo.trim()) {
      alert('Debe ingresar un motivo para el movimiento');
      return;
    }

    try {
      // Obtener el producto seleccionado para conocer su stock actual
      const producto = productos.find(p => p.id === parseInt(formData.producto));
      if (!producto) {
        alert('Producto no encontrado');
        return;
      }

      // Calcular el stock resultante según el tipo de movimiento
      const cantidad = parseInt(formData.cantidad);
      let stockResultante = producto.stock_actual || 0;
      
      if (formData.tipo_movimiento === 'Entrada') {
        stockResultante += cantidad;
      } else if (formData.tipo_movimiento === 'Salida') {
        stockResultante -= cantidad;
        if (stockResultante < 0) {
          alert('Stock insuficiente para realizar esta salida');
          return;
        }
      } else if (formData.tipo_movimiento === 'Ajuste Inventario') {
        // En ajuste, la cantidad es el nuevo stock total
        stockResultante = cantidad;
      } else if (formData.tipo_movimiento === 'Devolución') {
        stockResultante += cantidad;
      }

      const data: CreateMovimientoData = {
        tipo_movimiento: formData.tipo_movimiento,
        cantidad: cantidad,
        motivo: formData.motivo,
        fecha: formData.fecha,
        stock_resultante: stockResultante,
        producto: parseInt(formData.producto)
      };

      await inventarioService.create(data);
      
      // Invalidar la caché de productos con bajo stock para actualizar las alertas en tiempo real
      queryClient.invalidateQueries({ queryKey: ['productos-bajo-stock'] });
      
      setShowModal(false);
      resetForm();
      loadData();
      alert('Movimiento registrado correctamente');
    } catch (error) {
      alert('Error al guardar el movimiento');
    }
  };

  const resetForm = () => {
    setFormData({
      tipo_movimiento: 'Entrada',
      cantidad: '',
      motivo: '',
      fecha: new Date().toISOString().split('T')[0],
      producto: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const getTipoColor = (tipo: string | undefined) => {
    if (!tipo) return '#999';
    switch (tipo) {
      case 'Entrada': return '#4CAF50';
      case 'Salida': return '#f44336';
      case 'Ajuste Inventario': return '#FF9800';
      case 'Devolución': return '#2196F3';
      default: return '#999';
    }
  };

  const getTipoLabel = (tipo: string | undefined) => {
    if (!tipo) return '-';
    switch (tipo) {
      case 'Entrada': return 'ENTRADA';
      case 'Salida': return 'SALIDA';
      case 'Ajuste Inventario': return 'AJUSTE';
      case 'Devolución': return 'DEVOLUCIÓN';
      default: return tipo.toUpperCase();
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando movimientos de inventario..." />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Movimientos de Inventario</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          + Nuevo Movimiento
        </button>
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value as any)}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="">Todos los tipos</option>
          <option value="Entrada">Entrada</option>
          <option value="Salida">Salida</option>
          <option value="Ajuste Inventario">Ajuste Inventario</option>
          <option value="Devolución">Devolución</option>
        </select>
        
        <select
          value={filterProducto}
          onChange={(e) => setFilterProducto(e.target.value ? parseInt(e.target.value) : '')}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '200px',
            flex: '1'
          }}
        >
          <option value="">Todos los productos</option>
          {productos.map(prod => (
            <option key={prod.id} value={prod.id}>
              {prod.referencia} - {prod.nombre}
            </option>
          ))}
        </select>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Fecha</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Producto</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Tipo</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Cantidad</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map(movimiento => (
              <tr key={movimiento.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>
                  {new Date(movimiento.fecha).toLocaleDateString('es-ES')}
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                  {movimiento.producto ? (
                    <>
                      <div>{movimiento.producto.nombre}</div>
                      <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
                        {movimiento.producto.referencia}
                      </div>
                    </>
                  ) : '-'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: getTipoColor(movimiento.tipo_movimiento),
                    color: 'white'
                  }}>
                    {getTipoLabel(movimiento.tipo_movimiento)}
                  </span>
                </td>
                <td style={{ 
                  padding: '12px', 
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: movimiento.tipo_movimiento === 'Entrada' || movimiento.tipo_movimiento === 'Devolución' ? '#4CAF50' : 
                         movimiento.tipo_movimiento === 'Salida' ? '#f44336' : '#FF9800'
                }}>
                  {movimiento.tipo_movimiento === 'Entrada' || movimiento.tipo_movimiento === 'Devolución' ? '+' : 
                   movimiento.tipo_movimiento === 'Salida' ? '-' : ''}
                  {movimiento.cantidad}
                </td>
                <td style={{ padding: '12px' }}>
                  {movimiento.motivo || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {movimientos.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            No hay movimientos registrados
          </div>
        )}
      </div>

      {/* Modal para crear movimiento */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              width: '500px',
              maxWidth: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Nuevo Movimiento de Inventario</h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Producto *
                </label>
                <select
                  value={formData.producto}
                  onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map(prod => (
                    <option key={prod.id} value={prod.id}>
                      {prod.referencia} - {prod.nombre} (Stock: {prod.stock_actual})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Tipo *
                  </label>
                  <select
                    value={formData.tipo_movimiento}
                    onChange={(e) => setFormData({ ...formData, tipo_movimiento: e.target.value as any })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Entrada">Entrada</option>
                    <option value="Salida">Salida</option>
                    <option value="Ajuste Inventario">Ajuste Inventario</option>
                    <option value="Devolución">Devolución</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Fecha *
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Motivo *
                </label>
                <textarea
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  rows={3}
                  required
                  placeholder="Descripción del movimiento..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#999',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
