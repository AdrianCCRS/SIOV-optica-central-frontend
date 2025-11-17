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

// Nuevas interfaces para Fase 1
export interface KPIMetricas {
  ventas_total: number;
  ticket_promedio: number;
  cantidad_facturas: number;
  clientes_unicos: number;
  productos_vendidos: number;
  comparativa_anterior?: {
    ventas_cambio: number;
    ticket_cambio: number;
    facturas_cambio: number;
    clientes_cambio: number;
  };
}

export interface TopCliente {
  cliente_id: number;
  nombre_completo: string;
  numero_identificacion: string;
  total_comprado: number;
  numero_compras: number;
  ticket_promedio: number;
  ultima_compra: string;
}

export interface RendimientoCajero {
  usuario_id: number;
  username: string;
  nombre_completo: string;
  ventas_realizadas: number;
  total_vendido: number;
  ticket_promedio: number;
  porcentaje_total: number;
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
      const response = await api.get('/facturas?populate[detalles][populate]=producto');
      const facturas = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Filtrar por fecha
      const facturasFiltradas = facturas.filter((f: any) => {
        if (!fechaInicio && !fechaFin) return true;
        const fecha = f.fecha_emision?.split('T')[0] || f.fecha_emision;
        if (fechaInicio && fecha < fechaInicio) return false;
        if (fechaFin && fecha > fechaFin) return false;
        return true;
      });
      
      const ventasPorProducto = new Map<number, { nombre: string; cantidad: number; total: number }>();
      
      facturasFiltradas.forEach((factura: any) => {
        const detalles = Array.isArray(factura.detalles) ? factura.detalles : [];
        detalles.forEach((detalle: any) => {
          // Extraer información del producto
          let productoId: number;
          let nombre = 'Producto desconocido';
          
          if (detalle.producto) {
            if (typeof detalle.producto === 'object') {
              productoId = detalle.producto.id;
              nombre = detalle.producto.nombre || 'Producto desconocido';
            } else {
              productoId = detalle.producto;
            }
          } else {
            return; // Skip si no hay producto
          }
          
          if (!ventasPorProducto.has(productoId)) {
            ventasPorProducto.set(productoId, { nombre, cantidad: 0, total: 0 });
          }
          const stats = ventasPorProducto.get(productoId)!;
          stats.cantidad += detalle.cantidad || 0;
          stats.total += parseFloat(detalle.valor_total_linea) || 0;
        });
      });
      
