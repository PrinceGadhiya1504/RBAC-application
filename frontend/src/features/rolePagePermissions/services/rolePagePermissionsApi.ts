import { api } from "@/lib/api";
import type {
    RolePagePermissionsResponse,
    BulkSaveRolePagePermissionsRequest,
} from "../types/rolePagePermission.types";

export const fetchAllRolePagePermissions = async (): Promise<RolePagePermissionsResponse> => {
    const response = await api.get<RolePagePermissionsResponse>(
        "/role-page-permissions"
    );
    return response.data;
};

export const bulkSaveRolePagePermissions = async (
    data: BulkSaveRolePagePermissionsRequest
): Promise<void> => {
    await api.post("/role-page-permissions", data);
};