import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeRoleFromUser } from "../services/userRolesApi";

export const useRemoveRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, roleId }: { userId: number; roleId?: number }) =>
            removeRoleFromUser({ userId, roleId }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["user-roles"] });
            queryClient.invalidateQueries({ queryKey: ["user-roles", variables.userId] });
        },
    });
};