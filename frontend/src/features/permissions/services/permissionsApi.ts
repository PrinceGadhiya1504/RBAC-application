import { api } from "@/lib/api";
import type { PermissionsResponse } from "../types/permission.types";

export const fetchPermissions = async (): Promise<PermissionsResponse> => {
    const response = await api.get<PermissionsResponse>("/permissions");
    return response.data;
};