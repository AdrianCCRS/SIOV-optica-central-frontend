import api from './api';

export interface VentasDiarias {
  fecha: string;
  total: number;
  cantidad_facturas: number;
}

export interface VentasPorCategoria {
  categoria: string;
  total: number;
  cantidad: number;
}

export interface VentasPorMetodoPago {
  metodo_pago: string;
  total: number;
  cantidad: number;
}

export interface ProductoMasVendido {
  nombre: string;
  cantidad: number;
  total: number;
}

export interface StockPorCategoria {
  categoria: string;
  cantidad: number;
  productos: number;
}

export interface ProductoBajoStock {
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
}

export interface IVAGenerado {
  total_ventas: number;
  total_iva: number;
  total_sin_iva: number;
  desglose_iva: {
    tasa: number;
    total: number;
  }[];
}

export const reportesService = {
  // Obtener ventas diarias/semanales/mensuales
  async getVentasDiarias(fechaInicio: string, fechaFin: string): Promise<VentasDiarias[]> {
    try {
      const response = await api.get(`/facturas`);
      const facturas = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Filtrar por fecha en el cliente
      const facturasFiltradas = facturas.filter((f: any) => {
        const fecha = f.fecha_emision?.split('T')[0] || f.fecha_emision;
        return fecha >= fechaInicio && fecha <= fechaFin;
      });
      
      // Agrupar por fecha
      const ventasPorFecha = new Map<string, { total: number; cantidad: number }>();
      
      facturasFiltradas.forEach((factura: any) => {
        const fecha = factura.fecha_emision?.split('T')[0] || factura.fecha_emision;
        if (!ventasPorFecha.has(fecha)) {
          ventasPorFecha.set(fecha, { total: 0, cantidad: 0 });
        }
        const stats = ventasPorFecha.get(fecha)!;
        stats.total += parseFloat(factura.total) || 0;
        stats.cantidad += 1;
      });
      
      return Array.from(ventasPorFecha.entries()).map(([fecha, stats]) => ({
        fecha,
        total: stats.total,
        cantidad_facturas: stats.cantidad
      })).sort((a, b) => a.fecha.localeCompare(b.fecha));
    } catch (error) {
      console.error('❌ Error obteniendo ventas diarias:', error);
      return [];
    }
  },

  // Obtener ventas por categoría de producto
  async getVentasPorCategoria(fechaInicio?: string, fechaFin?: string): Promise<VentasPorCategoria[]> {
    try {
      // Obtener facturas con populate profundo
      const response = await api.get('/facturas?populate[detalles][populate]=producto.categoria');
      const facturas = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Filtrar por fecha si se proporcionan
      const facturasFiltradas = facturas.filter((f: any) => {
        if (!fechaInicio && !fechaFin) return true;
        const fecha = f.fecha_emision?.split('T')[0] || f.fecha_emision;
        if (fechaInicio && fecha < fechaInicio) return false;
        if (fechaFin && fecha > fechaFin) return false;
        return true;
      });
      
      const ventasPorCategoria = new Map<string, { total: number; cantidad: number }>();
      
      facturasFiltradas.forEach((factura: any) => {
        const detalles = Array.isArray(factura.detalles) ? factura.detalles : [];
        detalles.forEach((detalle: any) => {
          // Extraer información del producto y categoría
          let categoria = 'Sin categoría';
          
          if (detalle.producto) {
            if (typeof detalle.producto === 'object') {
              // Si producto está populado
              if (detalle.producto.categoria) {
                if (typeof detalle.producto.categoria === 'object') {
                  categoria = detalle.producto.categoria.nombre || 'Sin categoría';
                }
              }
            }
          }
          
          if (!ventasPorCategoria.has(categoria)) {
            ventasPorCategoria.set(categoria, { total: 0, cantidad: 0 });
          }
          const stats = ventasPorCategoria.get(categoria)!;
          stats.total += parseFloat(detalle.valor_total_linea) || 0;
          stats.cantidad += detalle.cantidad || 0;
        });
      });
      
      return Array.from(ventasPorCategoria.entries()).map(([categoria, stats]) => ({
        categoria,
        total: stats.total,
        cantidad: stats.cantidad
      })).sort((a, b) => b.total - a.total);
    } catch (error) {
      console.error('Error obteniendo ventas por categoría:', error);
      return [];
    }
  },

  // Obtener ventas por método de pago
  async getVentasPorMetodoPago(fechaInicio?: string, fechaFin?: string): Promise<VentasPorMetodoPago[]> {
    try {
      const response = await api.get('/facturas');
      const facturas = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Filtrar por fecha
      const facturasFiltradas = facturas.filter((f: any) => {
        if (!fechaInicio && !fechaFin) return true;
        const fecha = f.fecha_emision?.split('T')[0] || f.fecha_emision;
        if (fechaInicio && fecha < fechaInicio) return false;
        if (fechaFin && fecha > fechaFin) return false;
        return true;
      });
      
      const ventasPorMetodo = new Map<string, { total: number; cantidad: number }>();
      
      facturasFiltradas.forEach((factura: any) => {
        const metodo = factura.medio_pago || 'No especificado';
        if (!ventasPorMetodo.has(metodo)) {
          ventasPorMetodo.set(metodo, { total: 0, cantidad: 0 });
        }
        const stats = ventasPorMetodo.get(metodo)!;
        stats.total += parseFloat(factura.total) || 0;
        stats.cantidad += 1;
      });
      
      return Array.from(ventasPorMetodo.entries()).map(([metodo_pago, stats]) => ({
        metodo_pago,
        total: stats.total,
        cantidad: stats.cantidad
      })).sort((a, b) => b.total - a.total);
    } catch (error) {
      console.error('Error obteniendo ventas por método de pago:', error);
      return [];
    }
  },

  // Obtener productos más vendidos
  async getProductosMasVendidos(fechaInicio?: string, fechaFin?: string): Promise<ProductoMasVendido[]> {
    try {
      const response = await api.get('/facturas?populate=detalles');
      const facturas = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Filtrar por fecha
      const facturasFiltradas = facturas.filter((f: any) => {
        if (!fechaInicio && !fechaFin) return true;
        const fecha = f.fecha_emision?.split('T')[0] || f.fecha_emision;
        if (fechaInicio && fecha < fechaInicio) return false;
        if (fechaFin && fecha > fechaFin) return false;
        return true;
      });
      
      // Obtener productos para mapear nombres
      const productosResponse = await api.get('/productos');
      const productos = Array.isArray(productosResponse.data) ? productosResponse.data : productosResponse.data.data || [];
      const productosMap = new Map<number, string>(productos.map((p: any) => [p.id, p.nombre]));
      
      const ventasPorProducto = new Map<number, { nombre: string; cantidad: number; total: number }>();
      
      facturasFiltradas.forEach((factura: any) => {
        const detalles = Array.isArray(factura.detalles) ? factura.detalles : [];
        detalles.forEach((detalle: any) => {
          const productoId: number = typeof detalle.producto === 'object' ? detalle.producto.id : detalle.producto;
          const nombre = productosMap.get(productoId) || 'Producto desconocido';
          
          if (!ventasPorProducto.has(productoId)) {
            ventasPorProducto.set(productoId, { nombre, cantidad: 0, total: 0 });
          }
          const stats = ventasPorProducto.get(productoId)!;
          stats.cantidad += detalle.cantidad || 0;
          stats.total += parseFloat(detalle.valor_total_linea) || 0;
        });
      });
      
      return Array.from(ventasPorProducto.values())
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);
    } catch (error) {
      console.error('Error obteniendo productos más vendidos:', error);
      return [];
    }
  },

  // Obtener stock por categoría
  async getStockPorCategoria(): Promise<StockPorCategoria[]> {
    try {
      const response = await api.get('/productos?populate=categoria');
      const productos = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      const stockPorCategoria = new Map<string, { cantidad: number; productos: number }>();
      
      productos.forEach((producto: any) => {
        const categoria = producto.categoria?.nombre || 'Sin categoría';
        if (!stockPorCategoria.has(categoria)) {
          stockPorCategoria.set(categoria, { cantidad: 0, productos: 0 });
        }
        const stats = stockPorCategoria.get(categoria)!;
        stats.cantidad += producto.stock_actual || 0;
        stats.productos += 1;
      });
      
      return Array.from(stockPorCategoria.entries()).map(([categoria, stats]) => ({
        categoria,
        cantidad: stats.cantidad,
        productos: stats.productos
      })).sort((a, b) => b.cantidad - a.cantidad);
    } catch (error) {
      console.error('Error obteniendo stock por categoría:', error);
      return [];
    }
  },

  // Obtener productos con bajo stock
  async getProductosBajoStock(): Promise<ProductoBajoStock[]> {
    try {
      const response = await api.get('/productos');
      const productos = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      return productos
        .filter((p: any) => (p.stock_actual || 0) < (p.stock_minimo || 0))
        .map((p: any) => ({
          nombre: p.nombre,
          stock_actual: p.stock_actual || 0,
          stock_minimo: p.stock_minimo || 0
        }))
        .sort((a: ProductoBajoStock, b: ProductoBajoStock) => a.stock_actual - b.stock_actual);
    } catch (error) {
      console.error('Error obteniendo productos bajo stock:', error);
      return [];
    }
  },

  // Obtener IVA generado
  async getIVAGenerado(fechaInicio: string, fechaFin: string): Promise<IVAGenerado> {
    try {
      const response = await api.get('/facturas?populate=detalles');
      const facturas = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Filtrar por fecha
      const facturasFiltradas = facturas.filter((f: any) => {
        const fecha = f.fecha_emision?.split('T')[0] || f.fecha_emision;
        return fecha >= fechaInicio && fecha <= fechaFin;
      });
      
      let totalVentas = 0;
      let totalIVA = 0;
      const ivaPorTasa = new Map<number, number>();
      
      facturasFiltradas.forEach((factura: any) => {
        totalVentas += parseFloat(factura.total) || 0;
        totalIVA += parseFloat(factura.valor_iva) || 0;
        
        const detalles = Array.isArray(factura.detalles) ? factura.detalles : [];
        detalles.forEach((detalle: any) => {
          const tasa = detalle.porcentaje_iva || 0;
          const ivaDetalle = parseFloat(detalle.valor_iva) || 0;
          ivaPorTasa.set(tasa, (ivaPorTasa.get(tasa) || 0) + ivaDetalle);
        });
      });
      
      return {
        total_ventas: totalVentas,
        total_iva: totalIVA,
        total_sin_iva: totalVentas - totalIVA,
        desglose_iva: Array.from(ivaPorTasa.entries()).map(([tasa, total]) => ({
          tasa,
          total
        })).sort((a, b) => b.tasa - a.tasa)
      };
    } catch (error) {
      console.error('Error obteniendo IVA generado:', error);
      return {
        total_ventas: 0,
        total_iva: 0,
        total_sin_iva: 0,
        desglose_iva: []
      };
    }
  }
};
