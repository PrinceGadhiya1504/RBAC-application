import { useQuery } from "@tanstack/react-query";
import { fetchPermissions } from "../services/permissionsApi";

export const usePermissions = () => {
    return useQuery({
        queryKey: ["permissions"],
        queryFn: fetchPermissions,
    });
};