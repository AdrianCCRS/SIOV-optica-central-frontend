import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ventasService, type BuscarFacturasParams } from '../services/ventas.service';
import { formatCurrency } from '../utils/format';
import DetalleFacturaModal from '../components/DetalleFacturaModal';

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
    <div style={{ 
      padding: '32px', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          marginBottom: '32px', 
          color: '#1a202c',
          letterSpacing: '-0.5px',
        }}>
          Histórico de Ventas
        </h1>

        {/* Formulario de búsqueda */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          padding: '28px',
          marginBottom: '28px',
          border: '1px solid #e2e8f0',
        }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: '600', 
            marginBottom: '20px', 
            color: '#2d3748',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Filtros de Búsqueda
          </h2>
          <form onSubmit={handleBuscar}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '24px',
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}>
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#4CAF50'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}>
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#4CAF50'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}>
                  Número de Factura
                </label>
                <input
                  type="text"
                  value={filtros.numeroFactura}
                  onChange={(e) => setFiltros({ ...filtros, numeroFactura: e.target.value })}
                  placeholder="Ej: FAC-2024-001"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#4CAF50'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleLimpiar}
                style={{
                  padding: '12px 28px',
                  backgroundColor: 'white',
                  color: '#4a5568',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f7fafc';
                  e.currentTarget.style.borderColor = '#cbd5e0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                Limpiar
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(76, 175, 80, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#45a049';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4CAF50';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(76, 175, 80, 0.2)';
                }}
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Resultados */}
        {isLoading && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: '64px',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
          }}>
            <p style={{ fontSize: '15px', color: '#718096', fontWeight: '500' }}>
              Buscando facturas...
            </p>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fff5f5',
            border: '1px solid #fc8181',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '28px',
          }}>
            <p style={{ fontWeight: '700', color: '#c53030', marginBottom: '6px', fontSize: '14px' }}>
              Error al cargar datos
            </p>
            <p style={{ color: '#e53e3e', fontSize: '14px' }}>
              No se pudieron cargar las facturas. Por favor, intente nuevamente.
            </p>
          </div>
        )}

        {data && (
          <>
            {/* Resumen */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '28px',
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                padding: '28px',
                border: '1px solid #e2e8f0',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                }}></div>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#718096', 
                  marginBottom: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Total de Facturas
                </p>
                <p style={{ 
                  fontSize: '36px', 
                  fontWeight: '700', 
                  color: '#667eea',
                  lineHeight: '1',
                }}>
                  {data.resumen.cantidad}
                </p>
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                padding: '28px',
                border: '1px solid #e2e8f0',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)',
                }}></div>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#718096', 
                  marginBottom: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Total en Ventas
                </p>
                <p style={{ 
                  fontSize: '36px', 
                  fontWeight: '700', 
                  color: '#4CAF50',
                  lineHeight: '1',
                }}>
                  {formatCurrency(data.resumen.total_ventas)}
                </p>
              </div>
            </div>

            {/* Tabla de facturas */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}>
              {data.facturas.length === 0 ? (
                <div style={{ 
                  padding: '64px', 
                  textAlign: 'center', 
                  color: '#a0aec0',
                }}>
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>
                    No se encontraron facturas con los filtros aplicados
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ 
                        background: 'linear-gradient(to right, #f7fafc, #edf2f7)',
                        borderBottom: '2px solid #e2e8f0',
                      }}>
                        <th style={{
                          padding: '16px 20px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#4a5568',
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                        }}>
                          Factura
                        </th>
                        <th style={{
                          padding: '16px 20px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#4a5568',
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                        }}>
                          Fecha y Hora
                        </th>
                        <th style={{
                          padding: '16px 20px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#4a5568',
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                        }}>
                          Cliente
                        </th>
                        <th style={{
                          padding: '16px 20px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#4a5568',
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                        }}>
                          Usuario
                        </th>
                        <th style={{
                          padding: '16px 20px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#4a5568',
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                        }}>
                          Medio de Pago
                        </th>
                        <th style={{
                          padding: '16px 20px',
                          textAlign: 'right',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#4a5568',
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                        }}>
                          Total
                        </th>
                        <th style={{
                          padding: '16px 20px',
                          textAlign: 'center',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#4a5568',
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                        }}>
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.facturas.map((factura, index) => (
                        <tr
                          key={factura.id}
                          style={{ 
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafbfc';
                          }}
                        >
                          <td style={{
                            padding: '18px 20px',
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#2d3748',
                          }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              backgroundColor: '#edf2f7',
                              borderRadius: '6px',
                              fontSize: '13px',
                              color: '#4a5568',
                            }}>
                              {factura.numero_factura}
                            </span>
                          </td>
                          <td style={{
                            padding: '18px 20px',
                            fontSize: '14px',
                            color: '#718096',
                          }}>
                            {new Date(factura.fecha_emision).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td style={{
                            padding: '18px 20px',
                            fontSize: '14px',
                            color: '#2d3748',
                            fontWeight: '500',
                          }}>
                            {factura.cliente
                              ? `${factura.cliente.nombres} ${factura.cliente.apellidos}`
                              : <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>N/A</span>}
                          </td>
                          <td style={{
                            padding: '18px 20px',
                            fontSize: '14px',
                            color: '#718096',
                          }}>
                            {factura.user
                              ? factura.user.nombres && factura.user.apellidos
                                ? `${factura.user.nombres} ${factura.user.apellidos}`
                                : factura.user.username
                              : <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>N/A</span>}
                          </td>
                          <td style={{
                            padding: '18px 20px',
                            fontSize: '14px',
                          }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              backgroundColor: '#e6f7ff',
                              color: '#0066cc',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: '600',
                            }}>
                              {factura.medio_pago}
                            </span>
                          </td>
                          <td style={{
                            padding: '18px 20px',
                            fontSize: '16px',
                            fontWeight: '700',
                            textAlign: 'right',
                            color: '#2d3748',
                          }}>
                            {formatCurrency(factura.total)}
                          </td>
                          <td style={{
                            padding: '18px 20px',
                            textAlign: 'center',
                          }}>
                            <button
                              onClick={() => setFacturaSeleccionada(factura.id)}
                              style={{
                                padding: '10px 20px',
                                backgroundColor: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#5a67d8';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#667eea';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
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
          <div style={{
            backgroundColor: '#ebf8ff',
            border: '1px solid #90cdf4',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '16px', color: '#2c5282', fontWeight: '600', marginBottom: '8px' }}>
              Búsqueda de Facturas
            </p>
            <p style={{ fontSize: '14px', color: '#4299e1' }}>
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
