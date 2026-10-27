import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignRoleToUser } from "../services/userRolesApi";
import type { AssignRoleRequest } from "../types/role.types";

export const useAssignRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AssignRoleRequest) => assignRoleToUser(data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["user-roles"] });
            queryClient.invalidateQueries({ queryKey: ["user-roles", variables.user_id] });
        },
    });
};