import api from './api';

export interface CategoriaProducto {
  id: number;
  nombre: string;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriaResponse {
  data: {
    id: number;
    attributes: Omit<CategoriaProducto, 'id'>;
  };
}

export interface CategoriasListResponse {
  data: Array<{
    id: number;
    attributes: Omit<CategoriaProducto, 'id'>;
  }>;
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
    return response.data.data.map(item => ({
      id: item.id,
      ...item.attributes
    }));
  },

  // Obtener categoría por ID
  async getById(id: number): Promise<CategoriaProducto> {
    const response = await api.get<CategoriaResponse>(`/categoria-productos/${id}`);
    return {
      id: response.data.data.id,
      ...response.data.data.attributes
    };
  },

  // Crear nueva categoría
  async create(data: CreateCategoriaData): Promise<CategoriaProducto> {
    const response = await api.post<CategoriaResponse>('/categoria-productos', {
      data
    });
    return {
      id: response.data.data.id,
      ...response.data.data.attributes
    };
  },

  // Actualizar categoría
  async update(id: number, data: Partial<CreateCategoriaData>): Promise<CategoriaProducto> {
    const response = await api.put<CategoriaResponse>(`/categoria-productos/${id}`, {
      data
    });
    return {
      id: response.data.data.id,
      ...response.data.data.attributes
    };
  },

  // Eliminar categoría
  async delete(id: number): Promise<void> {
    await api.delete(`/categoria-productos/${id}`);
  }
};
