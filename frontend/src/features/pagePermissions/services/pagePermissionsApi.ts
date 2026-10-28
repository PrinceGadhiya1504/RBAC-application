import { api } from "@/lib/api";
import type { PagePermissionsResponse } from "../types/pagePermission.types";

export const fetchAllPagePermissions = async (): Promise<PagePermissionsResponse> => {
    const response = await api.get<PagePermissionsResponse>("/page-permissions");
    return response.data;
};