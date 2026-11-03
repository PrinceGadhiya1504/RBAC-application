import { useState } from "react";
import { useCreateUser } from "../hooks/useCreateUser";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { usePositions } from "@/features/positions/hooks/usePositions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/ui/DatePicker";
import { useToast } from "@/hooks/useToast";

interface CreateUserFormProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

export default function CreateUserForm({
    onCancel,
    onSuccess,
}: CreateUserFormProps) {
    const toast = useToast();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [dateOfJoining, setDateOfJoining] = useState(
        () => new Date().toISOString().split("T")[0]
    );
    const [endDate, setEndDate] = useState("");
    const [roleId, setRoleId] = useState<string>("");
    const [positionId, setPositionId] = useState<string>("");

    const { mutate: createUser, isPending } = useCreateUser();
    const { data: rolesData } = useRoles();
    const { data: positionsData } = usePositions();

    const roles = rolesData?.roles || [];
    const positions = positionsData?.positions || [];

    const isDateInvalid = Boolean(endDate && dateOfJoining && endDate <= dateOfJoining);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isDateInvalid) {
            toast.error("End date must be greater than start date.");
            return;
        }

        createUser(
            {
                full_name: fullName.trim(),
                email: email.trim().toLowerCase(),
                password,
                contact_number: contactNumber.trim() || undefined,
                date_of_joining: dateOfJoining || undefined,
                end_date: endDate || undefined,
                role_id: roleId ? Number(roleId) : undefined,
                position_id: positionId ? Number(positionId) : undefined,
            },
            {
                onSuccess: () => {
                    toast.success("User created successfully.");
                    setFullName("");
                    setEmail("");
                    setPassword("");
                    setContactNumber("");
                    setDateOfJoining(new Date().toISOString().split("T")[0]);
                    setEndDate("");
                    setRoleId("");
                    setPositionId("");
                    onSuccess?.();
                },
                onError: (err) => {
                    toast.error(err, "Failed to create user.");
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter full name"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="newUserEmail">Email Address</Label>
                <Input
                    id="newUserEmail"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="user@example.com"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="newUserPassword">Password</Label>
                <Input
                    id="newUserPassword"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                    id="contactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(event) => setContactNumber(event.target.value)}
                    placeholder="e.g. +1 555-0199"
                    maxLength={20}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dateOfJoining">Date of Joining</Label>
                    <DatePicker
                        id="dateOfJoining"
                        value={dateOfJoining}
                        onChange={(val) => setDateOfJoining(val)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">
                        End Date <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                    </Label>
                    <DatePicker
                        id="endDate"
                        value={endDate}
                        min={dateOfJoining || undefined}
                        onChange={(val) => setEndDate(val)}
                        className={isDateInvalid ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {isDateInvalid && (
                        <p className="text-xs text-destructive">
                            End date must be greater than start date.
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="userRole">Assigned Role</Label>
                    <select
                        id="userRole"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                    >
                        <option value="">No role assigned</option>
                        {roles.map((r) => (
                            <option key={r.role_id} value={r.role_id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="userPosition">Job Position</Label>
                    <select
                        id="userPosition"
                        value={positionId}
                        onChange={(e) => setPositionId(e.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                    >
                        <option value="">No position assigned</option>
                        {positions.map((p) => (
                            <option key={p.position_id} value={p.position_id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                        Cancel
                    </Button>
                )}

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create User"}
                </Button>
            </div>
        </form>
    );
}
