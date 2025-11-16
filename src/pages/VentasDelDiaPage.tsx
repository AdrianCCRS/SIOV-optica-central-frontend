import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ventasService } from '../services/ventas.service';
import { formatCurrency } from '../utils/format';
import DetalleFacturaModal from '../components/DetalleFacturaModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function VentasDelDiaPage() {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<{ id: number; numero: string } | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['ventas-del-dia'],
    queryFn: ventasService.obtenerVentasDelDia,
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  if (isLoading) {
    return <LoadingSpinner message="Cargando ventas del día..." />;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>Error al cargar ventas: {(error as any).message}</p>
        <button onClick={() => refetch()}>Reintentar</button>
      </div>
    );
  }

  const facturas = data?.facturas || [];
  const totalVentas = data?.total_ventas || 0;
  const cantidadVentas = data?.cantidad_ventas || 0;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Ventas del Día</h2>
        <button
          onClick={() => refetch()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Actualizar
        </button>
      </div>

      {/* Resumen */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '2px solid #4CAF50',
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#666' }}>Total Ventas</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#4CAF50' }}>
            {formatCurrency(totalVentas)}
          </p>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '2px solid #2196F3',
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#666' }}>Cantidad de Ventas</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#2196F3' }}>
            {cantidadVentas}
          </p>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '2px solid #FF9800',
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#666' }}>Promedio por Venta</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#FF9800' }}>
            {formatCurrency(cantidadVentas > 0 ? totalVentas / cantidadVentas : 0)}
          </p>
        </div>
      </div>

      {/* Tabla de Facturas */}
      <div style={{ overflowX: 'auto' }}>
        <h3 style={{ marginBottom: '15px' }}>Detalle de Facturas</h3>
        {facturas.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
            No hay ventas registradas el día de hoy
          </p>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Factura</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha/Hora</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Método Pago</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Subtotal</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>IVA</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura: any) => (
                <tr key={factura.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    {factura.numero_factura}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {new Date(factura.fecha_emision).toLocaleString('es-CO', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {factura.cliente?.nombres} {factura.cliente?.apellidos}
                    <br />
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {factura.cliente?.numero_identificacion}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{factura.medio_pago}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {formatCurrency(factura.subtotal)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {formatCurrency(factura.valor_iva)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>
                    {formatCurrency(factura.total)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => setFacturaSeleccionada({ id: factura.id, numero: factura.numero_factura })}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold', borderTop: '2px solid #ddd' }}>
                <td colSpan={4} style={{ padding: '12px', textAlign: 'right' }}>
                  TOTALES:
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {formatCurrency(facturas.reduce((sum: number, f: any) => sum + (f.subtotal || 0), 0))}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {formatCurrency(facturas.reduce((sum: number, f: any) => sum + (f.valor_iva || 0), 0))}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontSize: '18px' }}>
                  {formatCurrency(totalVentas)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Modal de Detalle de Factura */}
      {facturaSeleccionada && (
        <DetalleFacturaModal
          facturaId={facturaSeleccionada.id}
          numeroFactura={facturaSeleccionada.numero}
          onClose={() => setFacturaSeleccionada(null)}
        />
      )}
    </div>
  );
}
