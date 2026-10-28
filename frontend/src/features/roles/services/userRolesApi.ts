import { api } from "@/lib/api";
import type { UserRolesResponse } from "../types/role.types";

export const fetchAllUserRoles = async (): Promise<UserRolesResponse> => {
    const response = await api.get<UserRolesResponse>("/user-roles");
    return response.data;
};