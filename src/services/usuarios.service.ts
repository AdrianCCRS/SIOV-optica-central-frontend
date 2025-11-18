import api from "./api";

export interface Usuario {
    documentId: number;
    username: string;
    email: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
}

export const usuariosService = {
    async getAllUsuariosPermitidos(): Promise<Usuario[]> {
        const response = await api.get(  `/users?filters[$or][0][role][name][$eq]=Cajero&filters[$or][1][role][name][$eq]=Bodeguero&populate=role`);
        const items = Array.isArray(response.data) ? response.data : response.data.data || [];
        return items.map((item: any) => ({
            documentId: item.documentId,
            nombres: item.nombres,
            apelldocumentIdos: item.apelldocumentIdos,
            username: item.username,
            email: item.email,
            activo: item.activo,
            role: item.role ? item.role.name : 'N/A',
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }));
    },

    async createUsuario(data: Omit<Usuario, 'documentId' | 'documentId' | 'createdAt' | 'updatedAt'>): Promise<Usuario> {
        const response = await api.post('/users', { data });
        const item = response.data.data || response.data;
        return item;
    },

    async updateUsuario(documentId: string, data: Partial<Omit<Usuario, 'documentId' | 'documentId' | 'createdAt' | 'updatedAt'>>): Promise<Usuario> {
        const response = await api.put(`/users/${documentId}`, { data });
        const item = response.data.data || response.data;
        return {
            documentId: item.documentId,
            username: item.username,
            email: item.email,
            role: item.role ? item.role.name : 'N/A',
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        };
    }
}