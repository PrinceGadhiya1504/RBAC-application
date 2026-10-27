import { useState } from "react";
import { useUpdateUser } from "../hooks/useUpdateUser";
import type { User } from "../types/user.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface EditUserFormProps {
    user: User;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function EditUserForm({
    user,
    onCancel,
    onSuccess,
}: EditUserFormProps) {
    const [fullName, setFullName] = useState(user.full_name);
    const [email, setEmail] = useState(user.email);
    const [contactNumber, setContactNumber] = useState(user.contact_number ?? "");
    const [dateOfJoining, setDateOfJoining] = useState(
        user.date_of_joining ? user.date_of_joining.split("T")[0] : ""
    );

    const { mutate: updateUser, isPending, isError, error } = useUpdateUser();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        updateUser(
            {
                userId: user.user_id,
                userData: {
                    full_name: fullName,
                    email,
                    contact_number: contactNumber.trim() || undefined,
                    date_of_joining: dateOfJoining || undefined,
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
                <Label htmlFor="editFullName">Full Name</Label>
                <Input
                    id="editFullName"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                    id="editEmail"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="editContactNumber">Contact Number</Label>
                    <Input
                        id="editContactNumber"
                        type="tel"
                        value={contactNumber}
                        onChange={(event) => setContactNumber(event.target.value)}
                        placeholder="e.g. +1 555-0199"
                        maxLength={20}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="editDateOfJoining">Date of Joining</Label>
                    <Input
                        id="editDateOfJoining"
                        type="date"
                        value={dateOfJoining}
                        onChange={(event) => setDateOfJoining(event.target.value)}
                    />
                </div>
            </div>

            {isError && (
                <p className="text-sm text-destructive" role="alert">
                    {axios.isAxiosError(error)
                        ? error.response?.data?.message || "Failed to update user."
                        : error.message || "Failed to update user."}
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
