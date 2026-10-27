export interface Role {
    role_id: number;
    name: string;
    description?: string | null;
}

export interface RolesResponse {
    success: boolean;
    message?: string;
    roles: Role[];
}

export interface RoleResponse {
    success: boolean;
    message?: string;
    role: Role;
}

export interface CreateRoleRequest {
    name: string;
    description?: string;
}

export interface UpdateRoleRequest {
    name?: string;
    description?: string;
}

export interface UserRoleAssignment {
    user_role_id: number;
    user_id: number;
    user_name?: string | null;
    role_id: number;
    role_name?: string | null;
}

export interface UserRolesResponse {
    success: boolean;
    user_roles: UserRoleAssignment[];
}

export interface UserSpecificRolesResponse {
    success: boolean;
    user: {
        user_id: number;
        full_name: string;
    };
    role?: Role | null;
    roles?: Role[];
}

export interface AssignRoleRequest {
    user_id: number;
    role_id: number;
}
