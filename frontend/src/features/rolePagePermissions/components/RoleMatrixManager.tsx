import { useState, useMemo, useEffect } from "react";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { usePages } from "@/features/pages/hooks/usePages";
import { usePermissions } from "@/features/permissions/hooks/usePermissions";
import { usePagePermissions } from "@/features/pagePermissions/hooks/usePagePermissions";
import { useRolePagePermissions } from "../hooks/useRolePagePermissions";
import { useBulkSaveRolePagePermissions } from "../hooks/useBulkSaveRolePagePermissions";
import { useModulePermissions } from "@/features/auth/hooks/useModulePermissions";
import { useAuth } from "@/features/auth/context/AuthContext";
import AccessDeniedCard from "@/features/auth/components/AccessDeniedCard";
import { Button } from "@/components/ui/button";
import {
    Shield,
    Check,
    AlertCircle,
    CheckCircle2,
    SlidersHorizontal,
    RotateCcw,
} from "lucide-react";
import axios from "axios";

interface StandardColumn {
    key: string;
    label: string;
    matchNames: string[];
}

const STANDARD_COLUMNS: StandardColumn[] = [
    { key: "ADD", label: "ADD", matchNames: ["create", "add", "write"] },
    { key: "VIEW", label: "VIEW", matchNames: ["read", "view"] },
    { key: "UPDATE", label: "UPDATE", matchNames: ["update", "edit"] },
    { key: "DELETE", label: "DELETE", matchNames: ["delete", "remove"] },
];

