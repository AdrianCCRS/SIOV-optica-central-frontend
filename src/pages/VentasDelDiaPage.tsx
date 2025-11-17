import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ventasService } from '../services/ventas.service';
import { formatCurrency } from '../utils/format';
import DetalleFacturaModal from '../components/DetalleFacturaModal';
import LoadingSpinner from '../components/LoadingSpinner';
import './styles/VentasDelDiaPage.css';

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
      <div className="error-container">
        <p>Error al cargar ventas: {(error as any).message}</p>
        <button onClick={() => refetch()}>Reintentar</button>
      </div>
    );
  }

  const facturas = data?.facturas || [];
  const totalVentas = data?.total_ventas || 0;
  const cantidadVentas = data?.cantidad_ventas || 0;

  return (
    <div className="ventas-dia-container">
      <div className="ventas-dia-header">
        <h2 className="ventas-dia-title">Ventas del Día</h2>
        <button
          onClick={() => refetch()}
          className="btn-actualizar"
          disabled={isLoading}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={isLoading ? 'spin-reload' : ''}
            style={{ transition: 'transform 0.3s' }}
          >
            <path d="M10 2v2a6 6 0 1 1-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="4 4 10 2 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          Actualizar
        </button>
      </div>

      {/* Resumen */}
      <div className="resumen-grid">
        <div className="resumen-card resumen-card-success">
          <h3 className="resumen-card-title">Total Ventas</h3>
          <p className="resumen-card-value resumen-card-value-success">
            {formatCurrency(totalVentas)}
          </p>
        </div>

        <div className="resumen-card resumen-card-info">
          <h3 className="resumen-card-title">Cantidad de Ventas</h3>
          <p className="resumen-card-value resumen-card-value-info">
            {cantidadVentas}
          </p>
        </div>

        <div className="resumen-card resumen-card-warning">
          <h3 className="resumen-card-title">Promedio por Venta</h3>
          <p className="resumen-card-value resumen-card-value-warning">
            {formatCurrency(cantidadVentas > 0 ? totalVentas / cantidadVentas : 0)}
          </p>
        </div>
      </div>

      {/* Tabla de Facturas */}
      <div className="tabla-section">
        <h3 className="tabla-section-title">Detalle de Facturas</h3>
        {facturas.length === 0 ? (
          <p className="tabla-empty">
            No hay ventas registradas el día de hoy
          </p>
        ) : (
          <table className="facturas-table">
            <thead>
              <tr>
                <th>Factura</th>
                <th>Fecha/Hora</th>
                <th>Cliente</th>
                <th>Método Pago</th>
                <th className="align-right">Subtotal</th>
                <th className="align-right">IVA</th>
                <th className="align-right">Total</th>
                <th className="align-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura: any) => (
                <tr key={factura.id}>
                  <td className="factura-numero">
                    {factura.numero_factura}
                  </td>
                  <td>
                    {new Date(factura.fecha_emision).toLocaleString('es-CO', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td>
                    {factura.cliente?.nombres} {factura.cliente?.apellidos}
                    <span className="cliente-identificacion">
                      {factura.cliente?.numero_identificacion}
                    </span>
                  </td>
                  <td>{factura.medio_pago}</td>
                  <td className="align-right">
                    {formatCurrency(factura.subtotal)}
                  </td>
                  <td className="align-right">
                    {formatCurrency(factura.valor_iva)}
                  </td>
                  <td className="align-right total-value">
                    {formatCurrency(factura.total)}
                  </td>
                  <td className="align-center">
                    <button
                      onClick={() => setFacturaSeleccionada({ id: factura.id, numero: factura.numero_factura })}
                      className="btn-ver-detalles"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="total-label">
                  TOTALES:
                </td>
                <td className="align-right">
                  {formatCurrency(facturas.reduce((sum: number, f: any) => sum + (f.subtotal || 0), 0))}
                </td>
                <td className="align-right">
                  {formatCurrency(facturas.reduce((sum: number, f: any) => sum + (f.valor_iva || 0), 0))}
                </td>
                <td className="align-right total-final">
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

// Animación de rotación para el icono de recargar
const style = document.createElement('style');
style.innerHTML = `
.spin-reload {
  animation: spin-reload 1s linear infinite;
}
@keyframes spin-reload {
  100% { transform: rotate(360deg); }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('spin-reload-style')) {
  style.id = 'spin-reload-style';
  document.head.appendChild(style);
}
