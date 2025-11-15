import api from './api';

export interface ProductoVenta {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  porcentaje_iva: number;
}

export interface RegistrarVentaData {
  cliente_id: number;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  productos: ProductoVenta[];
  observaciones?: string;
}

export interface VentaResponse {
  id: number;
  numero_factura: string;
  fecha: string;
  subtotal: number;
  total_iva: number;
  total: number;
  metodo_pago: string;
  cliente: any;
  detalles: any[];
}

export const ventasService = {
  // Registrar una nueva venta
  async registrarVenta(data: RegistrarVentaData): Promise<VentaResponse> {
    const response = await api.post('/ventas/registrar', data);
    return response.data;
  },

  // Obtener ventas del día
  async obtenerVentasDelDia(): Promise<VentaResponse[]> {
    const response = await api.get('/ventas/del-dia');
    return response.data;
  },

  // Obtener detalle de una factura
  async obtenerFactura(id: number): Promise<VentaResponse> {
    const response = await api.get(`/facturas/${id}?populate=*`);
    return response.data.data;
  },
};
