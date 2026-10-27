import { Navigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import LoginForm from "@/features/auth/components/LoginForm";
import { getAccessToken } from "@/features/auth/utils/authStorage";

export default function LoginPage() {
    const token = getAccessToken();

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-10">
            <div className="mb-8 flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <ShieldCheck className="size-6" />
                </div>

                <span className="text-2xl font-bold tracking-tight">
                    RBAC Portal
                </span>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Secure access management for your organization.
            </p>
        </main>
    );
}