import { useQuery } from "@tanstack/react-query";
import { fetchAllUserRoles } from "../services/userRolesApi";

export const useAllUserRoles = () => {
    return useQuery({
        queryKey: ["user-roles"],
        queryFn: fetchAllUserRoles,
    });
};