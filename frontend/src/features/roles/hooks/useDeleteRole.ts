import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole } from "../services/rolesApi";

export const useDeleteRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (roleId: number) => deleteRole(roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
};