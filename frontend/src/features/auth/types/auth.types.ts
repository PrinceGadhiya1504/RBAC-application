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
    date_of_joining?: string | null;
    roles?: string[];
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
