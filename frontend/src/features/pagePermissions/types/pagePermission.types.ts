export interface PagePermissionMapping {
    page_permission_id: number;
    page_id: number;
    page_name: string;
    permission_id: number;
    permission_name: string;
}

export interface PagePermissionsResponse {
    success: boolean;
    page_permissions: PagePermissionMapping[];
}