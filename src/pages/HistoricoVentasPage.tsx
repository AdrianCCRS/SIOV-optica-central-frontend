import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ventasService, type BuscarFacturasParams } from '../services/ventas.service';
import { formatCurrency } from '../utils/format';
import DetalleFacturaModal from '../components/DetalleFacturaModal';
import LoadingSpinner from '../components/LoadingSpinner';
import './styles/HistoricoVentasPage.css';

export const HistoricoVentasPage = () => {
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<number | null>(null);
  const [filtros, setFiltros] = useState<BuscarFacturasParams>({
    fechaInicio: '',
    fechaFin: '',
    numeroFactura: '',
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState<BuscarFacturasParams>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['historico-ventas', filtrosAplicados],
    queryFn: () => ventasService.buscarFacturas(filtrosAplicados),
    enabled: Object.keys(filtrosAplicados).length > 0,
  });

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    const filtrosValidos: BuscarFacturasParams = {};
    
    if (filtros.fechaInicio) filtrosValidos.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) filtrosValidos.fechaFin = filtros.fechaFin;
    if (filtros.numeroFactura) filtrosValidos.numeroFactura = filtros.numeroFactura;
    
    setFiltrosAplicados(filtrosValidos);
  };

  const handleLimpiar = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      numeroFactura: '',
    });
    setFiltrosAplicados({});
  };

  return (
    <div className="historico-container">
      <div className="historico-inner">
        <h1 className="historico-title">
          Histórico de Ventas
        </h1>

        {/* Formulario de búsqueda */}
        <div className="filtros-card">
          <h2 className="filtros-title">
            Filtros de Búsqueda
          </h2>
          <form onSubmit={handleBuscar}>
            <div className="filtros-grid">
              <div className="filtro-field">
                <label>
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                />
              </div>

              <div className="filtro-field">
                <label>
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                />
              </div>

              <div className="filtro-field">
                <label>
                  Número de Factura
                </label>
                <input
                  type="text"
                  value={filtros.numeroFactura}
                  onChange={(e) => setFiltros({ ...filtros, numeroFactura: e.target.value })}
                  placeholder="Ej: FAC-2024-001"
                />
              </div>
            </div>

            <div className="filtros-actions">
              <button
                type="button"
                onClick={handleLimpiar}
                className="btn-limpiar"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="btn-buscar"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Resultados */}
        {isLoading && <LoadingSpinner message="Buscando facturas..." />}

        {error && (
          <div className="error-alert">
            <p className="error-alert-title">
              Error al cargar datos
            </p>
            <p className="error-alert-message">
              No se pudieron cargar las facturas. Por favor, intente nuevamente.
            </p>
          </div>
        )}

        {data && (
          <>
            {/* Resumen */}
            <div className="resumen-grid">
              <div className="resumen-card">
                <div className="resumen-card-gradient-primary"></div>
                <p className="resumen-card-label">
                  Total de Facturas
                </p>
                <p className="resumen-card-value resumen-card-value-primary">
                  {data.resumen.cantidad}
                </p>
              </div>
              <div className="resumen-card">
                <div className="resumen-card-gradient-success"></div>
                <p className="resumen-card-label">
                  Total en Ventas
                </p>
                <p className="resumen-card-value resumen-card-value-success">
                  {formatCurrency(data.resumen.total_ventas)}
                </p>
              </div>
            </div>

            {/* Tabla de facturas */}
            <div className="tabla-container">
              {data.facturas.length === 0 ? (
                <div className="tabla-empty-state">
                  <p>
                    No se encontraron facturas con los filtros aplicados
                  </p>
                </div>
              ) : (
                <div className="tabla-scroll">
                  <table className="historico-table">
                    <thead>
                      <tr>
                        <th>Factura</th>
                        <th>Fecha y Hora</th>
                        <th>Cliente</th>
                        <th>Usuario</th>
                        <th>Medio de Pago</th>
                        <th className="align-right">Total</th>
                        <th className="align-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.facturas.map((factura) => (
                        <tr key={factura.id}>
                          <td>
                            <span className="factura-badge">
                              {factura.numero_factura}
                            </span>
                          </td>
                          <td className="fecha-cell">
                            {new Date(factura.fecha_emision).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="cliente-name">
                            {factura.cliente
                              ? `${factura.cliente.nombres} ${factura.cliente.apellidos}`
                              : <span className="na-text">N/A</span>}
                          </td>
                          <td className="usuario-name">
                            {factura.user
                              ? factura.user.nombres && factura.user.apellidos
                                ? `${factura.user.nombres} ${factura.user.apellidos}`
                                : factura.user.username
                              : <span className="na-text">N/A</span>}
                          </td>
                          <td>
                            <span className="pago-badge">
                              {factura.medio_pago}
                            </span>
                          </td>
                          <td className="total-cell">
                            {formatCurrency(factura.total)}
                          </td>
                          <td className="align-center">
                            <button
                              onClick={() => setFacturaSeleccionada(factura.id)}
                              className="btn-ver-detalle"
                            >
                              Ver Detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {!data && Object.keys(filtrosAplicados).length === 0 && (
          <div className="info-alert">
            <p className="info-alert-title">
              Búsqueda de Facturas
            </p>
            <p className="info-alert-message">
              Seleccione al menos un filtro y presione "Buscar" para ver los resultados
            </p>
          </div>
        )}

        {/* Modal de detalle */}
        {facturaSeleccionada && (
          <DetalleFacturaModal
            facturaId={facturaSeleccionada}
            numeroFactura={
              data?.facturas.find((f) => f.id === facturaSeleccionada)?.numero_factura || ''
            }
            onClose={() => setFacturaSeleccionada(null)}
          />
        )}
      </div>
    </div>
  );
};
