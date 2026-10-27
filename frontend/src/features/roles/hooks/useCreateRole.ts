import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole } from "../services/rolesApi";
import type { CreateRoleRequest } from "../types/role.types";

export const useCreateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (roleData: CreateRoleRequest) => createRole(roleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
};