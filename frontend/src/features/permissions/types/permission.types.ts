export interface Permission {
    permission_id: number;
    name: string;
}

export interface PermissionsResponse {
    success: boolean;
    permissions: Permission[];
}