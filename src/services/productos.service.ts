import api from './api';

export interface Producto {
  id: number;
  documentId: string; // Usado para eliminación en Strapi v5
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

export interface CreateProductoData {
  referencia: string;
  nombre: string;
  descripcion?: string;
  precio_unitario: number;
  porcentaje_iva?: number;
  stock_actual: number;
  stock_minimo: number;
  activo?: boolean;
  categoria?: number;
}

export const productosService = {
  // Obtener todos los productos activos
  async obtenerProductosActivos(): Promise<Producto[]> {
    const response = await api.get('/productos?filters[activo][$eq]=true&populate=categoria');
    const items = Array.isArray(response.data) ? response.data : response.data.data || [];
    return items.map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      referencia: item.referencia,
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio_unitario: parseFloat(item.precio_unitario) || 0,
      porcentaje_iva: parseFloat(item.porcentaje_iva) || 0,
      stock_actual: parseInt(item.stock_actual) || 0,
      stock_minimo: parseInt(item.stock_minimo) || 0,
      activo: item.activo,
      categoria: item.categoria ? {
        id: item.categoria.id,
        nombre: item.categoria.nombre,
      } : undefined,
    }));
  },

  // Buscar productos por referencia o nombre
  async buscarProductos(query: string): Promise<Producto[]> {
    const response = await api.get(`/productos?filters[$or][0][referencia][$containsi]=${query}&filters[$or][1][nombre][$containsi]=${query}&filters[activo][$eq]=true&populate=categoria`);
    const items = Array.isArray(response.data) ? response.data : response.data.data || [];
    return items.map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      referencia: item.referencia,
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio_unitario: parseFloat(item.precio_unitario) || 0,
      porcentaje_iva: parseFloat(item.porcentaje_iva) || 0,
      stock_actual: parseInt(item.stock_actual) || 0,
      stock_minimo: parseInt(item.stock_minimo) || 0,
      activo: item.activo,
      categoria: item.categoria ? {
        id: item.categoria.id,
        nombre: item.categoria.nombre,
      } : undefined,
    }));
  },

  // Obtener un producto por documentId
  async obtenerProducto(documentId: string): Promise<Producto> {
    const response = await api.get(`/productos/${documentId}?populate=categoria`);
    const item = response.data.data || response.data;
    return {
      id: item.id,
      documentId: item.documentId,
      referencia: item.referencia,
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio_unitario: parseFloat(item.precio_unitario) || 0,
      porcentaje_iva: parseFloat(item.porcentaje_iva) || 0,
      stock_actual: parseInt(item.stock_actual) || 0,
      stock_minimo: parseInt(item.stock_minimo) || 0,
      activo: item.activo,
      categoria: item.categoria ? {
        id: item.categoria.id,
        nombre: item.categoria.nombre,
      } : undefined,
    };
  },

  // Obtener todos los productos (incluyendo inactivos) - para bodeguero
  async getAll(): Promise<Producto[]> {
    const response = await api.get('/productos?populate=categoria');
    const items = Array.isArray(response.data) ? response.data : response.data.data || [];
    return items.map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      referencia: item.referencia,
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio_unitario: parseFloat(item.precio_unitario) || 0,
      porcentaje_iva: parseFloat(item.porcentaje_iva) || 0,
      stock_actual: parseInt(item.stock_actual) || 0,
      stock_minimo: parseInt(item.stock_minimo) || 0,
      activo: item.activo,
      categoria: item.categoria ? {
        id: item.categoria.id,
        nombre: item.categoria.nombre,
      } : undefined,
    }));
  },

  // Crear nuevo producto
  async create(data: CreateProductoData): Promise<Producto> {
    const response = await api.post('/productos', {
      data: {
        ...data,
        activo: data.activo ?? true,
        porcentaje_iva: data.porcentaje_iva ?? 0
      }
    });
    const item = response.data.data || response.data;
    return {
      id: item.id,
      documentId: item.documentId,
      referencia: item.referencia,
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio_unitario: parseFloat(item.precio_unitario) || 0,
      porcentaje_iva: parseFloat(item.porcentaje_iva) || 0,
      stock_actual: parseInt(item.stock_actual) || 0,
      stock_minimo: parseInt(item.stock_minimo) || 0,
      activo: item.activo,
      categoria: item.categoria ? {
        id: item.categoria.id,
        nombre: item.categoria.nombre,
      } : undefined,
    };
  },

  // Actualizar producto - usar documentId en Strapi v5
  async update(documentId: string, data: Partial<CreateProductoData>): Promise<Producto> {
    const response = await api.put(`/productos/${documentId}`, { data });
    const item = response.data.data || response.data;
    return {
      id: item.id,
      documentId: item.documentId,
      referencia: item.referencia,
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio_unitario: parseFloat(item.precio_unitario) || 0,
      porcentaje_iva: parseFloat(item.porcentaje_iva) || 0,
      stock_actual: parseInt(item.stock_actual) || 0,
      stock_minimo: parseInt(item.stock_minimo) || 0,
      activo: item.activo,
      categoria: item.categoria ? {
        id: item.categoria.id,
        nombre: item.categoria.nombre,
      } : undefined,
    };
  },

  // Eliminar producto - usar documentId en Strapi v5
  async delete(documentId: string): Promise<void> {
    await api.delete(`/productos/${documentId}`);
  },

  // Obtener productos con bajo stock (stock_actual <= stock_minimo)
  async getProductosBajoStock(): Promise<Producto[]> {
    const response = await api.get('/productos?filters[activo][$eq]=true&populate=categoria');
    const items = Array.isArray(response.data) ? response.data : response.data.data || [];
    return items
      .map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        referencia: item.referencia,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio_unitario: parseFloat(item.precio_unitario) || 0,
        porcentaje_iva: parseFloat(item.porcentaje_iva) || 0,
        stock_actual: parseInt(item.stock_actual) || 0,
        stock_minimo: parseInt(item.stock_minimo) || 0,
        activo: item.activo,
        categoria: item.categoria ? {
          id: item.categoria.id,
          nombre: item.categoria.nombre,
        } : undefined,
      }))
      .filter((producto: Producto) => producto.stock_actual <= producto.stock_minimo);
  }
};
