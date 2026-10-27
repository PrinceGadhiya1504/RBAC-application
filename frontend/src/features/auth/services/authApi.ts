import { api } from "@/lib/api";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export const loginUser = async (
    credentials: LoginRequest
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
        "/auth/login",
        credentials
    );

    return response.data;
};