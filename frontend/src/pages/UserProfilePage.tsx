import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { formatDate, parseISODate, SHORT_MONTHS } from "@/lib/dateUtils";
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    User as UserIcon,
    Pencil,
    AlertCircle,
} from "lucide-react";

function formatMonthYear(dateStr?: string | null): string {
    const parts = parseISODate(dateStr);
    return parts ? `${SHORT_MONTHS[parts.month - 1]} ${parts.year}` : "Not recorded";
}

function ProfileInfoItem({
    icon: Icon,
    label,
    value,
    title,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: React.ReactNode;
    title?: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0">
                <Icon className="size-4" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <p className="text-sm font-semibold text-foreground truncate" title={title}>
                    {value}
                </p>
            </div>
        </div>
    );
}

function WorkDetailRow({
    label,
    children,
    isFirst = false,
}: {
    label: string;
    children: React.ReactNode;
    isFirst?: boolean;
}) {
    return (
        <div className={`flex items-center justify-between ${isFirst ? "pt-1" : "pt-4"}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {label}
            </span>
            {children}
        </div>
    );
}

export default function UserProfilePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user: currentUser } = useAuth();
    const { canView: canViewUsers, canUpdate: canUpdateUsers } = useModulePermissions("Users");

    const [isEditOpen, setIsEditOpen] = useState(false);

    const queryUserId = searchParams.get("id");
    const numericUserId = queryUserId ? Number(queryUserId) : currentUser?.user_id;

    const isOwnProfile = Boolean(currentUser && numericUserId === currentUser.user_id);
    const canView = canViewUsers || isOwnProfile;
    const canUpdate = canUpdateUsers || isOwnProfile;

    const fallbackUser: User | undefined =
        isOwnProfile && currentUser
            ? {
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
            }
            : undefined;

    const { data, isPending, isError, error } = useUser(numericUserId);

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
                {canViewUsers && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/users")}
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="size-3.5 mr-1" />
                        Back to Users
                    </Button>
                )}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="py-16 text-center rounded-2xl border bg-card p-6 shadow-sm">
                <UserIcon className="mx-auto size-12 text-muted-foreground/50" />
                <h3 className="mt-3 text-base font-semibold text-foreground">User Not Found</h3>
                <p className="mt-1 text-xs text-muted-foreground">The requested user profile does not exist.</p>
                {canViewUsers && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/users")}
                        className="mt-4 cursor-pointer"
                    >
                        <ArrowLeft className="size-3.5 mr-1" />
                        Back to Users
                    </Button>
                )}
            </div>
        );
    }

    const initials = user.full_name
        ? user.full_name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";

    const formattedJoinDate = formatDate(user.date_of_joining, "Not recorded");

    const currentPosition =
        user.position_history?.find((p) => p.is_current) ||
        user.position_history?.[0];

    const inThisPositionSince = formatDate(
        currentPosition?.start_date || user.date_of_joining,
        "-"
    );

    const timelineItems =
        user.position_history && user.position_history.length > 0
            ? [...user.position_history].sort((a, b) => {
                if (a.is_current !== b.is_current) return a.is_current ? -1 : 1;
                const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
                const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
                return dateB - dateA;
            })
            : user.position_name
                ? [
                    {
                        user_position_id: 0,
                        position_id: user.position_id || 0,
                        position_name: user.position_name,
                        start_date: user.date_of_joining,
                        end_date: user.end_date,
                        is_current: !user.end_date,
                    },
                ]
                : [];

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {canViewUsers && (
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/users")}
                        className="w-fit text-muted-foreground hover:text-foreground cursor-pointer -ml-2"
                    >
                        <ArrowLeft className="size-4 mr-1.5" />
                        Back to Users
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 rounded-2xl border bg-card shadow-sm overflow-hidden">
                    <div className="h-24 w-full bg-gradient-to-b from-muted/60 via-muted/30 to-transparent relative">
                        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-border/80" />
                    </div>
                    <div className="px-6 pb-6 -mt-12 flex flex-col items-center">
                        <div className="size-24 rounded-full ring-4 ring-card bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-2xl font-bold shadow-xs select-none">
                            {initials}
                        </div>
                        <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground text-center">
                            {user.full_name}
                        </h2>

                        {canUpdate && (
                            <Button
                                type="button"
                                onClick={() => setIsEditOpen(true)}
                                className="w-full mt-4 cursor-pointer shadow-sm gap-2"
                            >
                                <Pencil className="size-4" />
                                Edit Profile
                            </Button>
                        )}

                        <div className="w-full border-t my-5" />

                        <div className="w-full space-y-4 text-sm">
                            <ProfileInfoItem
                                icon={Calendar}
                                label="Date of Joining"
                                value={formattedJoinDate}
                            />
                            <ProfileInfoItem
                                icon={Mail}
                                label="Email Address"
                                value={user.email}
                                title={user.email}
                            />
                            <ProfileInfoItem
                                icon={Phone}
                                label="Contact Number"
                                value={
                                    user.contact_number || (
                                        <span className="text-muted-foreground font-normal italic">
                                            Not provided
                                        </span>
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                            WORK DETAILS
                        </h3>

                        <div className="space-y-4 divide-y divide-border/60">
                            <WorkDetailRow label="ROLES" isFirst>
                                {user.role_name ? (
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                                        {user.role_name}
                                    </span>
                                ) : (
                                    <span className="text-xs text-muted-foreground italic">No assigned role</span>
                                )}
                            </WorkDetailRow>

                            <WorkDetailRow label="POSITION">
                                <span className="text-sm font-medium text-foreground">
                                    {user.position_name || "Unassigned Position"}
                                </span>
                            </WorkDetailRow>

                            <WorkDetailRow label="IN THIS POSITION SINCE">
                                <span className="text-sm font-medium text-foreground">
                                    {inThisPositionSince}
                                </span>
                            </WorkDetailRow>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                            CAREER TIMELINE
                        </h3>

                        {timelineItems.length > 0 ? (
                            <div className="relative pl-6 space-y-4 before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
                                {timelineItems.map((item, idx) => (
                                    <div key={item.user_position_id || idx} className="relative flex items-center gap-3">
                                        <div
                                            className={`relative z-10 size-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${item.is_current
                                                ? "bg-primary text-primary-foreground ring-4 ring-card"
                                                : "bg-muted text-muted-foreground ring-4 ring-card"
                                                }`}
                                        >
                                            <Briefcase className="size-4" />
                                        </div>

                                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border bg-card p-4 hover:bg-muted/40 transition-colors">
                                            <div>
                                                <h4 className="font-semibold text-foreground text-sm sm:text-base">
                                                    {item.position_name || "Unassigned Position"}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                                                    {formatMonthYear(item.start_date)} &mdash; {item.end_date ? formatMonthYear(item.end_date) : "Present"}
                                                </p>
                                            </div>

                                            <div>
                                                {item.is_current ? (
                                                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-0.5 text-[11px] font-semibold tracking-wider uppercase">
                                                        CURRENT
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                                                        PAST
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-xs text-muted-foreground">
                                No career positions recorded for this user.
                            </div>
                        )}
                    </div>
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
                        canEditRestrictedFields={canUpdateUsers}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
