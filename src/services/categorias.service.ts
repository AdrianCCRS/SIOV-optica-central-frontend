import api from './api';

export interface CategoriaProducto {
  id: number;
  documentId: string; // Usado para eliminación en Strapi v5
  nombre: string;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriaResponse {
  data: CategoriaProducto;
}

export interface CategoriasListResponse {
  data: CategoriaProducto[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface CreateCategoriaData {
  nombre: string;
  descripcion?: string;
}

export const categoriasService = {
  // Obtener todas las categorías
  async getAll(): Promise<CategoriaProducto[]> {
    const response = await api.get<CategoriasListResponse>('/categoria-productos');
    // Mapear explícitamente para asegurar que documentId esté presente
    return response.data.data.map(item => ({
      id: item.id,
      documentId: item.documentId,
      nombre: item.nombre,
      descripcion: item.descripcion,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  },

  // Obtener categoría por documentId
  async getById(documentId: string): Promise<CategoriaProducto> {
    const response = await api.get<CategoriaResponse>(`/categoria-productos/${documentId}`);
    const item = response.data.data;
    return {
      id: item.id,
      documentId: item.documentId,
      nombre: item.nombre,
      descripcion: item.descripcion,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  },

  // Crear nueva categoría
  async create(data: CreateCategoriaData): Promise<CategoriaProducto> {
    const response = await api.post<CategoriaResponse>('/categoria-productos', {
      data
    });
    const item = response.data.data;
    return {
      id: item.id,
      documentId: item.documentId,
      nombre: item.nombre,
      descripcion: item.descripcion,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  },

  // Actualizar categoría - usar documentId en Strapi v5
  async update(documentId: string, data: Partial<CreateCategoriaData>): Promise<CategoriaProducto> {
    const response = await api.put<CategoriaResponse>(`/categoria-productos/${documentId}`, {
      data
    });
    const item = response.data.data;
    return {
      id: item.id,
      documentId: item.documentId,
      nombre: item.nombre,
      descripcion: item.descripcion,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  },

  // Eliminar categoría - usar documentId en Strapi v5
  async delete(documentId: string): Promise<void> {
    console.log('categoriasService.delete - URL completa:', `/categoria-productos/${documentId}`);
    const response = await api.delete(`/categoria-productos/${documentId}`);
    console.log('categoriasService.delete - Respuesta:', response);
  }
};
