import { useAuth } from "../context/AuthContext";

/**
 * Standard module names defined in the RBAC system.
 */
export type ModuleName = "Users" | "Roles" | "Permissions" | "Positions";

/**
 * Custom hook to check standard CRUD permissions for a specific module.
 * Reusable across all components without duplicating permission logic.
 *
 * @param module - The module/page name to check (e.g. "Users", "Roles", "Permissions", "Positions")
 */
export function useModulePermissions(module: ModuleName | string) {
    const { hasPermission, canAccessPage } = useAuth();

    const canView = hasPermission(module, "Read");
    const canCreate = hasPermission(module, "Create");
    const canUpdate = hasPermission(module, "Update");
    const canDelete = hasPermission(module, "Delete");
    const canAccess = canAccessPage(module);

    const hasAnyPermission = (actions: string[]): boolean => {
        return actions.some((action) => hasPermission(module, action));
    };

    const hasAllPermissions = (actions: string[]): boolean => {
        return actions.every((action) => hasPermission(module, action));
    };

    return {
        module,
        canView,
        canCreate,
        canUpdate,
        canDelete,
        canAccess,
        hasPermission: (action: string) => hasPermission(module, action),
        hasAnyPermission,
        hasAllPermissions,
    };
}
