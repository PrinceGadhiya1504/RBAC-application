import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface PermissionGateProps {
    page: string;
    permission: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export default function PermissionGate({
    page,
    permission,
    children,
    fallback = null,
}: PermissionGateProps) {
    const { hasPermission } = useAuth();

    if (!hasPermission(page, permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}