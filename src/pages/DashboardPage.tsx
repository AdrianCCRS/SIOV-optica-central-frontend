import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { reportesService } from '../services/reportes.service';
import type { 
  VentasDiarias, VentasPorCategoria, VentasPorMetodoPago, 
  ProductoMasVendido, StockPorCategoria, ProductoBajoStock, IVAGenerado,
  KPIMetricas, TopCliente, RendimientoCajero
} from '../services/reportes.service';
import './DashboardPage.css';

type PeriodoVentas = 'dia' | 'semana' | 'mes';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

export default function DashboardPage() {
  const [periodo, setPeriodo] = useState<PeriodoVentas>('dia');
  const [loading, setLoading] = useState(true);
  
  // Estados existentes
  const [ventasDiarias, setVentasDiarias] = useState<VentasDiarias[]>([]);
  const [ventasPorCategoria, setVentasPorCategoria] = useState<VentasPorCategoria[]>([]);
  const [ventasPorMetodoPago, setVentasPorMetodoPago] = useState<VentasPorMetodoPago[]>([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState<ProductoMasVendido[]>([]);
  const [stockPorCategoria, setStockPorCategoria] = useState<StockPorCategoria[]>([]);
  const [productosBajoStock, setProductosBajoStock] = useState<ProductoBajoStock[]>([]);
  const [ivaGenerado, setIvaGenerado] = useState<IVAGenerado | null>(null);
  
  // Nuevos estados para Fase 1
  const [kpis, setKpis] = useState<KPIMetricas | null>(null);
  const [topClientes, setTopClientes] = useState<TopCliente[]>([]);
  const [rendimientoCajeros, setRendimientoCajeros] = useState<RendimientoCajero[]>([]);

  const getFechas = (periodo: PeriodoVentas) => {
    const hoy = new Date();
    let fechaInicio: Date;
    let fechaFin: Date = hoy;

    switch (periodo) {
      case 'dia':
        fechaInicio = hoy;
        break;
      case 'semana':
        fechaInicio = startOfWeek(hoy, { weekStartsOn: 1 });
        fechaFin = endOfWeek(hoy, { weekStartsOn: 1 });
        break;
      case 'mes':
        fechaInicio = startOfMonth(hoy);
        fechaFin = endOfMonth(hoy);
        break;
      default:
        fechaInicio = hoy;
    }

    return {
      fechaInicio: format(fechaInicio, 'yyyy-MM-dd'),
      fechaFin: format(fechaFin, 'yyyy-MM-dd')
    };
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { fechaInicio, fechaFin } = getFechas(periodo);
      
      const [ventas, categorias, metodosPago, topProductos, stock, bajoStock, iva, kpisData, clientes, cajeros] = await Promise.all([
        reportesService.getVentasDiarias(fechaInicio, fechaFin),
        reportesService.getVentasPorCategoria(fechaInicio, fechaFin),
        reportesService.getVentasPorMetodoPago(fechaInicio, fechaFin),
        reportesService.getProductosMasVendidos(fechaInicio, fechaFin),
        reportesService.getStockPorCategoria(),
        reportesService.getProductosBajoStock(),
        reportesService.getIVAGenerado(fechaInicio, fechaFin),
        reportesService.getKPIMetricas(fechaInicio, fechaFin, true),
        reportesService.getTopClientes(fechaInicio, fechaFin, 10),
        reportesService.getRendimientoCajeros(fechaInicio, fechaFin)
      ]);

      setVentasDiarias(ventas);
      setVentasPorCategoria(categorias);
      setVentasPorMetodoPago(metodosPago);
      setProductosMasVendidos(topProductos);
      setStockPorCategoria(stock);
      setProductosBajoStock(bajoStock);
      setIvaGenerado(iva);
      setKpis(kpisData);
      setTopClientes(clientes);
      setRendimientoCajeros(cajeros);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [periodo]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry: any, index: number) => {
            const entryName = String(entry.name || '');
            const shouldFormatCurrency = typeof entry.value === 'number' && 
              (entryName.toLowerCase().includes('total') || entryName.toLowerCase().includes('ventas'));
            
            return (
              <p key={index} className="tooltip-item" style={{ color: entry.color }}>
                {entryName}: {shouldFormatCurrency ? formatCurrency(entry.value) : entry.value}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-title">Cargando dashboard...</p>
          <p className="loading-subtitle">Procesando datos analíticos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard Analítico</h1>
            <p className="dashboard-subtitle">Vista general de métricas y estadísticas empresariales</p>
          </div>
          
          {/* Selector de periodo */}
          <div className="period-selector">
            {(['dia', 'semana', 'mes'] as PeriodoVentas[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`period-button ${periodo === p ? 'period-button-active' : ''}`}
              >
                {p === 'dia' ? 'Hoy' : p === 'semana' ? 'Esta Semana' : 'Este Mes'}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        {kpis && (
          <div className="kpi-container">
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-icon">💰</span>
                <span className="kpi-label">Ventas Totales</span>
              </div>
              <div className="kpi-value">{formatCurrency(kpis.ventas_total)}</div>
              {kpis.comparativa_anterior && (
                <div className={`kpi-change ${kpis.comparativa_anterior.ventas_cambio >= 0 ? 'kpi-change-positive' : 'kpi-change-negative'}`}>
                  {kpis.comparativa_anterior.ventas_cambio >= 0 ? '↑' : '↓'} 
                  {Math.abs(kpis.comparativa_anterior.ventas_cambio).toFixed(1)}% vs periodo anterior
                </div>
              )}
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-icon">🧾</span>
                <span className="kpi-label">Ticket Promedio</span>
              </div>
              <div className="kpi-value">{formatCurrency(kpis.ticket_promedio)}</div>
              {kpis.comparativa_anterior && (
                <div className={`kpi-change ${kpis.comparativa_anterior.ticket_cambio >= 0 ? 'kpi-change-positive' : 'kpi-change-negative'}`}>
                  {kpis.comparativa_anterior.ticket_cambio >= 0 ? '↑' : '↓'} 
                  {Math.abs(kpis.comparativa_anterior.ticket_cambio).toFixed(1)}% vs periodo anterior
                </div>
              )}
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-icon">📋</span>
                <span className="kpi-label">Facturas</span>
              </div>
              <div className="kpi-value">{kpis.cantidad_facturas}</div>
              {kpis.comparativa_anterior && (
                <div className={`kpi-change ${kpis.comparativa_anterior.facturas_cambio >= 0 ? 'kpi-change-positive' : 'kpi-change-negative'}`}>
                  {kpis.comparativa_anterior.facturas_cambio >= 0 ? '↑' : '↓'} 
                  {Math.abs(kpis.comparativa_anterior.facturas_cambio).toFixed(1)}% vs periodo anterior
                </div>
              )}
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-icon">👥</span>
                <span className="kpi-label">Clientes Atendidos</span>
              </div>
              <div className="kpi-value">{kpis.clientes_unicos}</div>
              {kpis.comparativa_anterior && (
                <div className={`kpi-change ${kpis.comparativa_anterior.clientes_cambio >= 0 ? 'kpi-change-positive' : 'kpi-change-negative'}`}>
                  {kpis.comparativa_anterior.clientes_cambio >= 0 ? '↑' : '↓'} 
                  {Math.abs(kpis.comparativa_anterior.clientes_cambio).toFixed(1)}% vs periodo anterior
                </div>
              )}
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-icon">📦</span>
                <span className="kpi-label">Productos Vendidos</span>
              </div>
              <div className="kpi-value">{kpis.productos_vendidos}</div>
              <div className="kpi-subtitle">Unidades totales</div>
            </div>
          </div>
        )}

        {/* Bento Grid */}
        <div className="bento-grid">
          {/* 1. Ventas Diarias */}
          <div className="bento-card bento-large">
            <div className="card-header">
              <h3>Tendencia de Ventas</h3>
              <p>Evolución temporal del periodo seleccionado</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={ventasDiarias} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 500 }}
                  tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                  stroke="#D1D5DB"
                />
                <YAxis tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 500 }} stroke="#D1D5DB" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#0088FE" 
                  strokeWidth={4}
                  name="Total Ventas"
                  dot={{ fill: '#0088FE', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#0066CC' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cantidad_facturas" 
                  stroke="#00C49F" 
                  strokeWidth={3}
                  name="Núm. Facturas"
                  dot={{ fill: '#00C49F', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 2. Ventas por Categoría */}
          <div className="bento-card bento-medium-tall">
            <div className="card-header">
              <h3>Ventas por Categoría</h3>
              <p>Distribución por tipo de producto</p>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={ventasPorCategoria} layout="vertical" margin={{ top: 10, right: 30, left: 110, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 500 }} stroke="#D1D5DB" />
                <YAxis 
                  dataKey="categoria" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }} 
                  stroke="#D1D5DB" 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" fill="#00C49F" name="Total Ventas" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 3. Métodos de Pago */}
          <div className="bento-card bento-medium">
            <div className="card-header">
              <h3>Métodos de Pago</h3>
              <p>Preferencias de pago</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ventasPorMetodoPago as any}
                  dataKey="total"
                  nameKey="metodo_pago"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry: any) => `${((entry.percent || 0) * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                >
                  {ventasPorMetodoPago.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 4. Stock por Categoría */}
          <div className="bento-card bento-medium">
            <div className="card-header">
              <h3>Inventario</h3>
              <p>Stock por categoría</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockPorCategoria} margin={{ top: 10, right: 20, left: 10, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="categoria" 
                  tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  stroke="#D1D5DB"
                />
                <YAxis tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 500 }} stroke="#D1D5DB" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cantidad" fill="#8884D8" name="Stock Total" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 5. Análisis IVA */}
          {ivaGenerado && (
            <div className="bento-card bento-wide">
              <div className="card-header">
                <h3>Análisis de IVA</h3>
                <p>Desglose de impuestos generados</p>
              </div>
              <div className="iva-grid">
                <div className="iva-stats">
                  <div className="stat-box stat-primary">
                    <p className="stat-label">Ventas Totales</p>
                    <p className="stat-value">{formatCurrency(ivaGenerado.total_ventas)}</p>
                  </div>
                  <div className="stat-box stat-success">
                    <p className="stat-label">Total IVA Recaudado</p>
                    <p className="stat-value stat-value-green">{formatCurrency(ivaGenerado.total_iva)}</p>
                  </div>
                  <div className="stat-box stat-info">
                    <p className="stat-label">Ventas sin IVA</p>
                    <p className="stat-value stat-value-blue">{formatCurrency(ivaGenerado.total_sin_iva)}</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={ivaGenerado.desglose_iva}
                      dataKey="total"
                      nameKey="tasa"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      label={(entry: any) => `${entry.tasa}%`}
                      labelLine={{ stroke: '#6B7280' }}
                    >
                      {ivaGenerado.desglose_iva.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 6. Top Productos */}
          <div className="bento-card bento-medium-tall">
            <div className="card-header">
              <h3>Top Productos</h3>
              <p>Los 10 más vendidos</p>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Producto</th>
                    <th style={{ textAlign: 'right' }}>Cant</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {productosMasVendidos.map((producto, index) => (
                    <tr key={index}>
                      <td>
                        <span className={`position-badge position-${index + 1}`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="product-name">{producto.nombre}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="quantity-badge">{producto.cantidad}</span>
                      </td>
                      <td className="product-total">{formatCurrency(producto.total)}</td>
                    </tr>
                  ))}
                  {productosMasVendidos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="empty-state">
                        <p className="empty-title">No hay datos</p>
                        <p className="empty-subtitle">Aún no hay ventas registradas</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. Alertas de Stock */}
          <div className="bento-card bento-medium">
            <div className="card-header">
              <h3>Alertas de Stock</h3>
              <p>Productos bajo mínimo</p>
            </div>
            <div className="table-container table-container-small">
              <table className="data-table stock-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style={{ textAlign: 'center' }}>Actual</th>
                    <th style={{ textAlign: 'center' }}>Mínimo</th>
                  </tr>
                </thead>
                <tbody>
                  {productosBajoStock.map((producto, index) => (
                    <tr key={index}>
                      <td className="product-name">{producto.nombre}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="stock-badge stock-low">{producto.stock_actual}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="stock-min">{producto.stock_minimo}</span>
                      </td>
                    </tr>
                  ))}
                  {productosBajoStock.length === 0 && (
                    <tr>
                      <td colSpan={3} className="empty-state">
                        <p className="empty-title stock-ok">¡Todo en orden!</p>
                        <p className="empty-subtitle">Todos los productos tienen stock suficiente</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 8. Top Clientes */}
          <div className="bento-card bento-large">
            <div className="card-header">
              <h3>Top Clientes del Periodo</h3>
              <p>Los clientes con mayor volumen de compras</p>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ranking</th>
                    <th>Cliente</th>
                    <th>Identificación</th>
                    <th style={{ textAlign: 'right' }}>Compras</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th style={{ textAlign: 'right' }}>Ticket Prom.</th>
                    <th>Última Compra</th>
                  </tr>
                </thead>
                <tbody>
                  {topClientes.map((cliente, index) => (
                    <tr key={cliente.cliente_id}>
                      <td>
                        <span className={`position-badge position-${index + 1}`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="product-name">{cliente.nombre_completo}</td>
                      <td>{cliente.numero_identificacion}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="quantity-badge">{cliente.numero_compras}</span>
                      </td>
                      <td className="product-total">{formatCurrency(cliente.total_comprado)}</td>
                      <td style={{ textAlign: 'right', color: '#6B7280', fontWeight: 600 }}>
                        {formatCurrency(cliente.ticket_promedio)}
                      </td>
                      <td style={{ fontSize: '13px', color: '#6B7280' }}>{cliente.ultima_compra}</td>
                    </tr>
                  ))}
                  {topClientes.length === 0 && (
                    <tr>
                      <td colSpan={7} className="empty-state">
                        <p className="empty-title">No hay datos</p>
                        <p className="empty-subtitle">Aún no hay compras registradas en este periodo</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 9. Rendimiento Cajeros */}
          <div className="bento-card bento-large">
            <div className="card-header">
              <h3>Rendimiento por Cajero</h3>
              <p>Desempeño del equipo de ventas</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rendimientoCajeros} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="nombre_completo" 
                  tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }} 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="#D1D5DB"
                />
                <YAxis tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 500 }} stroke="#D1D5DB" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                <Bar dataKey="total_vendido" fill="#8884D8" name="Total Vendido" radius={[10, 10, 0, 0]} />
                <Bar dataKey="ventas_realizadas" fill="#82CA9D" name="Núm. Ventas" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="table-container" style={{ marginTop: '20px' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cajero</th>
                    <th style={{ textAlign: 'right' }}>Ventas</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th style={{ textAlign: 'right' }}>Ticket Prom.</th>
                    <th style={{ textAlign: 'right' }}>% del Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rendimientoCajeros.map((cajero) => (
                    <tr key={cajero.usuario_id}>
                      <td className="product-name">{cajero.nombre_completo}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="quantity-badge">{cajero.ventas_realizadas}</span>
                      </td>
                      <td className="product-total">{formatCurrency(cajero.total_vendido)}</td>
                      <td style={{ textAlign: 'right', color: '#6B7280', fontWeight: 600 }}>
                        {formatCurrency(cajero.ticket_promedio)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: 'linear-gradient(to right, #DBEAFE, #BFDBFE)',
                          color: '#1E40AF',
                          fontWeight: 700,
                          fontSize: '13px'
                        }}>
                          {cajero.porcentaje_total.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {rendimientoCajeros.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty-state">
                        <p className="empty-title">No hay datos</p>
                        <p className="empty-subtitle">Aún no hay ventas registradas en este periodo</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
