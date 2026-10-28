import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkSaveRolePagePermissions } from "../services/rolePagePermissionsApi";
import type { BulkSaveRolePagePermissionsRequest } from "../types/rolePagePermission.types";

export const useBulkSaveRolePagePermissions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BulkSaveRolePagePermissionsRequest) =>
            bulkSaveRolePagePermissions(data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["role-page-permissions"] });
            queryClient.invalidateQueries({
                queryKey: ["role-page-permissions", variables.role_id],
            });
        },
    });
};