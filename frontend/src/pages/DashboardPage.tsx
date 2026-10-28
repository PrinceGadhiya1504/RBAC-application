import { Link } from "react-router-dom";
import {
    Users,
    Shield,
    KeyRound,
    Briefcase,
    ArrowUpRight,
    UserCheck,
    Calendar,
    Mail,
    Phone,
    ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useRoles } from "@/features/roles/hooks/useRoles";
import { usePositions } from "@/features/positions/hooks/usePositions";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { user } = useAuth();
    const { data: usersData } = useUsers();
    const { data: rolesData } = useRoles();
    const { data: positionsData } = usePositions();

    const usersCount = usersData?.users?.length ?? 0;
    const rolesCount = rolesData?.roles?.length ?? 0;
    const positionsCount = positionsData?.positions?.length ?? 0;
    const recentUsers = (usersData?.users || []).slice(0, 5);

    const statCards = [
        {
            title: "Total Users",
            value: usersCount,
            subtitle: "Registered in system",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            link: "/users",
        },
        {
            title: "Total Roles",
            value: rolesCount,
            subtitle: "Defined access roles",
            icon: Shield,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
            link: "/roles",
        },
        {
            title: "Permissions Matrix",
            value: "Active",
            subtitle: "Page-level control",
            icon: KeyRound,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            link: "/permissions",
        },
        {
            title: "Job Positions",
            value: positionsCount,
            subtitle: "Organizational titles",
            icon: Briefcase,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            link: "/positions",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="rounded-2xl border bg-gradient-to-r from-card via-card to-primary/5 p-6 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                Welcome Back
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">RBAC Control Center</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-2">
                            Hello, {user?.full_name ?? "Administrator"}!
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                            Here is the current overview of your access management system, registered users, and security roles.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/users">
                            <Button className="gap-2 shadow-sm">
                                <Users className="size-4" />
                                Manage Users
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.link}
                        className="group relative rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`flex size-10 items-center justify-center rounded-xl ${card.bg}`}>
                                <card.icon className={`size-5 ${card.color}`} />
                            </div>
                            <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                        </div>
                        <div className="mt-4">
                            <span className="text-xs font-medium text-muted-foreground">
                                {card.title}
                            </span>
                            <p className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                                {card.value}
                            </p>
                            <span className="text-xs text-muted-foreground">
                                {card.subtitle}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3">
                        <UserCheck className="size-5 text-primary" />
                        <h3 className="font-semibold text-base text-foreground">Your Account Profile</h3>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Mail className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="text-xs text-muted-foreground">Email Address</span>
                                <p className="font-medium text-foreground truncate">{user?.email ?? "—"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Phone className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="text-xs text-muted-foreground">Contact Number</span>
                                <p className="font-medium text-foreground">{user?.contact_number || "Not provided"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Calendar className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="text-xs text-muted-foreground">Date Joined</span>
                                <p className="font-medium text-foreground">
                                    {user?.date_of_joining
                                        ? new Date(user.date_of_joining).toLocaleDateString()
                                        : "-"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pt-1">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <ShieldCheck className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <span className="text-xs text-muted-foreground">Assigned Role</span>
                                <div className="mt-1">
                                    {user?.role || (user?.roles && user.roles.length > 0) ? (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                            <ShieldCheck className="size-3" />
                                            {user.role || user.roles?.[0]}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">Standard User</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                            <Users className="size-5 text-primary" />
                            <h3 className="font-semibold text-base text-foreground">Recent Users</h3>
                        </div>
                        <Link to="/users" className="text-xs font-medium text-primary hover:underline">
                            View All ({usersCount}) →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b bg-muted/30">
                                <tr>
                                    <th className="px-3 py-2 font-medium">Name</th>
                                    <th className="px-3 py-2 font-medium">Email</th>
                                    <th className="px-3 py-2 font-medium">Contact</th>
                                    <th className="px-3 py-2 font-medium">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border text-xs">
                                {recentUsers.map((u) => (
                                    <tr key={u.user_id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-3 py-2.5 font-medium text-foreground">
                                            {u.full_name}
                                        </td>
                                        <td className="px-3 py-2.5 text-muted-foreground">
                                            {u.email}
                                        </td>
                                        <td className="px-3 py-2.5 text-muted-foreground">
                                            {u.contact_number || "—"}
                                        </td>
                                        <td className="px-3 py-2.5 text-muted-foreground">
                                            {u.date_of_joining
                                                ? new Date(u.date_of_joining).toLocaleDateString()
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}

                                {recentUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-muted-foreground">
                                            No users available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
