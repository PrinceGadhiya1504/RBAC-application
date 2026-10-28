import { useState } from "react";
import { useRoles } from "../hooks/useRoles";
import { useDeleteRole } from "../hooks/useDeleteRole";
import { useAllUserRoles } from "../hooks/useAllUserRoles";
import type { Role } from "../types/role.types";
import CreateRoleForm from "./CreateRoleForm";
import EditRoleForm from "./EditRoleForm";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModulePermissions } from "@/features/auth/hooks/useModulePermissions";
import AccessDeniedCard from "@/features/auth/components/AccessDeniedCard";
import { Shield, Plus, Edit2, Trash2, Users } from "lucide-react";
import axios from "axios";

export default function RolesTable() {
    const { canView, canCreate, canUpdate, canDelete } = useModulePermissions("Roles");
    const { data: rolesData, isPending, isError, error } = useRoles();
    const { data: userRolesData } = useAllUserRoles();
    const {
        mutate: deleteRole,
        isPending: isDeleting,
        isError: isDeleteError,
        error: deleteError,
    } = useDeleteRole();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const rolesList = rolesData?.roles || [];
    const userRoles = userRolesData?.user_roles || [];

    // Map roleId -> count of assigned users
    const roleUserCounts: Record<number, number> = {};
    for (const assignment of userRoles) {
        roleUserCounts[assignment.role_id] =
            (roleUserCounts[assignment.role_id] || 0) + 1;
    }

    if (!canView) {
        return <AccessDeniedCard module="Roles" />;
    }

    if (isPending) {
        return (
            <div className="flex h-48 items-center justify-center rounded-xl border bg-card p-6 text-muted-foreground shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm">Loading roles...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
                <p className="text-sm font-medium">{error.message || "Failed to load roles."}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Shield className="size-5 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight text-foreground">
                            Roles List
                        </h2>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {rolesList.length} total
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Manage security roles and view how many members are assigned.
                    </p>
                </div>

                {canCreate && (
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-sm cursor-pointer">
                        <Plus className="size-4" />
                        Create Role
                    </Button>
                )}
            </div>

            <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-semibold">ID</th>
                            <th className="px-4 py-3 font-semibold">Role Name</th>
                            <th className="px-4 py-3 font-semibold">Description</th>
                            <th className="px-4 py-3 font-semibold">Members</th>
                            {(canUpdate || canDelete) && (
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {rolesList.map((role) => (
                            <tr
                                key={role.role_id}
                                className="transition-colors hover:bg-muted/30"
                            >
                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                    #{role.role_id}
                                </td>
                                <td className="px-4 py-3 font-medium text-foreground">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                            {role.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                                    {role.description || "-"}
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Users className="size-3.5 text-muted-foreground" />
                                        <span>{roleUserCounts[role.role_id] || 0} users</span>
                                    </div>
                                </td>
                                {(canUpdate || canDelete) && (
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {canUpdate && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setSelectedRole(role)}
                                                    className="h-8 gap-1.5 cursor-pointer"
                                                >
                                                    <Edit2 className="size-3.5" />
                                                    Edit
                                                </Button>
                                            )}

                                            {canDelete && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    disabled={isDeleting}
                                                    onClick={() => {
                                                        const confirmed = window.confirm(
                                                            `Are you sure you want to delete the "${role.name}" role?`
                                                        );

                                                        if (confirmed) {
                                                            deleteRole(role.role_id);
                                                        }
                                                    }}
                                                    className="h-8 gap-1.5 cursor-pointer"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}

                        {rolesList.length === 0 && (
                            <tr>
                                <td colSpan={canUpdate || canDelete ? 5 : 4} className="p-8 text-center text-muted-foreground">
                                    No roles found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isDeleteError && (
                <p className="text-sm text-destructive" role="alert">
                    {axios.isAxiosError(deleteError)
                        ? deleteError.response?.data?.message || "Failed to delete role."
                        : deleteError.message || "Failed to delete role."}
                </p>
            )}

            {/* Create Role Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Role</DialogTitle>
                    </DialogHeader>

                    <CreateRoleForm
                        onCancel={() => setIsCreateOpen(false)}
                        onSuccess={() => setIsCreateOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Role Modal */}
            <Dialog
                open={selectedRole !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedRole(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                    </DialogHeader>

                    {selectedRole && (
                        <EditRoleForm
                            key={selectedRole.role_id}
                            role={selectedRole}
                            onCancel={() => setSelectedRole(null)}
                            onSuccess={() => setSelectedRole(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
