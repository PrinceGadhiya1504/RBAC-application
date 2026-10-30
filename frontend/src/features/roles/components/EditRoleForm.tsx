import { useState } from "react";
import { useUpdateRole } from "../hooks/useUpdateRole";
import type { Role } from "../types/role.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";

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
    const toast = useToast();
    const [name, setName] = useState(role.name);
    const [description, setDescription] = useState(role.description ?? "");

    const { mutate: updateRole, isPending } = useUpdateRole();

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
                    toast.success("Role updated successfully.");
                    onSuccess();
                },
                onError: (err) => {
                    toast.error(err, "Failed to update role.");
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
