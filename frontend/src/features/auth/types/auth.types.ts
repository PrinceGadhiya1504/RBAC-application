import type { UserPositionHistoryItem } from "@/features/users/types/user.types";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserPermissions {
    [page: string]: string[];
}

export interface AuthUser {
    user_id: number;
    full_name: string;
    email: string;
    contact_number?: string | null;
    profile_picture?: string | null;
    date_of_joining?: string | null;
    end_date?: string | null;
    role?: string | null;
    roles?: string[];
    role_name?: string | null;
    position_id?: number | null;
    position_name?: string | null;
    position_history?: UserPositionHistoryItem[];
    permissions?: UserPermissions;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    access_token: string;
    user: AuthUser;
}

export interface ProfileResponse {
    success: boolean;
    message: string;
    user: AuthUser;
}
