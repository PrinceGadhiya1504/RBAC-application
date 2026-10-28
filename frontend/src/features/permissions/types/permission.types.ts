export interface Permission {
    permission_id: number;
    name: string;
}

export interface PermissionsResponse {
    success: boolean;
    permissions: Permission[];
}

export interface PermissionResponse {
    success: boolean;
    permission: Permission;
    message?: string;
}