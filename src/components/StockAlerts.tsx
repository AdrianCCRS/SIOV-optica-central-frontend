import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productosService } from '../services/productos.service';
import type { Producto } from '../services/productos.service';

interface StockAlertsProps {
  onViewDetails: () => void;
}

export default function StockAlerts({ onViewDetails }: StockAlertsProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: productosBajoStock = [], isLoading } = useQuery({
    queryKey: ['productos-bajo-stock'],
    queryFn: () => productosService.getProductosBajoStock(),
    refetchInterval: 60000, // Refrescar cada minuto
  });

  const alertCount = productosBajoStock.length;

  if (isLoading || alertCount === 0) {
    return null;
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          position: 'relative',
          padding: '8px 12px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: '1px solid white',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>🔔</span>
        {alertCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#ff4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            {alertCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            onClick={() => setShowDropdown(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: '320px',
              maxWidth: '400px',
              maxHeight: '400px',
              overflow: 'auto',
              zIndex: 999,
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #eee',
                backgroundColor: '#f8f9fa',
                fontWeight: 'bold',
                color: '#333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>⚠️ Alertas de Stock Bajo</span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {alertCount} producto{alertCount !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              {productosBajoStock.map((producto: Producto) => (
                <div
                  key={producto.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #eee',
                    backgroundColor: 'white',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      color: '#333',
                      marginBottom: '4px',
                      fontSize: '14px',
                    }}
                  >
                    {producto.nombre}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                    REF: {producto.referencia}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      fontSize: '12px',
                    }}
                  >
                    <span
                      style={{
                        color: producto.stock_actual === 0 ? '#ff4444' : '#ff9800',
                        fontWeight: 'bold',
                      }}
                    >
                      Stock: {producto.stock_actual}
                    </span>
                    <span style={{ color: '#666' }}>
                      Mínimo: {producto.stock_minimo}
                    </span>
                  </div>
                  {producto.categoria && (
                    <div
                      style={{
                        marginTop: '4px',
                        fontSize: '11px',
                        color: '#888',
                      }}
                    >
                      {producto.categoria.nombre}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid #eee',
                backgroundColor: '#f8f9fa',
              }}
            >
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onViewDetails();
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                }}
              >
                Ver todos los productos
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
