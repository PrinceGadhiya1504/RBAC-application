export interface User {
    user_id: number;
    full_name: string;
    email: string;
    contact_number?: string | null;
    date_of_joining?: string | null;
    role_id?: number | null;
    role_name?: string | null;
    position_id?: number | null;
    position_name?: string | null;
}

export interface UsersResponse {
    success: boolean;
    message?: string;
    users: User[];
}

export interface UserResponse {
    success: boolean;
    message?: string;
    user: User;
}

export interface CreateUserRequest {
    full_name: string;
    email: string;
    password: string;
    contact_number?: string;
    date_of_joining?: string;
    role_id?: number;
    position_id?: number;
}

export interface UpdateUserRequest {
    full_name: string;
    email: string;
    contact_number?: string;
    date_of_joining?: string;
    role_id?: number | null;
    position_id?: number | null;
}
