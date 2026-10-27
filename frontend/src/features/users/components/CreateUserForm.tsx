import { useState } from "react";
import { useCreateUser } from "../hooks/useCreateUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface CreateUserFormProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

export default function CreateUserForm({
    onCancel,
    onSuccess,
}: CreateUserFormProps) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [dateOfJoining, setDateOfJoining] = useState(
        () => new Date().toISOString().split("T")[0]
    );

    const { mutate: createUser, isPending, isError, error } = useCreateUser();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        createUser(
            {
                full_name: fullName,
                email,
                password,
                contact_number: contactNumber.trim() || undefined,
                date_of_joining: dateOfJoining || undefined,
            },
            {
                onSuccess: () => {
                    setFullName("");
                    setEmail("");
                    setPassword("");
                    setContactNumber("");
                    setDateOfJoining(new Date().toISOString().split("T")[0]);
                    onSuccess?.();
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="space-y-2">
                    <Label htmlFor="dateOfJoining">Date of Joining</Label>
                    <Input
                        id="dateOfJoining"
                        type="date"
                        value={dateOfJoining}
                        onChange={(event) => setDateOfJoining(event.target.value)}
                        required
                    />
                </div>
            </div>

            {isError && (
                <p className="text-sm text-destructive" role="alert">
                    {axios.isAxiosError(error)
                        ? error.response?.data?.message || "Failed to create user."
                        : error.message || "Failed to create user."}
                </p>
            )}

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
