import { useLocation } from "react-router-dom";
import { Menu, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";

interface HeaderProps {
    onOpenMobileMenu: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/dashboard": {
        title: "Dashboard",
        subtitle: "Overview and organization metrics",
    },
    "/users": {
        title: "User Management",
        subtitle: "View, create, and manage system users",
    },
    "/roles": {
        title: "Roles Management",
        subtitle: "Configure roles and user assignments",
    },
    "/permissions": {
        title: "Permissions Matrix",
        subtitle: "Manage page permissions across roles",
    },
    "/positions": {
        title: "Positions",
        subtitle: "Manage organization positions and assignments",
    },
};

export default function Header({ onOpenMobileMenu }: HeaderProps) {
    const location = useLocation();
    const { user, logout } = useAuth();

    const currentMeta = pageTitles[location.pathname] || {
        title: "RBAC Portal",
        subtitle: "Access Management System",
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 md:px-8">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onOpenMobileMenu}
                    className="flex md:hidden size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Open sidebar"
                >
                    <Menu className="size-5" />
                </button>

                <div>
                    <h1 className="text-base md:text-lg font-bold tracking-tight leading-tight text-foreground">
                        {currentMeta.title}
                    </h1>
                    <p className="hidden sm:block text-xs text-muted-foreground leading-tight">
                        {currentMeta.subtitle}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-1.5 rounded-full border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-medium text-[11px]">System Active</span>
                </div>

                <div className="hidden sm:flex items-center gap-1.5">
                    {user?.role || (user?.roles && user.roles[0]) ? (
                        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            <ShieldCheck className="size-3" />
                            {user.role || user.roles?.[0]}
                        </span>
                    ) : (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            Standard User
                        </span>
                    )}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="h-9 gap-1.5 text-xs"
                >
                    <LogOut className="size-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                </Button>
            </div>
        </header>
    );
}