      return Array.from(ventasPorProducto.entries())
        .map(([_, stats]) => ({
          nombre: stats.nombre,
          cantidad: stats.cantidad,
          total: stats.total
        }))
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
  },

  // ==================== FASE 1: NUEVOS MÉTODOS ====================

  // Obtener KPIs y métricas clave
  async getKPIMetricas(fechaInicio: string, fechaFin: string, calcularComparativa: boolean = true): Promise<KPIMetricas> {
    try {
      const response = await api.get('/facturas?populate=cliente');
      const facturas = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Filtrar por fecha del periodo actual
      const facturasFiltradas = facturas.filter((f: any) => {
        const fecha = f.fecha_emision?.split('T')[0] || f.fecha_emision;
        return fecha >= fechaInicio && fecha <= fechaFin;
      });
      
      // Calcular métricas del periodo actual
      const ventasTotal = facturasFiltradas.reduce((sum: number, f: any) => sum + (parseFloat(f.total) || 0), 0);
      const cantidadFacturas = facturasFiltradas.length;
      const ticketPromedio = cantidadFacturas > 0 ? ventasTotal / cantidadFacturas : 0;
      
      // Clientes únicos
      const clientesUnicos = new Set(
        facturasFiltradas
          .map((f: any) => typeof f.cliente === 'object' ? f.cliente?.id : f.cliente)
          .filter(Boolean)
      ).size;
      
      // Productos vendidos - obtener detalles de las facturas filtradas
      const facturasIds = facturasFiltradas.map((f: any) => f.id);
      let productosVendidos = 0;
      
      if (facturasIds.length > 0) {
        // Obtener detalles con populate de factura para filtrar
        const detallesResponse = await api.get('/detalle-facturas?populate=factura');
        const detalles = Array.isArray(detallesResponse.data) ? detallesResponse.data : detallesResponse.data.data || [];
        
        productosVendidos = detalles
          .filter((d: any) => {
            const facturaId = typeof d.factura === 'object' ? d.factura?.id : d.factura;
            return facturasIds.includes(facturaId);
          })
          .reduce((sum: number, d: any) => sum + (d.cantidad || 0), 0);
      }
      
      const resultado: KPIMetricas = {
        ventas_total: ventasTotal,
        ticket_promedio: ticketPromedio,
        cantidad_facturas: cantidadFacturas,
        clientes_unicos: clientesUnicos,
        productos_vendidos: productosVendidos
      };
      
      // Calcular comparativa con periodo anterior
      if (calcularComparativa) {
        const [añoInicio, mesInicio, diaInicio] = fechaInicio.split('-').map(Number);
        const [añoFin, mesFin, diaFin] = fechaFin.split('-').map(Number);
        
        const inicio = new Date(añoInicio, mesInicio - 1, diaInicio);
        const fin = new Date(añoFin, mesFin - 1, diaFin);
        const diasDiferencia = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        const fechaInicioAnterior = new Date(inicio);
        fechaInicioAnterior.setDate(fechaInicioAnterior.getDate() - diasDiferencia);
        const fechaFinAnterior = new Date(inicio);
        fechaFinAnterior.setDate(fechaFinAnterior.getDate() - 1);
        
        const formatFecha = (d: Date) => d.toISOString().split('T')[0];
        
        const facturasAnteriores = facturas.filter((f: any) => {
          const fecha = f.fecha_emision?.split('T')[0] || f.fecha_emision;
          return fecha >= formatFecha(fechaInicioAnterior) && fecha <= formatFecha(fechaFinAnterior);
        });
        
        const ventasAnterior = facturasAnteriores.reduce((sum: number, f: any) => sum + (parseFloat(f.total) || 0), 0);
        const facturasAnterior = facturasAnteriores.length;
        const ticketAnterior = facturasAnterior > 0 ? ventasAnterior / facturasAnterior : 0;
        const clientesAnterior = new Set(
          facturasAnteriores
            .map((f: any) => typeof f.cliente === 'object' ? f.cliente?.id : f.cliente)
            .filter(Boolean)
        ).size;
        
        const calcularCambio = (actual: number, anterior: number) => {
          if (anterior === 0) return actual > 0 ? 100 : 0;
          return ((actual - anterior) / anterior) * 100;
        };
        
        resultado.comparativa_anterior = {
          ventas_cambio: calcularCambio(ventasTotal, ventasAnterior),
          ticket_cambio: calcularCambio(ticketPromedio, ticketAnterior),
          facturas_cambio: calcularCambio(cantidadFacturas, facturasAnterior),
          clientes_cambio: calcularCambio(clientesUnicos, clientesAnterior)
        };
      }
      
      return resultado;
    } catch (error) {
      console.error('Error obteniendo KPI métricas:', error);
      return {
        ventas_total: 0,
        ticket_promedio: 0,
        cantidad_facturas: 0,
        clientes_unicos: 0,
        productos_vendidos: 0
      };
    }
  },

  // Obtener top clientes del periodo
  async getTopClientes(fechaInicio: string, fechaFin: string, limite: number = 10): Promise<TopCliente[]> {
    try {
      const response = await api.get('/facturas?populate=cliente');
      const facturas = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Filtrar por fecha
      const facturasFiltradas = facturas.filter((f: any) => {
        const fecha = f.fecha_emision?.split('T')[0] || f.fecha_emision;
        return fecha >= fechaInicio && fecha <= fechaFin;
      });
      
      // Agrupar por cliente
      const ventasPorCliente = new Map<number, {
        cliente: any;
        total: number;
        cantidad: number;
        ultima_fecha: string;
      }>();
      
      facturasFiltradas.forEach((factura: any) => {
        const clienteData = typeof factura.cliente === 'object' ? factura.cliente : null;
        if (!clienteData) return;
        
        const clienteId = clienteData.id;
        if (!ventasPorCliente.has(clienteId)) {
          ventasPorCliente.set(clienteId, {
            cliente: clienteData,
            total: 0,
            cantidad: 0,
            ultima_fecha: factura.fecha_emision
          });
        }
        
        const stats = ventasPorCliente.get(clienteId)!;
        stats.total += parseFloat(factura.total) || 0;
        stats.cantidad += 1;
        
        // Actualizar última fecha si es más reciente
        if (factura.fecha_emision > stats.ultima_fecha) {
          stats.ultima_fecha = factura.fecha_emision;
        }
      });
      
      return Array.from(ventasPorCliente.entries())
        .map(([clienteId, stats]) => ({
          cliente_id: clienteId,
          nombre_completo: `${stats.cliente.nombres || ''} ${stats.cliente.apellidos || ''}`.trim(),
          numero_identificacion: stats.cliente.numero_identificacion || 'N/A',
          total_comprado: stats.total,
          numero_compras: stats.cantidad,
          ticket_promedio: stats.total / stats.cantidad,
          ultima_compra: stats.ultima_fecha.split('T')[0]
        }))
        .sort((a, b) => b.total_comprado - a.total_comprado)
        .slice(0, limite);
    } catch (error) {
      console.error('Error obteniendo top clientes:', error);
      return [];
    }
  },

  // Obtener rendimiento de cajeros
  async getRendimientoCajeros(fechaInicio: string, fechaFin: string): Promise<RendimientoCajero[]> {
    try {
      const response = await api.get('/facturas?populate=user');
      const facturas = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Filtrar por fecha
      const facturasFiltradas = facturas.filter((f: any) => {
        const fecha = f.fecha_emision?.split('T')[0] || f.fecha_emision;
        return fecha >= fechaInicio && fecha <= fechaFin;
      });
      
      const totalGeneral = facturasFiltradas.reduce((sum: number, f: any) => sum + (parseFloat(f.total) || 0), 0);
      
      // Agrupar por usuario
      const ventasPorUsuario = new Map<number, {
        usuario: any;
        total: number;
        cantidad: number;
      }>();
      
      facturasFiltradas.forEach((factura: any) => {
        const usuarioData = typeof factura.user === 'object' ? factura.user : null;
        if (!usuarioData) return;
        
        const usuarioId = usuarioData.id;
        if (!ventasPorUsuario.has(usuarioId)) {
          ventasPorUsuario.set(usuarioId, {
            usuario: usuarioData,
            total: 0,
            cantidad: 0
          });
        }
        
        const stats = ventasPorUsuario.get(usuarioId)!;
        stats.total += parseFloat(factura.total) || 0;
        stats.cantidad += 1;
      });
      
      return Array.from(ventasPorUsuario.entries())
        .map(([usuarioId, stats]) => ({
          usuario_id: usuarioId,
          username: stats.usuario.username || 'N/A',
          nombre_completo: `${stats.usuario.nombres || ''} ${stats.usuario.apellidos || ''}`.trim() || stats.usuario.username,
          ventas_realizadas: stats.cantidad,
          total_vendido: stats.total,
          ticket_promedio: stats.total / stats.cantidad,
          porcentaje_total: totalGeneral > 0 ? (stats.total / totalGeneral) * 100 : 0
        }))
        .sort((a, b) => b.total_vendido - a.total_vendido);
    } catch (error) {
      console.error('Error obteniendo rendimiento cajeros:', error);
      return [];
    }
  }
};
