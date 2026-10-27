import { useQuery } from "@tanstack/react-query";
import { fetchUserRoles } from "../services/userRolesApi";

export const useUserRoles = (userId?: number) => {
    return useQuery({
        queryKey: ["user-roles", userId],
        queryFn: () => fetchUserRoles(userId!),
        enabled: Boolean(userId),
    });
};