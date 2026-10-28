import PositionsTable from "@/features/positions/components/PositionsTable";

export default function PositionsPage() {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Job Positions
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
                        Define organizational positions and job titles. Positions can be assigned directly to users through the user management forms.
                    </p>
                </div>
            </div>

            <PositionsTable />
        </div>
    );
}
