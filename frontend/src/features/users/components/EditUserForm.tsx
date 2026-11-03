import { useState } from "react";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { usePositions } from "@/features/positions/hooks/usePositions";
import { useModulePermissions } from "@/features/auth/hooks/useModulePermissions";
import type { User, UpdateUserRequest } from "../types/user.types";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/ui/DatePicker";
import { useToast } from "@/hooks/useToast";

interface EditUserFormProps {
    user: User;
    onCancel: () => void;
    onSuccess: () => void;
    canEditRestrictedFields?: boolean;
}

export default function EditUserForm({
    user,
    onCancel,
    onSuccess,
    canEditRestrictedFields,
}: EditUserFormProps) {
    const toast = useToast();
    const { user: currentUser, refreshProfile } = useAuth();
    const { canUpdate: canUpdateUsers } = useModulePermissions("Users");
    const canEditAllFields = canEditRestrictedFields ?? Boolean(canUpdateUsers);

    const [fullName, setFullName] = useState(user.full_name);
    const [email, setEmail] = useState(user.email);
    const [contactNumber, setContactNumber] = useState(user.contact_number ?? "");
    const [dateOfJoining, setDateOfJoining] = useState(user.date_of_joining?.split("T")[0] ?? "");
    const [endDate, setEndDate] = useState(user.end_date?.split("T")[0] ?? "");
    const [roleId, setRoleId] = useState(user.role_id ? String(user.role_id) : "");
    const [positionId, setPositionId] = useState(user.position_id ? String(user.position_id) : "");

    const { mutate: updateUser, isPending } = useUpdateUser();
    const { data: rolesData } = useRoles();
    const { data: positionsData } = usePositions();

    const roles = rolesData?.roles || [];
    const positions = positionsData?.positions || [];

    const isDateInvalid = Boolean(endDate && dateOfJoining && endDate <= dateOfJoining);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (canEditAllFields && isDateInvalid) {
            toast.error("End date must be greater than start date.");
            return;
        }

        const userData: UpdateUserRequest = {
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            contact_number: contactNumber.trim() || null,
            ...(canEditAllFields && {
                date_of_joining: dateOfJoining || undefined,
                end_date: endDate || null,
                role_id: roleId ? Number(roleId) : null,
                position_id: positionId ? Number(positionId) : null,
            }),
        };

        updateUser(
            { userId: user.user_id, userData },
            {
                onSuccess: async () => {
                    toast.success("User updated successfully.");
                    if (currentUser && currentUser.user_id === user.user_id) {
                        await refreshProfile();
                    }
                    onSuccess();
                },
                onError: (err) => {
                    toast.error(err, "Failed to update user.");
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="editFullName">Full Name</Label>
                <Input
                    id="editFullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                    id="editEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="editContactNumber">Contact Number</Label>
                <Input
                    id="editContactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. +1 555-0199"
                    maxLength={20}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="editDateOfJoining">Date of Joining</Label>
                    <DatePicker
                        id="editDateOfJoining"
                        value={dateOfJoining}
                        disabled={!canEditAllFields}
                        onChange={(val) => setDateOfJoining(val)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="editEndDate">
                        End Date <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                    </Label>
                    <DatePicker
                        id="editEndDate"
                        value={endDate}
                        min={dateOfJoining || undefined}
                        disabled={!canEditAllFields}
                        onChange={(val) => setEndDate(val)}
                        className={canEditAllFields && isDateInvalid ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {canEditAllFields && isDateInvalid && (
                        <p className="text-xs text-destructive">
                            End date must be greater than start date.
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="editUserRole">Assigned Role</Label>
                    <select
                        id="editUserRole"
                        value={roleId}
                        disabled={!canEditAllFields}
                        onChange={(e) => setRoleId(e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                    >
                        <option value="">No role assigned</option>
                        {roleId && !roles.some((r) => String(r.role_id) === roleId) && (
                            <option value={roleId}>{user.role_name || `Role #${roleId}`}</option>
                        )}
                        {roles.map((r) => (
                            <option key={r.role_id} value={r.role_id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="editUserPosition">Job Position</Label>
                    <select
                        id="editUserPosition"
                        value={positionId}
                        disabled={!canEditAllFields}
                        onChange={(e) => setPositionId(e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                    >
                        <option value="">No position assigned</option>
                        {positionId && !positions.some((p) => String(p.position_id) === positionId) && (
                            <option value={positionId}>{user.position_name || `Position #${positionId}`}</option>
                        )}
                        {positions.map((p) => (
                            <option key={p.position_id} value={p.position_id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
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
