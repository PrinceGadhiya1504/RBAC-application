import { useState, useEffect } from "react";
import { useUpdatePosition } from "../hooks/useUpdatePosition";
import type { Position } from "../types/position.types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface EditPositionDialogProps {
    position: Position | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditPositionDialog({
    position,
    open,
    onOpenChange,
}: EditPositionDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { mutate: updatePos, isPending } = useUpdatePosition();

    useEffect(() => {
        if (position) {
            setName(position.name);
            setDescription(position.description || "");
            setErrorMsg(null);
        }
    }, [position]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!position) return;
        setErrorMsg(null);

        if (!name.trim()) {
            setErrorMsg("Position name is required.");
            return;
        }

        updatePos(
            {
                positionId: position.position_id,
                data: {
                    name: name.trim(),
                    description: description.trim() || undefined,
                },
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (err) => {
                    if (axios.isAxiosError(err)) {
                        setErrorMsg(err.response?.data?.message || "Failed to update position.");
                    } else {
                        setErrorMsg((err as Error).message || "Failed to update position.");
                    }
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Edit Position</DialogTitle>
                        <DialogDescription>
                            Update the position title and description.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="editPositionName">Position Name</Label>
                            <Input
                                id="editPositionName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="editPositionDesc">Description</Label>
                            <Input
                                id="editPositionDesc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {errorMsg && (
                            <p className="text-xs text-destructive font-medium">{errorMsg}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
