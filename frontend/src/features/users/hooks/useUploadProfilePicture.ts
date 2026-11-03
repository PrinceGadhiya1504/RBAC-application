import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadUserProfilePicture } from "../services/usersApi";
import type { UserResponse } from "../types/user.types";
import { useAuth } from "@/features/auth/context/AuthContext";

interface UploadProfilePictureVariables {
    userId: number;
    file: File;
}

export const useUploadProfilePicture = () => {
    const queryClient = useQueryClient();
    const { user: authUser, refreshProfile } = useAuth();

    return useMutation({
        mutationFn: ({ userId, file }: UploadProfilePictureVariables) =>
            uploadUserProfilePicture(userId, file),
        onSuccess: async (data: UserResponse, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });

            if (data?.user) {
                queryClient.setQueryData(["users", variables.userId], {
                    success: true,
                    user: data.user,
                });
            }

            // If the logged in user is updating their own profile picture, update auth state across app
            if (authUser && authUser.user_id === variables.userId) {
                await refreshProfile();
            }
        },
    });
};

