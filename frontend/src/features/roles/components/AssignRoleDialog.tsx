import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRoles } from "../hooks/useRoles";
import { useUserRoles } from "../hooks/useUserRoles";
import { useAssignRole } from "../hooks/useAssignRole";
import { useRemoveRole } from "../hooks/useRemoveRole";
import type { User } from "@/features/users/types/user.types";
import { Shield, ShieldAlert, User as UserIcon, Ban } from "lucide-react";
import axios from "axios";

interface AssignRoleDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AssignRoleDialog({
    user,
    open,
    onOpenChange,
}: AssignRoleDialogProps) {
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [actionError, setActionError] = useState<string | null>(null);

    const { data: rolesData, isPending: isRolesLoading } = useRoles();
    const { data: userRolesData, isPending: isUserRolesLoading } = useUserRoles(
        user?.user_id
    );

    const { mutate: assignRole, isPending: isAssigning } = useAssignRole();
    const { mutate: removeRole, isPending: isRemoving } = useRemoveRole();

    const allRoles = rolesData?.roles || [];
    const currentRole =
        userRolesData?.role ||
        (userRolesData?.roles && userRolesData.roles.length > 0
            ? userRolesData.roles[0]
            : null);

    useEffect(() => {
        if (open) {
            setActionError(null);
            if (currentRole) {
                setSelectedRoleId(String(currentRole.role_id));
            } else {
                setSelectedRoleId("");
            }
        }
    }, [open, currentRole]);

    const currentRoleIdStr = currentRole ? String(currentRole.role_id) : "";
    const hasChanged = selectedRoleId !== currentRoleIdStr;
    const isSubmitting = isAssigning || isRemoving;

    const handleSave = () => {
        if (!user) return;
        setActionError(null);

        if (!selectedRoleId || selectedRoleId === "none") {
            if (currentRole) {
                removeRole(
                    {
                        userId: user.user_id,
                        roleId: currentRole.role_id,
                    },
                    {
                        onSuccess: () => {
                            onOpenChange(false);
                        },
                        onError: (err) => {
                            if (axios.isAxiosError(err)) {
                                setActionError(
                                    err.response?.data?.message || "Failed to remove role."
                                );
                            } else {
                                setActionError((err as Error).message || "Failed to remove role.");
                            }
                        },
                    }
                );
            } else {
                onOpenChange(false);
            }
            return;
        }

        assignRole(
            {
                user_id: user.user_id,
                role_id: Number(selectedRoleId),
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (err) => {
                    if (axios.isAxiosError(err)) {
                        setActionError(
                            err.response?.data?.message || "Failed to assign role."
                        );
                    } else {
                        setActionError((err as Error).message || "Failed to assign role.");
                    }
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="size-5 text-primary" />
                        Assign Role
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-1">
                    <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <UserIcon className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-foreground truncate">
                                {user?.full_name}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">
                                {user?.email}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground block">
                                Current Role
                            </span>
                            {isUserRolesLoading ? (
                                <span className="inline-block size-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            ) : currentRole ? (
                                <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                    {currentRole.name}
                                </span>
                            ) : (
                                <span className="text-xs text-muted-foreground italic">
                                    Unassigned
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Select Single Role
                            </label>

                        </div>

                        {isRolesLoading ? (
                            <div className="flex h-36 items-center justify-center rounded-xl border bg-muted/20">
                                <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                <div
                                    onClick={() => setSelectedRoleId("")}
                                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${selectedRoleId === ""
                                        ? "border-primary bg-primary/5 shadow-xs"
                                        : "border-border hover:bg-muted/40"
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`size-4 rounded-full border flex items-center justify-center ${selectedRoleId === ""
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-muted-foreground/40"
                                                }`}
                                        >
                                            {selectedRoleId === "" && (
                                                <div className="size-1.5 rounded-full bg-background" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                                <Ban className="size-3.5 text-muted-foreground" />
                                                No Role (Unassigned)
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Remove role access from this user
                                            </p>
                                        </div>
                                    </div>
                                    {!currentRole && (
                                        <span className="text-[10px] font-medium text-muted-foreground rounded-md bg-muted px-2 py-0.5">
                                            Current
                                        </span>
                                    )}
                                </div>

                                {allRoles.map((r) => {
                                    const isSelected = selectedRoleId === String(r.role_id);
                                    const isCurrent = currentRole?.role_id === r.role_id;

                                    return (
                                        <div
                                            key={r.role_id}
                                            onClick={() => setSelectedRoleId(String(r.role_id))}
                                            className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${isSelected
                                                ? "border-primary bg-primary/5 shadow-xs"
                                                : "border-border hover:bg-muted/40"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div
                                                    className={`size-4 shrink-0 rounded-full border flex items-center justify-center ${isSelected
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-muted-foreground/40"
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <div className="size-1.5 rounded-full bg-background" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                                        <Shield className="size-3.5 text-primary shrink-0" />
                                                        <span className="truncate">{r.name}</span>
                                                    </p>
                                                    {r.description ? (
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {r.description}
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-muted-foreground italic">
                                                            No description
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {isCurrent && (
                                                <span className="shrink-0 text-[10px] font-semibold text-primary rounded-md bg-primary/10 px-2 py-0.5 ml-2">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {actionError && (
                        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                            <ShieldAlert className="size-4 shrink-0" />
                            <span>{actionError}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-2 border-t pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={!hasChanged || isSubmitting}
                            onClick={handleSave}
                            className="gap-1.5"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="size-3.5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Save Role
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
