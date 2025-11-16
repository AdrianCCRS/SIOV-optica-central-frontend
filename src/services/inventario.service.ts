import api from './api';

export interface MovimientoInventario {
  id: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  motivo?: string;
  fecha: string;
  producto?: {
    id: number;
    nombre: string;
    codigo: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface MovimientoResponse {
  data: {
    id: number;
    attributes: Omit<MovimientoInventario, 'id'>;
  };
}

export interface MovimientosListResponse {
  data: Array<{
    id: number;
    attributes: Omit<MovimientoInventario, 'id'>;
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

export interface CreateMovimientoData {
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  motivo?: string;
  fecha: string;
  producto: number; // ID del producto
}

export const inventarioService = {
  // Obtener todos los movimientos con filtros opcionales
  async getAll(filters?: {
    tipo?: 'entrada' | 'salida' | 'ajuste';
    productoId?: number;
    fechaInicio?: string;
    fechaFin?: string;
  }): Promise<MovimientoInventario[]> {
    let url = '/movimiento-inventarios?populate=producto&sort=fecha:desc';
    
    if (filters?.tipo) {
      url += `&filters[tipo][$eq]=${filters.tipo}`;
    }
    if (filters?.productoId) {
      url += `&filters[producto][id][$eq]=${filters.productoId}`;
    }
    if (filters?.fechaInicio) {
      url += `&filters[fecha][$gte]=${filters.fechaInicio}`;
    }
    if (filters?.fechaFin) {
      url += `&filters[fecha][$lte]=${filters.fechaFin}`;
    }

    const response = await api.get<MovimientosListResponse>(url);
    return response.data.data.map(item => {
      const producto = item.attributes.producto as any;
      return {
        id: item.id,
        ...item.attributes,
        producto: producto?.data ? {
          id: producto.data.id,
          nombre: producto.data.attributes.nombre,
          codigo: producto.data.attributes.codigo
        } : undefined
      };
    });
  },

  // Obtener movimiento por ID
  async getById(id: number): Promise<MovimientoInventario> {
    const response = await api.get<MovimientoResponse>(`/movimiento-inventarios/${id}?populate=producto`);
    const producto = response.data.data.attributes.producto as any;
    return {
      id: response.data.data.id,
      ...response.data.data.attributes,
      producto: producto?.data ? {
        id: producto.data.id,
        nombre: producto.data.attributes.nombre,
        codigo: producto.data.attributes.codigo
      } : undefined
    };
  },

  // Crear nuevo movimiento
  async create(data: CreateMovimientoData): Promise<MovimientoInventario> {
    const response = await api.post<MovimientoResponse>('/movimiento-inventarios', {
      data
    });
    return {
      id: response.data.data.id,
      ...response.data.data.attributes
    };
  },

  // Actualizar movimiento
  async update(id: number, data: Partial<CreateMovimientoData>): Promise<MovimientoInventario> {
    const response = await api.put<MovimientoResponse>(`/movimiento-inventarios/${id}`, {
      data
    });
    return {
      id: response.data.data.id,
      ...response.data.data.attributes
    };
  },

  // Eliminar movimiento
  async delete(id: number): Promise<void> {
    await api.delete(`/movimiento-inventarios/${id}`);
  }
};
