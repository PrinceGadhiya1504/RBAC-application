import { useState } from "react";
import { useUpdateRole } from "../hooks/useUpdateRole";
import type { Role } from "../types/role.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface EditRoleFormProps {
    role: Role;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function EditRoleForm({
    role,
    onCancel,
    onSuccess,
}: EditRoleFormProps) {
    const [name, setName] = useState(role.name);
    const [description, setDescription] = useState(role.description ?? "");

    const { mutate: updateRole, isPending, isError, error } = useUpdateRole();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        updateRole(
            {
                roleId: role.role_id,
                roleData: {
                    name: name.trim(),
                    description: description.trim() || undefined,
                },
            },
            {
                onSuccess: () => {
                    onSuccess();
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="editRoleName">Role Name</Label>
                <Input
                    id="editRoleName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="editRoleDescription">Description</Label>
                <Input
                    id="editRoleDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this role"
                />
            </div>

            {isError && (
                <p className="text-sm text-destructive" role="alert">
                    {axios.isAxiosError(error)
                        ? error.response?.data?.message || "Failed to update role."
                        : error.message || "Failed to update role."}
                </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                    Cancel
                </Button>

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
