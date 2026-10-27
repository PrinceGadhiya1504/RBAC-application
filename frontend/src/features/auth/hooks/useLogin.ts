import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const useLogin = (options?: {
    onSuccess?: (data: LoginResponse) => void;
}) => {
    const { login } = useAuth();

    return useMutation({
        mutationFn: (credentials: LoginRequest) => loginUser(credentials),

        onSuccess: (data) => {
            login(data.access_token, data.user);
            options?.onSuccess?.(data);
        },
    });
};