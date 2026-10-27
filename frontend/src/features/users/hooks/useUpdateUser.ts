import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../services/usersApi";
import type { UpdateUserRequest } from "../types/user.types";

interface UpdateUserVariables {
    userId: number;
    userData: UpdateUserRequest;
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, userData }: UpdateUserVariables) =>
            updateUser(userId, userData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },
    });
};
