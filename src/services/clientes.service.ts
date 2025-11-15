import api from './api';

export interface Cliente {
  id: number;
  tipo_identificacion: 'CC' | 'CE' | 'NIT' | 'Pasaporte';
  numero_identificacion: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export const clientesService = {
  // Obtener todos los clientes
  async obtenerClientes(): Promise<Cliente[]> {
    const response = await api.get('/clientes');
    const items = Array.isArray(response.data) ? response.data : response.data.data || [];
    return items.map((item: any) => ({
      id: item.id,
      ...(item.attributes || item),
    }));
  },

  // Buscar clientes por nombre o identificación
  async buscarClientes(query: string): Promise<Cliente[]> {
    const response = await api.get(`/clientes?filters[$or][0][nombres][$containsi]=${query}&filters[$or][1][apellidos][$containsi]=${query}&filters[$or][2][numero_identificacion][$containsi]=${query}`);
    const items = Array.isArray(response.data) ? response.data : response.data.data || [];
    return items.map((item: any) => ({
      id: item.id,
      ...(item.attributes || item),
    }));
  },

  // Obtener un cliente por ID
  async obtenerCliente(id: number): Promise<Cliente> {
    const response = await api.get(`/clientes/${id}`);
    const item = response.data.data || response.data;
    return {
      id: item.id,
      ...(item.attributes || item),
    };
  },

  // Crear un nuevo cliente
  async crearCliente(data: Omit<Cliente, 'id'>): Promise<Cliente> {
    const response = await api.post('/clientes', { data });
    const item = response.data.data || response.data;
    return {
      id: item.id,
      ...(item.attributes || item),
    };
  },
};
