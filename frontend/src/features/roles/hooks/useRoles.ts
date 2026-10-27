import { useQuery } from "@tanstack/react-query";
import { fetchRoles } from "../services/rolesApi";

export const useRoles = () => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: fetchRoles,
    });
};