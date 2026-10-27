import { Briefcase, Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PositionsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Briefcase className="size-5 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight text-foreground">
                            Job Positions
                        </h2>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Manage organization positions and assign members with start and end dates.
                    </p>
                </div>

                <Button className="gap-2 shadow-sm">
                    <Plus className="size-4" />
                    Create Position
                </Button>
            </div>

            <div className="rounded-2xl border bg-card p-10 text-center shadow-sm space-y-4">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                    <Building className="size-7" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                    <h3 className="text-lg font-bold text-foreground">Positions & Employment History</h3>
                    <p className="text-xs text-muted-foreground">
                        Manage position titles, department assignments, and track active and historical user positions.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-primary">
                    <Briefcase className="size-3.5" />
                    Ready for Implementation in Upcoming Step
                </div>
            </div>
        </div>
    );
}
