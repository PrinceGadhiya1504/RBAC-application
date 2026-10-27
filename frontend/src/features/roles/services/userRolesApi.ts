import { api } from "@/lib/api";
import type {
    UserRolesResponse,
    UserSpecificRolesResponse,
    AssignRoleRequest,
} from "../types/role.types";

export const fetchAllUserRoles = async (): Promise<UserRolesResponse> => {
    const response = await api.get<UserRolesResponse>("/user-roles");
    return response.data;
};

export const fetchUserRoles = async (userId: number): Promise<UserSpecificRolesResponse> => {
    const response = await api.get<UserSpecificRolesResponse>(`/user-roles/${userId}`);
    return response.data;
};

export const assignRoleToUser = async (data: AssignRoleRequest): Promise<void> => {
    await api.post("/user-roles", data);
};

export const removeRoleFromUser = async ({ userId, roleId }: { userId: number; roleId?: number; }): Promise<void> => {
    if (roleId) {
        await api.delete(`/user-roles/${userId}/${roleId}`);
    } else {
        await api.delete(`/user-roles/${userId}`);
    }
};