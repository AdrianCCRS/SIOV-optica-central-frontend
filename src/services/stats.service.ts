import api from './api';

export interface EstadisticasVentas {
  ventasHoy: {
    total: number;
    cantidad: number;
  };
  ventasMes: {
    total: number;
    cantidad: number;
  };
  ventasPorProducto: Array<{
    producto: string;
    cantidad: number;
    total: number;
  }>;
  productosConBajoStock: number;
  totalClientes: number;
  totalProductos: number;
}

export interface VentaPorDia {
  fecha: string;
  total: number;
  cantidad: number;
}

export const statsService = {
  // Obtener estadísticas generales del dashboard
  async getEstadisticasGenerales(): Promise<EstadisticasVentas> {
    try {
      // Obtener ventas de hoy
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const ventasHoyRes = await api.get(`/facturas?filters[createdAt][$gte]=${hoy.toISOString()}`);
      const ventasHoy = Array.isArray(ventasHoyRes.data) ? ventasHoyRes.data : ventasHoyRes.data.data || [];
      
      // Obtener ventas del mes actual
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);
      const ventasMesRes = await api.get(`/facturas?filters[createdAt][$gte]=${inicioMes.toISOString()}`);
      const ventasMes = Array.isArray(ventasMesRes.data) ? ventasMesRes.data : ventasMesRes.data.data || [];
      
      // Obtener productos
      const productosRes = await api.get('/productos');
      const productos = Array.isArray(productosRes.data) ? productosRes.data : productosRes.data.data || [];
      
      // Obtener clientes
      const clientesRes = await api.get('/clientes');
      const clientes = Array.isArray(clientesRes.data) ? clientesRes.data : clientesRes.data.data || [];
      
      // Calcular productos con bajo stock
      const productosBajoStock = productos.filter((p: any) => 
        p.activo && p.stock_actual <= p.stock_minimo
      ).length;
      
      // Calcular totales de ventas del día
      const totalVentasHoy = ventasHoy.reduce((sum: number, v: any) => 
        sum + (parseFloat(v.total) || 0), 0
      );
      
      // Calcular totales de ventas del mes
      const totalVentasMes = ventasMes.reduce((sum: number, v: any) => 
        sum + (parseFloat(v.total) || 0), 0
      );
      
      // Obtener ventas por producto (top 5) - necesitaríamos detalles de factura
      const detallesRes = await api.get('/detalle-facturas?populate=producto');
      const detalles = Array.isArray(detallesRes.data) ? detallesRes.data : detallesRes.data.data || [];
      
      const ventasPorProductoMap = new Map<string, { cantidad: number; total: number }>();
      
      detalles.forEach((detalle: any) => {
        const nombreProducto = detalle.producto?.nombre || 'Desconocido';
        const cantidad = parseInt(detalle.cantidad) || 0;
        const subtotal = parseFloat(detalle.subtotal) || 0;
        
        if (ventasPorProductoMap.has(nombreProducto)) {
          const actual = ventasPorProductoMap.get(nombreProducto)!;
          ventasPorProductoMap.set(nombreProducto, {
            cantidad: actual.cantidad + cantidad,
            total: actual.total + subtotal,
          });
        } else {
          ventasPorProductoMap.set(nombreProducto, { cantidad, total: subtotal });
        }
      });
      
      const ventasPorProducto = Array.from(ventasPorProductoMap.entries())
        .map(([producto, data]) => ({ producto, ...data }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
      
      return {
        ventasHoy: {
          total: totalVentasHoy,
          cantidad: ventasHoy.length,
        },
        ventasMes: {
          total: totalVentasMes,
          cantidad: ventasMes.length,
        },
        ventasPorProducto,
        productosConBajoStock: productosBajoStock,
        totalClientes: clientes.length,
        totalProductos: productos.filter((p: any) => p.activo).length,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  // Obtener ventas por día de los últimos N días
  async getVentasPorDia(dias: number = 7): Promise<VentaPorDia[]> {
    try {
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - dias);
      fechaInicio.setHours(0, 0, 0, 0);
      
      const response = await api.get(`/facturas?filters[createdAt][$gte]=${fechaInicio.toISOString()}`);
      const facturas = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Agrupar por día
      const ventasPorDiaMap = new Map<string, { total: number; cantidad: number }>();
      
      facturas.forEach((factura: any) => {
        const fechaStr = factura.fecha || factura.createdAt;
        const fecha = fechaStr ? fechaStr.split('T')[0] : new Date().toISOString().split('T')[0];
        const total = parseFloat(factura.total) || 0;
        
        if (ventasPorDiaMap.has(fecha)) {
          const actual = ventasPorDiaMap.get(fecha)!;
          ventasPorDiaMap.set(fecha, {
            total: actual.total + total,
            cantidad: actual.cantidad + 1,
          });
        } else {
          ventasPorDiaMap.set(fecha, { total, cantidad: 1 });
        }
      });
      
      return Array.from(ventasPorDiaMap.entries())
        .map(([fecha, data]) => ({ fecha, ...data }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha));
    } catch (error) {
      console.error('Error al obtener ventas por día:', error);
      throw error;
    }
  },
};
