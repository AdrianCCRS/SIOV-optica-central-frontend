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
  data: MovimientoInventario;
}

export interface MovimientosListResponse {
  data: MovimientoInventario[];
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
    return response.data.data.map(item => ({
      id: item.id,
      tipo: item.tipo,
      cantidad: item.cantidad || 0,
      motivo: item.motivo,
      fecha: item.fecha,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      producto: item.producto ? {
        id: item.producto.id,
        nombre: item.producto.nombre || 'Sin nombre',
        codigo: item.producto.codigo || (item.producto as any).referencia || ''
      } : undefined
    }));
  },

  // Obtener movimiento por ID
  async getById(id: number): Promise<MovimientoInventario> {
    const response = await api.get<MovimientoResponse>(`/movimiento-inventarios/${id}?populate=producto`);
    return response.data.data;
  },

  // Crear nuevo movimiento
  async create(data: CreateMovimientoData): Promise<MovimientoInventario> {
    const response = await api.post<MovimientoResponse>('/movimiento-inventarios', {
      data
    });
    return response.data.data;
  },

  // Actualizar movimiento
  async update(id: number, data: Partial<CreateMovimientoData>): Promise<MovimientoInventario> {
    const response = await api.put<MovimientoResponse>(`/movimiento-inventarios/${id}`, {
      data
    });
    return response.data.data;
  },

  // Eliminar movimiento
  async delete(id: number): Promise<void> {
    await api.delete(`/movimiento-inventarios/${id}`);
  }
};
