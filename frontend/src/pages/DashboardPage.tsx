import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import UsersTable from "@/features/users/components/UsersTable";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <main className="min-h-screen bg-muted/40">
            <header className="flex items-center justify-between border-b bg-background px-6 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                        <ShieldCheck className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none">RBAC Portal</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Role-Based Access Control</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="text-sm font-medium">{user?.full_name}</span>
                        {user?.roles?.map((role) => (
                            <span
                                key={role}
                                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                            >
                                {role}
                            </span>
                        ))}
                    </div>

                    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                        <LogOut className="size-4" />
                        Logout
                    </Button>
                </div>
            </header>

            <section className="mx-auto max-w-5xl px-6 py-10 space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Welcome, {user?.full_name ?? "User"}!
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                        Manage your organization's users, roles, and granular page permissions.
                    </p>
                </div>

                {/* Current Account section */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <UserCheck className="size-5 text-primary" />
                        <h3 className="text-lg font-semibold">Current Account</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="rounded-lg bg-muted/50 p-3">
                            <span className="text-xs font-medium text-muted-foreground uppercase">Full Name</span>
                            <p className="font-semibold mt-1 text-foreground">{user?.full_name ?? "Not available"}</p>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-3">
                            <span className="text-xs font-medium text-muted-foreground uppercase">Email</span>
                            <p className="font-semibold mt-1 text-foreground">{user?.email ?? "Not available"}</p>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-3">
                            <span className="text-xs font-medium text-muted-foreground uppercase">Assigned Roles</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {user?.roles && user.roles.length > 0 ? (
                                    user.roles.map((r) => (
                                        <span
                                            key={r}
                                            className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary"
                                        >
                                            {r}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground italic">No roles assigned</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <UsersTable />
            </section>
        </main>
    );
}
