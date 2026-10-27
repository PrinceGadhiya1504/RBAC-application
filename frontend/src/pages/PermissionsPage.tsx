import { KeyRound, Shield, Layers } from "lucide-react";

export default function PermissionsPage() {
    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2">
                    <KeyRound className="size-5 text-primary" />
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Permissions Matrix
                    </h2>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                    Control which roles can Read, Write, Edit, or Delete across system pages.
                </p>
            </div>

            <div className="rounded-2xl border bg-card p-10 text-center shadow-sm space-y-4">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                    <Layers className="size-7" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                    <h3 className="text-lg font-bold text-foreground">Permission Matrix Engine</h3>
                    <p className="text-xs text-muted-foreground">
                        This interactive matrix will let you toggle granular permissions (Read, Write, Edit, Delete) for each Role across all system Pages in real-time.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-primary">
                    <Shield className="size-3.5" />
                    Ready for Implementation in Next Step
                </div>
            </div>
        </div>
    );
}
