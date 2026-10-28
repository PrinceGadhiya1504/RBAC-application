import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Shield,
    KeyRound,
    Briefcase,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    LogOut,
    X,
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { cn } from "cn";

interface SidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

interface NavItem {
    name: string;
    path: string;
    icon: typeof LayoutDashboard;
    pageName?: string;
}

const navItems: NavItem[] = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/users", icon: Users, pageName: "Users" },
    { name: "Roles", path: "/roles", icon: Shield, pageName: "Roles" },
    { name: "Permissions", path: "/permissions", icon: KeyRound, pageName: "Permissions" },
    { name: "Positions", path: "/positions", icon: Briefcase, pageName: "Positions" },
];

export default function Sidebar({
    isCollapsed,
    onToggleCollapse,
    mobileOpen,
    onCloseMobile,
}: SidebarProps) {
    const { user, logout, canAccessPage } = useAuth();

    const visibleNavItems = navItems.filter((item) => {
        if (!item.pageName) return true;
        return canAccessPage(item.pageName);
    });

    const initials = user?.full_name
        ? user.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";

    const sidebarContent = (
        <aside
            className={cn(
                "flex h-full flex-col justify-between border-r bg-card text-card-foreground transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div>
                <div className="flex h-16 items-center justify-between border-b px-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <ShieldCheck className="size-5" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col truncate">
                                <span className="font-bold text-base leading-tight tracking-tight">
                                    RBAC Portal
                                </span>
                                <span className="text-[11px] text-muted-foreground leading-tight">
                                    Access Control
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="hidden md:flex size-7 items-center justify-center rounded-lg border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="size-4" />
                        ) : (
                            <ChevronLeft className="size-4" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onCloseMobile}
                        className="flex md:hidden size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Close menu"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <nav className="p-3 space-y-1.5">
                    {visibleNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onCloseMobile}
                            title={isCollapsed ? item.name : undefined}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    isCollapsed && "justify-center px-0"
                                )
                            }
                        >
                            <item.icon className="size-4 shrink-0" />
                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="border-t p-3">
                <div
                    className={cn(
                        "flex items-center gap-3 rounded-xl bg-muted/50 p-2.5",
                        isCollapsed && "justify-center p-2"
                    )}
                >
                    <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-semibold text-xs text-primary"
                        title={user?.full_name}
                    >
                        {initials}
                    </div>

                    {!isCollapsed && (
                        <div className="flex flex-1 flex-col min-w-0">
                            <span className="truncate text-xs font-semibold text-foreground leading-tight">
                                {user?.full_name ?? "User"}
                            </span>
                            <span className="truncate text-[11px] text-muted-foreground leading-tight">
                                {user?.email ?? ""}
                            </span>
                            {(user?.role || (user?.roles && user.roles.length > 0)) && (
                                <span className="mt-1 inline-block w-fit rounded-full bg-primary/10 px-2 py-0.2 text-[10px] font-semibold text-primary">
                                    {user.role || user.roles?.[0]}
                                </span>
                            )}
                        </div>
                    )}

                    {!isCollapsed && (
                        <button
                            type="button"
                            onClick={logout}
                            title="Sign out"
                            className="size-8 flex shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            aria-label="Logout"
                        >
                            <LogOut className="size-4" />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );

    return (
        <>
            <div className="hidden md:block h-screen sticky top-0 shrink-0">
                {sidebarContent}
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                        onClick={onCloseMobile}
                    />
                    <div className="relative z-50 w-72 max-w-[80vw] h-full shadow-2xl">
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
}
