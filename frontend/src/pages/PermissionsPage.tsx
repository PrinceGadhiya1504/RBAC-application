import RoleMatrixManager from "@/features/rolePagePermissions/components/RoleMatrixManager";

export default function PermissionsPage() {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Permissions Matrix
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
                        Manage granular role-based permissions across predefined system pages (Users, Roles, Permissions, Positions). Toggle checkmarks to grant or revoke specific access rights.
                    </p>
                </div>
            </div>

            <RoleMatrixManager />
        </div>
    );
}
