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
    return response.data.data.map((item: any) => ({
      id: item.id,
      ...item.attributes,
      categoria: item.attributes.categoria?.data ? {
        id: item.attributes.categoria.data.id,
        ...item.attributes.categoria.data.attributes,
      } : null,
    }));
  },

  // Buscar productos por referencia o nombre
  async buscarProductos(query: string): Promise<Producto[]> {
    const response = await api.get(`/productos?filters[$or][0][referencia][$containsi]=${query}&filters[$or][1][nombre][$containsi]=${query}&filters[activo][$eq]=true&populate=categoria`);
    return response.data.data.map((item: any) => ({
      id: item.id,
      ...item.attributes,
      categoria: item.attributes.categoria?.data ? {
        id: item.attributes.categoria.data.id,
        ...item.attributes.categoria.data.attributes,
      } : null,
    }));
  },

  // Obtener un producto por ID
  async obtenerProducto(id: number): Promise<Producto> {
    const response = await api.get(`/productos/${id}?populate=categoria`);
    const item = response.data.data;
    return {
      id: item.id,
      ...item.attributes,
      categoria: item.attributes.categoria?.data ? {
        id: item.attributes.categoria.data.id,
        ...item.attributes.categoria.data.attributes,
      } : null,
    };
  },
};
