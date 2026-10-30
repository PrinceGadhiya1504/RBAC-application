import { useState } from "react";
import { useCreatePosition } from "../hooks/useCreatePosition";
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
import { useToast } from "@/hooks/useToast";

export default function CreatePositionDialog() {
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const { mutate: createPos, isPending } = useCreatePosition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.warning("Position name is required.");
            return;
        }

        createPos(
            {
                name: name.trim(),
                description: description.trim() || undefined,
            },
            {
                onSuccess: () => {
                    toast.success("Position created successfully.");
                    setName("");
                    setDescription("");
                    setOpen(false);
                },
                onError: (err) => {
                    toast.error(err, "Failed to create position.");
                },
            }
        );
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} className="shadow-sm cursor-pointer">
                Create Position
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Create New Position</DialogTitle>
                        <DialogDescription>
                            Define a new job position or role title in the organization.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="positionName">Position Name</Label>
                            <Input
                                id="positionName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Senior Software Engineer"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="positionDesc">Description</Label>
                            <Input
                                id="positionDesc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Responsibilities and scope"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create Position"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}
