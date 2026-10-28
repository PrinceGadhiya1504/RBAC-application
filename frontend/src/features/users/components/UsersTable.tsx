import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useUsers } from "../hooks/useUsers";
import type { User } from "../types/user.types";
import EditUserForm from "./EditUserForm";
import CreateUserForm from "./CreateUserForm";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Edit2, Trash2, Users, UserPlus } from "lucide-react";
import axios from "axios";

export default function UsersTable() {
    const { hasPermission } = useAuth();
    const canCreate = hasPermission("Users", "Create");
    const canEdit = hasPermission("Users", "Update");
    const canDelete = hasPermission("Users", "Delete");

    const { data, isPending, isError, error } = useUsers();
    const {
        mutate: deleteUser,
        isPending: isDeleting,
        isError: isDeleteError,
        error: deleteError,
    } = useDeleteUser();

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    if (isPending) {
        return (
            <div className="flex h-48 items-center justify-center rounded-xl border bg-card p-6 text-muted-foreground shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm">Loading users...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
                <p className="text-sm font-medium">{error.message || "Failed to load users."}</p>
            </div>
        );
    }

    const usersList = data?.users || [];

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Users className="size-5 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight">Users List</h2>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {usersList.length} total
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Manage organization users, their assigned roles, and organizational positions.
                    </p>
                </div>

                {canCreate && (
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-sm cursor-pointer">
                        <UserPlus className="size-4" />
                        Create User
                    </Button>
                )}
            </div>

            <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-semibold">ID</th>
                            <th className="px-4 py-3 font-semibold">Full Name</th>
                            <th className="px-4 py-3 font-semibold">Email</th>
                            <th className="px-4 py-3 font-semibold">Role</th>
                            <th className="px-4 py-3 font-semibold">Position</th>
                            <th className="px-4 py-3 font-semibold">Contact</th>
                            <th className="px-4 py-3 font-semibold">Date Joined</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {usersList.map((user, index) => (
                            <tr key={user.user_id} className="transition-colors hover:bg-muted/30">
                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                    #{index + 1}
                                </td>
                                <td className="px-4 py-3 font-medium text-foreground">
                                    {user.full_name}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {user.email}
                                </td>
                                <td className="px-4 py-3">
                                    {user.role_name ? (
                                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs">
                                            {user.role_name}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">No role</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {user.position_name ? (
                                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs">
                                            {user.position_name}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">No position</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                    {user.contact_number || "-"}
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                    {user.date_of_joining
                                        ? new Date(user.date_of_joining).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {canEdit && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedUser(user)}
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
                                                        `Are you sure you want to delete ${user.full_name}?`
                                                    );

                                                    if (confirmed) {
                                                        deleteUser(user.user_id);
                                                    }
                                                }}
                                                className="h-8 gap-1.5 cursor-pointer"
                                            >
                                                <Trash2 className="size-3.5" />
                                                Delete
                                            </Button>
                                        )}

                                        {!canEdit && !canDelete && (
                                            <span className="text-xs text-muted-foreground italic">Read-only</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {usersList.length === 0 && (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isDeleteError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
                    <p className="text-sm font-medium">
                        {axios.isAxiosError(deleteError)
                            ? deleteError.response?.data?.message || "Failed to delete user."
                            : deleteError.message || "Failed to delete user."}
                    </p>
                </div>
            )}

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>
                    <CreateUserForm
                        onCancel={() => setIsCreateOpen(false)}
                        onSuccess={() => setIsCreateOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={Boolean(selectedUser)}
                onOpenChange={(open) => !open && setSelectedUser(null)}
            >
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <EditUserForm
                            user={selectedUser}
                            onCancel={() => setSelectedUser(null)}
                            onSuccess={() => setSelectedUser(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}