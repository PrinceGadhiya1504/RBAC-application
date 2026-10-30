import { useState } from "react";
import { usePositions } from "../hooks/usePositions";
import { useDeletePosition } from "../hooks/useDeletePosition";
import type { Position } from "../types/position.types";
import CreatePositionDialog from "./CreatePositionDialog";
import EditPositionDialog from "./EditPositionDialog";
import { useModulePermissions } from "@/features/auth/hooks/useModulePermissions";
import AccessDeniedCard from "@/features/auth/components/AccessDeniedCard";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
    Briefcase,
    AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function PositionsTable() {
    const toast = useToast();
    const { canView, canCreate, canUpdate: canEdit, canDelete } = useModulePermissions("Positions");

    const { data, isPending, isError, error } = usePositions();
    const { mutate: deletePos, isPending: isDeleting } = useDeletePosition();

    const [editingPosition, setEditingPosition] = useState<Position | null>(null);
    const [deletingPosition, setDeletingPosition] = useState<Position | null>(null);

    if (!canView) {
        return <AccessDeniedCard module="Positions" />;
    }

    const positions = data?.positions || [];

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
                        {(error as any)?.response?.data?.message || error?.message || "Failed to load positions."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Briefcase className="size-5 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight text-foreground">
                            Positions List
                        </h2>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {positions.length} total
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Manage organizational positions and job titles.
                    </p>
                </div>

                {canCreate && <CreatePositionDialog />}
            </div>

            <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-semibold w-16">ID</th>
                            <th className="px-4 py-3 font-semibold min-w-48">Position Title</th>
                            <th className="px-4 py-3 font-semibold">Description</th>
                            {(canEdit || canDelete) && (
                                <th className="px-4 py-3 font-semibold">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {positions.map((pos, index) => (
                            <tr
                                key={pos.position_id}
                                className="transition-colors hover:bg-muted/30"
                            >
                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                    {index + 1}
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
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {canEdit && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingPosition(pos)}
                                                    className="h-8 cursor-pointer"
                                                >
                                                    Edit
                                                </Button>
                                            )}

                                            {canDelete && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    disabled={isDeleting}
                                                    onClick={() => setDeletingPosition(pos)}
                                                    className="h-8 cursor-pointer"
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}

                        {positions.length === 0 && (
                            <tr>
                                <td
                                    colSpan={canEdit || canDelete ? 4 : 3}
                                    className="py-12 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                                        <Briefcase className="size-8 opacity-40" />
                                        <p className="text-sm font-medium text-foreground">No positions found</p>
                                        <p className="text-xs">There are no positions to display.</p>
                                    </div>
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

            <ConfirmDialog
                open={Boolean(deletingPosition)}
                onOpenChange={(open) => !open && setDeletingPosition(null)}
                title="Delete Position"
                description="Are you sure you want to delete this position? This action cannot be undone."
                isLoading={isDeleting}
                onConfirm={() => {
                    if (!deletingPosition) return;
                    deletePos(deletingPosition.position_id, {
                        onSuccess: () => {
                            toast.success("Position deleted successfully.");
                            setDeletingPosition(null);
                        },
                        onError: (err) => {
                            toast.error(err, "Failed to delete position.");
                            setDeletingPosition(null);
                        },
                    });
                }}
            />
        </div>
    );
}
