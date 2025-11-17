import api from "./api";

export interface Usuario {
    id: number;
    documentId: string;
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
            id: item.id,
            nombres: item.nombres,
            apellidos: item.apellidos,
            documentId: item.documentId,
            username: item.username,
            email: item.email,
            role: item.role ? item.role.name : 'N/A',
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }));
    }
}