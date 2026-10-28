export interface RolePagePermissionMapping {
    role_page_permission_id: number;
    role_id: number;
    role_name: string;
    page_permission_id: number;
    page_id: number;
    page_name: string;
    permission_id: number;
    permission_name: string;
    is_given: boolean;
}

export interface RolePagePermissionsResponse {
    success: boolean;
    role_page_permissions: RolePagePermissionMapping[];
}

export interface BulkSaveRolePagePermissionsRequest {
    role_id: number;
    permissions: Array<{
        page_permission_id: number;
        is_given: boolean;
    }>;
}