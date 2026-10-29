import { api } from "@/lib/api";
import type { LoginRequest, LoginResponse, ProfileResponse } from "../types/auth.types";

export const loginUser = async (
    credentials: LoginRequest
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
        "/auth/login",
        credentials
    );

    return response.data;
};

export const fetchProfile = async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>("/auth/profile");
    return response.data;
};