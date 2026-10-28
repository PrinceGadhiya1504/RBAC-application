import { api } from "@/lib/api";
import type {
    PermissionsResponse,
    PermissionResponse,
} from "../types/permission.types";

export const fetchPermissions = async (): Promise<PermissionsResponse> => {
    const response = await api.get<PermissionsResponse>("/permissions");
    return response.data;
};

export const fetchPermissionById = async (
    permissionId: number
): Promise<PermissionResponse> => {
    const response = await api.get<PermissionResponse>(`/permissions/${permissionId}`);
    return response.data;
};