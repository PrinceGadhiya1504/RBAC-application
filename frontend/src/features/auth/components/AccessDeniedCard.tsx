import { ShieldAlert } from "lucide-react";

interface AccessDeniedCardProps {
    module: string;
}

export default function AccessDeniedCard({ module }: AccessDeniedCardProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-12 text-center shadow-sm">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
                <ShieldAlert className="size-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Access Restricted</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md">
                You do not have view permissions to access the <strong>{module}</strong> module. Please contact your system administrator if you believe this is an error.
            </p>
        </div>
    );
}
