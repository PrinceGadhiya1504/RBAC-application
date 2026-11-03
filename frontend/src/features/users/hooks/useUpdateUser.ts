import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../services/usersApi";
import type { UpdateUserRequest, UserResponse } from "../types/user.types";

interface UpdateUserVariables {
    userId: number;
    userData: UpdateUserRequest;
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, userData }: UpdateUserVariables) =>
            updateUser(userId, userData),
        onSuccess: (data: UserResponse, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
            if (data?.user) {
                queryClient.setQueryData(["users", variables.userId], {
                    success: true,
                    user: data.user,
                });
            }
        },
    });
};

