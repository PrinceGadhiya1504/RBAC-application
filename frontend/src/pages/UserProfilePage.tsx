import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/features/users/hooks/useUser";
import { useModulePermissions } from "@/features/auth/hooks/useModulePermissions";
import AccessDeniedCard from "@/features/auth/components/AccessDeniedCard";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import EditUserForm from "@/features/users/components/EditUserForm";
import type { User } from "@/features/users/types/user.types";
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Shield,
    Briefcase,
    User as UserIcon,
    Pencil,
    Hash,
    Clock,
    AlertCircle,
} from "lucide-react";

export default function UserProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { canView, canUpdate } = useModulePermissions("Users");

    const fallbackUser: User | undefined = location.state?.user;
    const stateUserId = location.state?.userId || location.state?.user?.user_id;
    const storedUserId = typeof window !== "undefined" ? sessionStorage.getItem("viewing_user_id") : null;
    const numericUserId = stateUserId ? Number(stateUserId) : (storedUserId ? Number(storedUserId) : undefined);

    const { data, isPending, isError, error } = useUser(numericUserId);
    const [isEditOpen, setIsEditOpen] = useState(false);

    if (!canView) {
        return <AccessDeniedCard module="Users" />;
    }

    const user: User | undefined = data?.user || fallbackUser;

    if (isPending && !user) {
        return (
            <div className="flex h-72 items-center justify-center rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm font-medium">Loading user profile...</p>
                </div>
            </div>
        );
    }

    if (isError && !user) {
        return (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-destructive space-y-3">
                <div className="flex items-center gap-2">
                    <AlertCircle className="size-5 shrink-0" />
                    <p className="text-sm font-semibold">
                        {(error as any)?.response?.data?.message || error?.message || "Failed to load user profile."}
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        sessionStorage.removeItem("viewing_user_id");
                        navigate("/users");
                    }}
                    className="cursor-pointer"
                >
                    <ArrowLeft className="size-3.5 mr-1" />
                    Back to Users
                </Button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="py-16 text-center rounded-2xl border bg-card p-6 shadow-sm">
                <UserIcon className="mx-auto size-12 text-muted-foreground/50" />
                <h3 className="mt-3 text-base font-semibold text-foreground">User Not Found</h3>
                <p className="mt-1 text-xs text-muted-foreground">The requested user profile does not exist.</p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        sessionStorage.removeItem("viewing_user_id");
                        navigate("/users");
                    }}
                    className="mt-4 cursor-pointer"
                >
                    <ArrowLeft className="size-3.5 mr-1" />
                    Back to Users
                </Button>
            </div>
        );
    }

    const initials = user.full_name
        ? user.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";

    const formattedJoinDate = user.date_of_joining
        ? new Date(user.date_of_joining).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Not recorded";

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        sessionStorage.removeItem("viewing_user_id");
                        navigate("/users");
                    }}
                    className="w-fit text-muted-foreground hover:text-foreground cursor-pointer -ml-2"
                >
                    <ArrowLeft className="size-4 mr-1.5" />
                    Back to Users
                </Button>

                {canUpdate && (
                    <Button
                        type="button"
                        onClick={() => setIsEditOpen(true)}
                        className="cursor-pointer shadow-sm gap-1.5"
                    >
                        <Pencil className="size-3.5" />
                        Edit Profile
                    </Button>
                )}
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl font-bold tracking-tight border border-primary/20 shadow-inner">
                        {initials}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground truncate">
                                {user.full_name}
                            </h2>
                            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md border">
                                <Hash className="size-3" />
                                {user.user_id}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            {user.role_name ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    <Shield className="size-3.5" />
                                    {user.role_name}
                                </span>
                            ) : (
                                <span className="text-xs text-muted-foreground italic">No assigned role</span>
                            )}

                            {user.position_name && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    <Briefcase className="size-3.5" />
                                    {user.position_name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3">
                        <UserIcon className="size-4 text-primary" />
                        <h3 className="text-sm font-semibold tracking-tight text-foreground">
                            Personal & Contact Details
                        </h3>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <dt className="text-xs text-muted-foreground font-medium">Full Name</dt>
                            <dd className="font-semibold text-foreground">{user.full_name}</dd>
                        </div>

                        <div className="space-y-1">
                            <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                <Mail className="size-3 text-muted-foreground" />
                                Email Address
                            </dt>
                            <dd className="font-medium text-foreground truncate">
                                <a
                                    href={`mailto:${user.email}`}
                                    className="text-primary hover:underline hover:text-primary/90"
                                >
                                    {user.email}
                                </a>
                            </dd>
                        </div>

                        <div className="space-y-1">
                            <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                <Phone className="size-3 text-muted-foreground" />
                                Contact Number
                            </dt>
                            <dd className="font-medium text-foreground">
                                {user.contact_number || (
                                    <span className="text-muted-foreground italic">Not provided</span>
                                )}
                            </dd>
                        </div>

                        <div className="space-y-1">
                            <dt className="text-xs text-muted-foreground font-medium">Account Status</dt>
                            <dd className="font-medium">
                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                    Active
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3">
                        <Briefcase className="size-4 text-primary" />
                        <h3 className="text-sm font-semibold tracking-tight text-foreground">
                            Organization & Role Assignment
                        </h3>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                <Shield className="size-3 text-muted-foreground" />
                                Security Role
                            </dt>
                            <dd className="font-semibold text-foreground">
                                {user.role_name || (
                                    <span className="text-muted-foreground italic">No role assigned</span>
                                )}
                            </dd>
                        </div>

                        <div className="space-y-1">
                            <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                <Briefcase className="size-3 text-muted-foreground" />
                                Organizational Position
                            </dt>
                            <dd className="font-semibold text-foreground">
                                {user.position_name || (
                                    <span className="text-muted-foreground italic">No position assigned</span>
                                )}
                            </dd>
                        </div>

                        <div className="space-y-1">
                            <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                <Calendar className="size-3 text-muted-foreground" />
                                Date of Joining
                            </dt>
                            <dd className="font-medium text-foreground">
                                {formattedJoinDate}
                            </dd>
                        </div>

                        <div className="space-y-1">
                            <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                <Clock className="size-3 text-muted-foreground" />
                                System Record ID
                            </dt>
                            <dd className="font-mono text-xs text-muted-foreground">
                                {user.user_id}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Edit User Profile</DialogTitle>
                    </DialogHeader>
                    <EditUserForm
                        user={user}
                        onCancel={() => setIsEditOpen(false)}
                        onSuccess={() => setIsEditOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
