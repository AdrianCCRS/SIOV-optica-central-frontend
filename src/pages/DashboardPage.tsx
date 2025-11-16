import { useQuery } from '@tanstack/react-query';
import { statsService } from '../services/stats.service';
import { formatCurrency } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['estadisticas-generales'],
    queryFn: () => statsService.getEstadisticasGenerales(),
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });

  const { data: ventasPorDia } = useQuery({
    queryKey: ['ventas-por-dia'],
    queryFn: () => statsService.getVentasPorDia(7),
    refetchInterval: 60000, // Refrescar cada minuto
  });

  if (isLoading || !stats) {
    return <LoadingSpinner message="Cargando estadísticas..." size="lg" />;
  }

  return (
    <div style={{ padding: '32px', backgroundColor: '#f8f9fa', minHeight: '100%' }}>
      <h1 style={{ margin: '0 0 32px 0', color: '#333', fontSize: '28px' }}>
        Dashboard - Panel de Administración
      </h1>

      {/* Cards de resumen */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {/* Ventas de Hoy */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            Ventas del Día
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '4px' }}>
            {formatCurrency(stats.ventasHoy.total)}
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {stats.ventasHoy.cantidad} transacción{stats.ventasHoy.cantidad !== 1 ? 'es' : ''}
          </div>
        </div>

        {/* Ventas del Mes */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            Ventas del Mes
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2196F3', marginBottom: '4px' }}>
            {formatCurrency(stats.ventasMes.total)}
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {stats.ventasMes.cantidad} transacción{stats.ventasMes.cantidad !== 1 ? 'es' : ''}
          </div>
        </div>

        {/* Productos Activos */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            Productos Activos
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#673AB7', marginBottom: '4px' }}>
            {stats.totalProductos}
          </div>
          <div style={{ fontSize: '12px', color: stats.productosConBajoStock > 0 ? '#ff9800' : '#999' }}>
            {stats.productosConBajoStock} con bajo stock
          </div>
        </div>

        {/* Total Clientes */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            Clientes Registrados
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF5722', marginBottom: '4px' }}>
            {stats.totalClientes}
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            Total en el sistema
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {/* Top Productos por Ventas */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#333' }}>
            Top 5 Productos por Ventas
          </h2>
          {stats.ventasPorProducto.length === 0 ? (
            <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              No hay datos de ventas disponibles
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.ventasPorProducto.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                      {item.producto}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {item.cantidad} unidades vendidas
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#4CAF50', fontSize: '16px' }}>
                    {formatCurrency(item.total)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ventas por Día (últimos 7 días) */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#333' }}>
            Ventas de los Últimos 7 Días
          </h2>
          {!ventasPorDia || ventasPorDia.length === 0 ? (
            <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              No hay datos de ventas disponibles
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ventasPorDia.map((item, index) => {
                const fecha = new Date(item.fecha + 'T00:00:00');
                const fechaFormateada = fecha.toLocaleDateString('es-CO', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                });
                
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '6px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                        {fechaFormateada}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {item.cantidad} venta{item.cantidad !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#2196F3', fontSize: '16px' }}>
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Alertas y Avisos */}
      {stats.productosConBajoStock > 0 && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#856404', marginBottom: '4px' }}>
                Alerta de Inventario
              </div>
              <div style={{ color: '#856404', fontSize: '14px' }}>
                Hay {stats.productosConBajoStock} producto{stats.productosConBajoStock !== 1 ? 's' : ''} con stock bajo el mínimo.
                Revisa el inventario para realizar reposición.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
