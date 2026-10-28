import { useQuery } from "@tanstack/react-query";
import { fetchAllPagePermissions } from "../services/pagePermissionsApi";

export const usePagePermissions = () => {
    return useQuery({
        queryKey: ["page-permissions"],
        queryFn: fetchAllPagePermissions,
    });
};