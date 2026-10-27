import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRole } from "../services/rolesApi";
import type { UpdateRoleRequest } from "../types/role.types";

interface UpdateRoleVariables {
    roleId: number;
    roleData: UpdateRoleRequest;
}

export const useUpdateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roleId, roleData }: UpdateRoleVariables) =>
            updateRole(roleId, roleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
};