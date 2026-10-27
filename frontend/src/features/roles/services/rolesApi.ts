import { api } from "@/lib/api";
import type {
    RolesResponse,
    Role,
    CreateRoleRequest,
    UpdateRoleRequest,
} from "../types/role.types";

export const fetchRoles = async (): Promise<RolesResponse> => {
    const response = await api.get<RolesResponse>("/roles");
    return response.data;
};

export const fetchRoleById = async (roleId: number): Promise<Role> => {
    const response = await api.get<{ success: boolean; role: Role }>(`/roles/${roleId}`);
    return response.data.role;
};

export const createRole = async (roleData: CreateRoleRequest): Promise<Role> => {
    const response = await api.post<{ success: boolean; role: Role }>("/roles", roleData);
    return response.data.role;
};

export const updateRole = async (roleId: number, roleData: UpdateRoleRequest): Promise<Role> => {
    const response = await api.put<{ success: boolean; role: Role }>(`/roles/${roleId}`, roleData);
    return response.data.role;
};

export const deleteRole = async (roleId: number): Promise<void> => {
    await api.delete(`/roles/${roleId}`);
};
