import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useUser } from "@/features/users/hooks/useUser";
import { useModulePermissions } from "@/features/auth/hooks/useModulePermissions";
import { useAuth } from "@/features/auth/context/AuthContext";
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
import { formatDate } from "@/lib/dateUtils";
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Shield,
    Briefcase,
    User as UserIcon,
    Pencil,
    Clock,
    AlertCircle,
    History,
    CheckCircle2,
} from "lucide-react";

export default function UserProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { user: currentUser } = useAuth();
    const { canView: canViewUsers, canUpdate: canUpdateUsers } = useModulePermissions("Users");

    const queryUserId = searchParams.get("id");
    const stateUserId = location.state?.userId || location.state?.user?.user_id;
    const storedUserId = typeof window !== "undefined" ? sessionStorage.getItem("viewing_user_id") : null;
    const numericUserId = queryUserId ? Number(queryUserId) : (stateUserId ? Number(stateUserId) : (storedUserId ? Number(storedUserId) : currentUser?.user_id));

    const isOwnProfile = Boolean(currentUser && numericUserId === currentUser.user_id);
    const canView = canViewUsers || isOwnProfile;
    const canUpdate = canUpdateUsers || isOwnProfile;

    const fallbackUser: User | undefined = location.state?.user || (isOwnProfile && currentUser ? {
        user_id: currentUser.user_id,
        full_name: currentUser.full_name,
        email: currentUser.email,
        contact_number: currentUser.contact_number,
        date_of_joining: currentUser.date_of_joining,
        end_date: currentUser.end_date,
        role_id: null,
        role_name: currentUser.role || currentUser.roles?.[0] || null,
        position_id: currentUser.position_id,
        position_name: currentUser.position_name,
        position_history: currentUser.position_history,
    } : undefined);

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

    const formattedJoinDate = formatDate(user.date_of_joining, "Not recorded");
    const formattedEndDate = formatDate(user.end_date, "Active / Ongoing");

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
                                <Calendar className="size-3 text-muted-foreground" />
                                End Date
                            </dt>
                            <dd className="font-medium text-foreground">
                                {formattedEndDate}
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

            <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                        <History className="size-4 text-primary" />
                        <h3 className="text-sm font-semibold tracking-tight text-foreground">
                            Position History
                        </h3>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {user.position_history?.length || 0} {(user.position_history?.length || 0) === 1 ? "record" : "records"}
                    </span>
                </div>

                {user.position_history && user.position_history.length > 0 ? (
                    <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                        {user.position_history.map((item, idx) => (
                            <div key={item.user_position_id || idx} className="relative group">
                                <div
                                    className={`absolute -left-[1.85rem] top-1.5 size-3.5 rounded-full border-2 bg-background ${item.is_current
                                            ? "border-emerald-500 bg-emerald-500 ring-2 ring-emerald-500/20"
                                            : "border-muted-foreground/40"
                                        }`}
                                />
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-xl border bg-card/50 p-3 hover:bg-accent/40 transition-colors">
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-semibold text-foreground text-sm">
                                                {item.position_name || "Unassigned Position"}
                                            </span>
                                            {item.is_current ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                    <CheckCircle2 className="size-3" />
                                                    Current Position
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                                    Past Position
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Position ID: {item.position_id} &bull; Assignment ID: #{item.user_position_id}
                                        </p>
                                    </div>
                                    <div className="text-xs text-muted-foreground sm:text-right">
                                        <span className="font-medium text-foreground">
                                            {formatDate(item.start_date, "Not recorded")} &ndash; {item.end_date ? formatDate(item.end_date) : "Present"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-6 text-center text-xs text-muted-foreground">
                        No position history recorded for this user.
                    </div>
                )}
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