export default function RoleMatrixManager() {
    const { refreshProfile } = useAuth();
    const { canView, canUpdate, canCreate } = useModulePermissions("Permissions");
    const canEdit = canUpdate || canCreate;

    const { data: rolesData, isPending: isRolesLoading } = useRoles();
    const { data: pagesData, isPending: isPagesLoading } = usePages();
    const { data: permissionsData, isPending: isPermissionsLoading } = usePermissions();
    const { data: pagePermsData, isPending: isPagePermsLoading } = usePagePermissions();
    const {
        data: rolePagePermsData,
        isPending: isRolePagePermsLoading,
        isError,
        error,
    } = useRolePagePermissions();

    const { mutate: bulkSave, isPending: isSaving } = useBulkSaveRolePagePermissions();

    const roles = useMemo(() => rolesData?.roles || [], [rolesData]);
    const pages = useMemo(() => pagesData?.pages || [], [pagesData]);
    const permissions = useMemo(() => permissionsData?.permissions || [], [permissionsData]);
    const pagePermissions = useMemo(
        () => pagePermsData?.page_permissions || [],
        [pagePermsData]
    );
    const rolePagePermissions = useMemo(
        () => rolePagePermsData?.role_page_permissions || [],
        [rolePagePermsData]
    );

    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [localOverrides, setLocalOverrides] = useState<Record<string, boolean>>({});
    const [actionError, setActionError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (roles.length > 0 && selectedRoleId === null) {
            setSelectedRoleId(roles[0].role_id);
        }
    }, [roles, selectedRoleId]);

    const activeRole = useMemo(() => {
        return roles.find((r) => r.role_id === selectedRoleId) || roles[0];
    }, [roles, selectedRoleId]);

    const pagePermLookup = useMemo(() => {
        const map = new Map<string, number>();
        for (const pp of pagePermissions) {
            map.set(`${pp.page_id}_${pp.permission_id}`, pp.page_permission_id);
        }
        return map;
    }, [pagePermissions]);

    const serverRolePermLookup = useMemo(() => {
        const map = new Map<string, boolean>();
        for (const rpp of rolePagePermissions) {
            map.set(`${rpp.role_id}_${rpp.page_permission_id}`, rpp.is_given);
        }
        return map;
    }, [rolePagePermissions]);

    const resolvedColumns = useMemo(() => {
        const matchedPermIds = new Set<number>();
        const cols: Array<{
            key: string;
            label: string;
            perm: (typeof permissions)[number] | undefined;
        }> = [];

        for (const standardCol of STANDARD_COLUMNS) {
            const perm = permissions.find((p) =>
                standardCol.matchNames.includes(p.name.toLowerCase())
            );
            if (perm) {
                matchedPermIds.add(perm.permission_id);
            }
            cols.push({
                key: standardCol.key,
                label: standardCol.label,
                perm,
            });
        }

        for (const perm of permissions) {
            if (!matchedPermIds.has(perm.permission_id)) {
                cols.push({
                    key: perm.name.toUpperCase(),
                    label: perm.name.toUpperCase(),
                    perm,
                });
            }
        }

        return cols;
    }, [permissions]);

    const getCellIsGiven = (roleId: number, pagePermId: number): boolean => {
        const key = `${roleId}_${pagePermId}`;
        if (key in localOverrides) {
            return localOverrides[key];
        }
        return serverRolePermLookup.get(key) === true;
    };

    const pendingChangesCount = useMemo(() => {
        if (!activeRole) return 0;
        let count = 0;
        const prefix = `${activeRole.role_id}_`;
        for (const [key, value] of Object.entries(localOverrides)) {
            if (key.startsWith(prefix)) {
                const serverVal = serverRolePermLookup.get(key) === true;
                if (serverVal !== value) {
                    count++;
                }
            }
        }
        return count;
    }, [activeRole, localOverrides, serverRolePermLookup]);

    const handleToggleCell = (pagePermId: number) => {
        if (!canEdit || !activeRole) return;

        const roleId = activeRole.role_id;
        const key = `${roleId}_${pagePermId}`;
        const currentVal = getCellIsGiven(roleId, pagePermId);
        const nextVal = !currentVal;

        setLocalOverrides((prev) => {
            const next = { ...prev };
            const serverVal = serverRolePermLookup.get(key) === true;
            if (nextVal === serverVal) {
                delete next[key];
            } else {
                next[key] = nextVal;
            }
            return next;
        });

        setActionError(null);
        setSuccessMessage(null);
    };

    const handleToggleAll = () => {
        if (!canEdit || !activeRole) return;

        const roleId = activeRole.role_id;
        const allPpIds: number[] = [];

        for (const page of pages) {
            for (const col of resolvedColumns) {
                if (!col.perm) continue;
                const ppId = pagePermLookup.get(`${page.page_id}_${col.perm.permission_id}`);
                if (ppId !== undefined) {
                    allPpIds.push(ppId);
                }
            }
        }

        if (allPpIds.length === 0) return;

        const allGiven = allPpIds.every((ppId) => getCellIsGiven(roleId, ppId));
        const targetVal = !allGiven;

        setLocalOverrides((prev) => {
            const next = { ...prev };
            for (const ppId of allPpIds) {
                const key = `${roleId}_${ppId}`;
                const serverVal = serverRolePermLookup.get(key) === true;
                if (targetVal === serverVal) {
                    delete next[key];
                } else {
                    next[key] = targetVal;
                }
            }
            return next;
        });

        setActionError(null);
        setSuccessMessage(null);
    };

    const handleReset = () => {
        if (!activeRole) return;
        const prefix = `${activeRole.role_id}_`;
        setLocalOverrides((prev) => {
            const next = { ...prev };
            for (const key of Object.keys(next)) {
                if (key.startsWith(prefix)) {
                    delete next[key];
                }
            }
            return next;
        });
        setActionError(null);
        setSuccessMessage(null);
    };

    const handleSavePermissions = () => {
        if (!canEdit || !activeRole) return;

        const roleId = activeRole.role_id;
        const permissionsToSave: Array<{
            page_permission_id: number;
            is_given: boolean;
        }> = [];

        for (const page of pages) {
            for (const col of resolvedColumns) {
                if (!col.perm) continue;
                const ppId = pagePermLookup.get(`${page.page_id}_${col.perm.permission_id}`);
                if (ppId !== undefined) {
                    const isGiven = getCellIsGiven(roleId, ppId);
                    permissionsToSave.push({
                        page_permission_id: ppId,
                        is_given: isGiven,
                    });
                }
            }
        }

        setActionError(null);
        setSuccessMessage(null);

        bulkSave(
            {
                role_id: roleId,
                permissions: permissionsToSave,
            },
            {
                onSuccess: () => {
                    const prefix = `${roleId}_`;
                    setLocalOverrides((prev) => {
                        const next = { ...prev };
                        for (const key of Object.keys(next)) {
                            if (key.startsWith(prefix)) {
                                delete next[key];
                            }
                        }
                        return next;
                    });
                    setSuccessMessage(`Permissions successfully saved for ${activeRole.name}!`);
                    refreshProfile();
                    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
                        const channel = new BroadcastChannel("rbac_permissions_channel");
                        channel.postMessage({ type: "PERMISSIONS_UPDATED" });
                        channel.close();
                    }
                    setTimeout(() => setSuccessMessage(null), 4000);
                },
                onError: (err) => {
                    if (axios.isAxiosError(err)) {
                        setActionError(
                            err.response?.data?.message || "Failed to save permissions."
                        );
                    } else {
                        setActionError(
                            (err as Error).message || "Failed to save permissions."
                        );
                    }
                },
            }
        );
    };

    if (!canView) {
        return <AccessDeniedCard module="Permissions" />;
    }

    const isLoading =
        isRolesLoading ||
        isPagesLoading ||
        isPermissionsLoading ||
        isPagePermsLoading ||
        isRolePagePermsLoading;

    if (isLoading) {
        return (
            <div className="flex h-56 items-center justify-center rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm">Loading permissions configuration...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
                <div className="flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0" />
                    <p className="text-sm font-medium">
                        {(error as Error)?.message || "Failed to load permissions."}
                    </p>
                </div>
            </div>
        );
    }

    if (roles.length === 0) {
        return (
            <div className="py-12 text-center rounded-2xl border bg-card p-6 shadow-sm">
                <Shield className="mx-auto size-10 text-muted-foreground" />
                <h4 className="mt-3 text-sm font-semibold text-foreground">No Roles Defined</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                    Please create system roles first before configuring permissions.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Select Role:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {roles.map((r) => {
                            const isSelected = r.role_id === activeRole?.role_id;
                            return (
                                <button
                                    key={r.role_id}
                                    type="button"
                                    onClick={() => setSelectedRoleId(r.role_id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                                        ? "bg-primary text-primary-foreground shadow-xs"
                                        : "bg-card hover:bg-muted text-muted-foreground border border-border"
                                        }`}
                                >
                                    <Shield className="size-3" />
                                    <span>{r.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {pendingChangesCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                        <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span>
                            {pendingChangesCount} unsaved change{pendingChangesCount > 1 ? "s" : ""}
                        </span>
                    </div>
                )}
            </div>

            {actionError && (
                <div className="flex items-center gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{actionError}</span>
                </div>
            )}

            {successMessage && (
                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-5 text-card-foreground">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                    <div className="flex items-center gap-3 pb-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Shield className="size-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold tracking-tight text-foreground">
                                    {activeRole?.name}
                                </h3>
                                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground border border-border">
                                    ID: #{activeRole?.role_id}
                                </span>
                                {!canEdit && (
                                    <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
                                        Read-Only
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                What this role can access
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b bg-muted/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="px-5 py-3 font-semibold">
                                    PAGE / MODULE
                                </th>
                                {resolvedColumns.map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-4 py-3 text-center font-semibold min-w-20 sm:min-w-24"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {pages.length > 0 ? (
                                pages.map((page) => (
                                    <tr
                                        key={page.page_id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <td className="px-5 py-3 font-medium text-foreground">
                                            {page.name}
                                        </td>

                                        {resolvedColumns.map((col) => {
                                            if (!col.perm) {
                                                return (
                                                    <td
                                                        key={col.key}
                                                        className="px-4 py-3 text-center text-muted-foreground/40 font-mono text-xs"
                                                    >
                                                        —
                                                    </td>
                                                );
                                            }

                                            const ppId = pagePermLookup.get(
                                                `${page.page_id}_${col.perm.permission_id}`
                                            );

                                            if (ppId === undefined) {
                                                return (
                                                    <td
                                                        key={col.key}
                                                        className="px-4 py-3 text-center text-muted-foreground/40 font-mono text-xs"
                                                        title="Not applicable"
                                                    >
                                                        —
                                                    </td>
                                                );
                                            }

                                            const roleId = activeRole?.role_id ?? 0;
                                            const isGiven = getCellIsGiven(roleId, ppId);

                                            return (
                                                <td
                                                    key={col.key}
                                                    className="px-4 py-3 text-center"
                                                >
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            role="checkbox"
                                                            aria-checked={isGiven}
                                                            disabled={!canEdit}
                                                            onClick={() => handleToggleCell(ppId)}
                                                            title={
                                                                !canEdit
                                                                    ? `${isGiven ? "Granted" : "Not granted"} (Read-only)`
                                                                    : `${isGiven ? "Revoke" : "Grant"} ${col.label} for ${page.name}`
                                                            }
                                                            className={`size-7 sm:size-8 rounded-lg flex items-center justify-center transition-all ${
                                                                !canEdit
                                                                    ? isGiven
                                                                        ? "bg-primary text-primary-foreground opacity-75 cursor-default"
                                                                        : "border border-input bg-background/50 text-transparent cursor-default"
                                                                    : isGiven
                                                                    ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer active:scale-95"
                                                                    : "border border-input bg-background hover:bg-muted/70 hover:border-primary/50 text-transparent cursor-pointer active:scale-95"
                                                            }`}
                                                        >
                                                            <Check className="size-4 stroke-[3]" />
                                                        </button>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={resolvedColumns.length + 1}
                                        className="py-12 text-center text-muted-foreground text-xs"
                                    >
                                        No system pages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                    {canEdit ? (
                        <button
                            type="button"
                            onClick={handleToggleAll}
                            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            <SlidersHorizontal className="size-3.5 text-primary" />
                            <span>Toggle page access</span>
                        </button>
                    ) : (
                        <span className="text-xs text-muted-foreground italic">
                            Viewing permissions in read-only mode
                        </span>
                    )}

                    {canEdit && (
                        <div className="flex items-center gap-2">
                            {pendingChangesCount > 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReset}
                                    disabled={isSaving}
                                    className="text-xs h-9 cursor-pointer gap-1.5"
                                >
                                    <RotateCcw className="size-3.5" />
                                    Reset
                                </Button>
                            )}

                            <Button
                                type="button"
                                onClick={handleSavePermissions}
                                disabled={isSaving || pendingChangesCount === 0}
                                className="h-9 px-5 rounded-lg text-xs font-semibold cursor-pointer shadow-xs gap-1.5"
                            >
                                {isSaving ? (
                                    <>
                                        <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Permissions</span>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}