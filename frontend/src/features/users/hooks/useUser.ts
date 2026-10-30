import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "../services/usersApi";

export const useUser = (userId?: number) => {
    return useQuery({
        queryKey: ["users", userId],
        queryFn: () => fetchUserById(userId!),
        enabled: Boolean(userId),
    });
};