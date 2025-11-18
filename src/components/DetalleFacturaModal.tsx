import { useQuery } from '@tanstack/react-query';
import { ventasService } from '../services/ventas.service';
import { formatCurrency } from '../utils/format';

interface DetalleFacturaModalProps {
  facturaId: number;
  numeroFactura: string;
  onClose: () => void;
}

export default function DetalleFacturaModal({ facturaId, numeroFactura, onClose }: DetalleFacturaModalProps) {
  const { data: factura, isLoading } = useQuery({
    queryKey: ['factura', facturaId],
    queryFn: () => ventasService.obtenerFactura(facturaId),
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Detalle de Factura {numeroFactura}</h2>
          <button
            onClick={onClose}
            style={{
              fontSize: '24px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
            }}
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Cargando detalles...</p>
        ) : !factura ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Error al cargar la factura</p>
        ) : (
          <>
            {/* Información General */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: 'var(--color-bg-primary)',
              borderRadius: '4px',
            }}>
              <div>
                <strong>Cliente:</strong>
                <div>{factura.cliente?.nombres} {factura.cliente?.apellidos}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {factura.cliente?.tipo_identificacion}: {factura.cliente?.numero_identificacion}
                </div>
              </div>
              <div>
                <strong>Fecha y Hora:</strong>
                <div>
                  {new Date(factura.fecha_emision).toLocaleString('es-CO', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </div>
              </div>
              <div>
                <strong>Método de Pago:</strong>
                <div>{factura.medio_pago}</div>
              </div>
              <div>
                <strong>Atendido por:</strong>
                <div>{factura.user?.nombres} {factura.user?.apellidos}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{factura.user?.username}</div>
              </div>
            </div>

            {/* Tabla de Productos */}
            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Productos</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Producto</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Cant.</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>P. Unit.</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>IVA %</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Valor IVA</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {factura.detalles?.map((detalle: any) => (
                  <tr key={detalle.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 'bold' }}>{detalle.producto?.nombre}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Ref: {detalle.producto?.referencia}
                      </div>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{detalle.cantidad}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      {formatCurrency(detalle.precio_unitario)}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>{detalle.porcentaje_iva}%</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      {formatCurrency(detalle.valor_iva)}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                      {formatCurrency(detalle.valor_total_linea)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totales */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '2px solid #ddd',
            }}>
              <div style={{ width: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Subtotal:</span>
                  <span>{formatCurrency(factura.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Total IVA:</span>
                  <span>{formatCurrency(factura.valor_iva)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  paddingTop: '12px',
                  borderTop: '2px solid #333',
                }}>
                  <span>TOTAL:</span>
                  <span style={{ color: 'var(--color-primary-dark)' }}>{formatCurrency(factura.total)}</span>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Cerrar
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--color-primary-dark)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Imprimir
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/facturas/${facturaId}/send-email`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });

                    if (response.ok) {
                      alert('Correo enviado exitosamente');
                    } else {
                      alert('Error al enviar el correo');
                    }
                  } catch (error) {
                    console.error('Error:', error);
                    alert('Error al enviar el correo');
                  }
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007BFF', // Cambiado a un azul para diferenciarlo del fondo
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Enviar por Correo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
