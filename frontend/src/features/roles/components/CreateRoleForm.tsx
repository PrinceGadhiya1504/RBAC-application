import { useState } from "react";
import { useCreateRole } from "../hooks/useCreateRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface CreateRoleFormProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

export default function CreateRoleForm({
    onCancel,
    onSuccess,
}: CreateRoleFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const { mutate: createRole, isPending, isError, error } = useCreateRole();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        createRole(
            {
                name: name.trim(),
                description: description.trim() || undefined,
            },
            {
                onSuccess: () => {
                    setName("");
                    setDescription("");
                    onSuccess?.();
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                    id="roleName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Manager, HR, Support"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="roleDescription">Description (Optional)</Label>
                <Input
                    id="roleDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief summary of duties and permissions"
                />
            </div>

            {isError && (
                <p className="text-sm text-destructive" role="alert">
                    {axios.isAxiosError(error)
                        ? error.response?.data?.message || "Failed to create role."
                        : error.message || "Failed to create role."}
                </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                        Cancel
                    </Button>
                )}

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create Role"}
                </Button>
            </div>
        </form>
    );
}