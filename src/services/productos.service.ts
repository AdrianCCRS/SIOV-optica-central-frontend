import api from './api';

export interface Producto {
  id: number;
  referencia: string;
  nombre: string;
  descripcion?: string;
  precio_unitario: number;
  porcentaje_iva: number;
  stock_actual: number;
  stock_minimo: number;
  activo: boolean;
  categoria?: {
    id: number;
    nombre: string;
  };
}

export const productosService = {
  // Obtener todos los productos activos
  async obtenerProductosActivos(): Promise<Producto[]> {
    const response = await api.get('/productos?filters[activo][$eq]=true&populate=categoria');
    const items = Array.isArray(response.data) ? response.data : response.data.data || [];
    return items.map((item: any) => {
      const attrs = item.attributes || item;
      return {
        id: item.id,
        referencia: attrs.referencia,
        nombre: attrs.nombre,
        descripcion: attrs.descripcion,
        precio_unitario: parseFloat(attrs.precio_unitario) || 0,
        porcentaje_iva: parseFloat(attrs.porcentaje_iva) || 0,
        stock_actual: parseInt(attrs.stock_actual) || 0,
        stock_minimo: parseInt(attrs.stock_minimo) || 0,
        activo: attrs.activo,
        categoria: attrs.categoria?.data ? {
          id: attrs.categoria.data.id,
          nombre: attrs.categoria.data.attributes?.nombre || attrs.categoria.data.nombre,
        } : undefined,
      };
    });
  },

  // Buscar productos por referencia o nombre
  async buscarProductos(query: string): Promise<Producto[]> {
    const response = await api.get(`/productos?filters[$or][0][referencia][$containsi]=${query}&filters[$or][1][nombre][$containsi]=${query}&filters[activo][$eq]=true&populate=categoria`);
    const items = Array.isArray(response.data) ? response.data : response.data.data || [];
    return items.map((item: any) => {
      const attrs = item.attributes || item;
      return {
        id: item.id,
        referencia: attrs.referencia,
        nombre: attrs.nombre,
        descripcion: attrs.descripcion,
        precio_unitario: parseFloat(attrs.precio_unitario) || 0,
        porcentaje_iva: parseFloat(attrs.porcentaje_iva) || 0,
        stock_actual: parseInt(attrs.stock_actual) || 0,
        stock_minimo: parseInt(attrs.stock_minimo) || 0,
        activo: attrs.activo,
        categoria: attrs.categoria?.data ? {
          id: attrs.categoria.data.id,
          nombre: attrs.categoria.data.attributes?.nombre || attrs.categoria.data.nombre,
        } : undefined,
      };
    });
  },

  // Obtener un producto por ID
  async obtenerProducto(id: number): Promise<Producto> {
    const response = await api.get(`/productos/${id}?populate=categoria`);
    const item = response.data.data || response.data;
    const attrs = item.attributes || item;
    return {
      id: item.id,
      referencia: attrs.referencia,
      nombre: attrs.nombre,
      descripcion: attrs.descripcion,
      precio_unitario: parseFloat(attrs.precio_unitario) || 0,
      porcentaje_iva: parseFloat(attrs.porcentaje_iva) || 0,
      stock_actual: parseInt(attrs.stock_actual) || 0,
      stock_minimo: parseInt(attrs.stock_minimo) || 0,
      activo: attrs.activo,
      categoria: attrs.categoria?.data ? {
        id: attrs.categoria.data.id,
        nombre: attrs.categoria.data.attributes?.nombre || attrs.categoria.data.nombre,
      } : undefined,
    };
  },
};
