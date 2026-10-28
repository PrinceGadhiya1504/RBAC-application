import { useState, useMemo } from "react";
import { usePositions } from "../hooks/usePositions";
import { useDeletePosition } from "../hooks/useDeletePosition";
import type { Position } from "../types/position.types";
import CreatePositionDialog from "./CreatePositionDialog";
import EditPositionDialog from "./EditPositionDialog";
import { useModulePermissions } from "@/features/auth/hooks/useModulePermissions";
import AccessDeniedCard from "@/features/auth/components/AccessDeniedCard";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    Search,
    Edit2,
    Trash2,
    AlertCircle,
    Building,
} from "lucide-react";
import axios from "axios";

export default function PositionsTable() {
    const { canView, canCreate, canUpdate: canEdit, canDelete } = useModulePermissions("Positions");

    const { data, isPending, isError, error } = usePositions();
    const { mutate: deletePos } = useDeletePosition();

    const [searchQuery, setSearchQuery] = useState("");
    const [editingPosition, setEditingPosition] = useState<Position | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    if (!canView) {
        return <AccessDeniedCard module="Positions" />;
    }

    const positions = useMemo(() => data?.positions || [], [data]);

    const filteredPositions = useMemo(() => {
        if (!searchQuery.trim()) return positions;
        const q = searchQuery.toLowerCase();
        return positions.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q))
        );
    }, [positions, searchQuery]);

    const handleDelete = (pos: Position) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete the position "${pos.name}"?`
        );
        if (!confirmed) return;

        setActionError(null);
        deletePos(pos.position_id, {
            onError: (err) => {
                if (axios.isAxiosError(err)) {
                    setActionError(err.response?.data?.message || "Failed to delete position.");
                } else {
                    setActionError((err as Error).message || "Failed to delete position.");
                }
            },
        });
    };

    if (isPending) {
        return (
            <div className="flex h-56 items-center justify-center rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm">Loading positions...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
                <div className="flex items-center gap-2">
                    <AlertCircle className="size-4" />
                    <p className="text-sm font-medium">
                        {(error as Error)?.message || "Failed to load positions."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search positions..."
                        className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>

                {canCreate && <CreatePositionDialog />}
            </div>

            {actionError && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{actionError}</span>
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-semibold w-16">ID</th>
                            <th className="px-4 py-3 font-semibold min-w-48">Position Title</th>
                            <th className="px-4 py-3 font-semibold">Description</th>
                            {(canEdit || canDelete) && (
                                <th className="px-4 py-3 text-right font-semibold min-w-28">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {filteredPositions.length > 0 ? (
                            filteredPositions.map((pos, index) => (
                                <tr
                                    key={pos.position_id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                        #{index + 1}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                <Briefcase className="size-4" />
                                            </div>
                                            <span className="font-semibold text-foreground">
                                                {pos.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-md truncate">
                                        {pos.description || (
                                            <span className="italic text-muted-foreground/50">
                                                No description provided
                                            </span>
                                        )}
                                    </td>

                                    {(canEdit || canDelete) && (
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {canEdit && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setEditingPosition(pos)}
                                                        className="size-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                                        title="Edit position"
                                                    >
                                                        <Edit2 className="size-3.5" />
                                                    </Button>
                                                )}

                                                {canDelete && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(pos)}
                                                        className="size-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                                                        title="Delete position"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={canEdit || canDelete ? 4 : 3}
                                    className="py-12 text-center"
                                >
                                    <Building className="mx-auto size-10 text-muted-foreground" />
                                    <h4 className="mt-3 text-sm font-semibold text-foreground">
                                        No positions found
                                    </h4>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {searchQuery
                                            ? "Try adjusting your search query."
                                            : "Create your first job position to get started."}
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <EditPositionDialog
                position={editingPosition}
                open={Boolean(editingPosition)}
                onOpenChange={(isOpen) => !isOpen && setEditingPosition(null)}
            />
        </div>
    );
}
