import api from './api';

export interface ProductoVenta {
  productoId: number;
  cantidad: number;
}

export interface RegistrarVentaData {
  clienteId: number;
  medioPago: 'Efectivo' | 'Tarjeta Débito' | 'Tarjeta Crédito' | 'Transferencia' | 'Otro';
  productos: ProductoVenta[];
  observaciones?: string;
}

export interface VentaResponse {
  id: number;
  numero_factura: string;
  fecha_emision: string;
  subtotal: number;
  valor_iva: number;
  total: number;
  medio_pago: string;
  cliente: any;
  user?: any;
  detalles: any[];
}

export interface VentasDelDiaResponse {
  fecha: string;
  cantidad_ventas: number;
  total_ventas: number;
  facturas: VentaResponse[];
}

export interface BuscarFacturasParams {
  fechaInicio?: string;
  fechaFin?: string;
  numeroFactura?: string;
  clienteId?: number;
}

export interface BuscarFacturasResponse {
  facturas: VentaResponse[];
  resumen: {
    cantidad: number;
    total_ventas: number;
  };
}

export const ventasService = {
  // Registrar una nueva venta
  async registrarVenta(data: RegistrarVentaData): Promise<any> {
    const response = await api.post('/ventas/registrar', data);
    return response.data;
  },

  // Obtener ventas del día
  async obtenerVentasDelDia(): Promise<VentasDelDiaResponse> {
    const response = await api.get('/ventas/del-dia');
    return response.data;
  },

  // Obtener detalle de una factura
  async obtenerFactura(id: number): Promise<VentaResponse> {
    const response = await api.get(`/facturas/${id}`);
    return response.data.data;
  },

  // Buscar facturas con filtros
  async buscarFacturas(params: BuscarFacturasParams): Promise<BuscarFacturasResponse> {
    const response = await api.get('/ventas/buscar', { params });
    return response.data;
  },
};
