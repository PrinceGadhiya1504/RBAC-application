import { useQuery } from "@tanstack/react-query";
import { fetchAllRolePagePermissions } from "../services/rolePagePermissionsApi";

export const useRolePagePermissions = () => {
    return useQuery({
        queryKey: ["role-page-permissions"],
        queryFn: fetchAllRolePagePermissions,
    });
};