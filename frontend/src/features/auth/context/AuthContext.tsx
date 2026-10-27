import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import type { AuthUser } from "../types/auth.types";
import {
    getAccessToken,
    getAuthUser,
    saveAuthData,
    clearAuthData,
} from "../utils/authStorage";

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
    hasPermission: (page: string, permission: string) => boolean;
    canAccessPage: (page: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => getAccessToken());
    const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(getAccessToken());
            setUser(getAuthUser());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const login = (newToken: string, newUser: AuthUser) => {
        saveAuthData(newToken, newUser);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        clearAuthData();
        setToken(null);
        setUser(null);
    };

    const hasRole = (roleName: string): boolean => {
        if (!user) return false;
        if (user.role === roleName) return true;
        if (user.roles?.includes(roleName)) return true;
        return false;
    };

    const hasPermission = (pageName: string, permissionName: string): boolean => {
        if (!user) return false;
        const pagePerms = user.permissions?.[pageName];
        if (!pagePerms) return false;
        return pagePerms.includes(permissionName);
    };

    const canAccessPage = (pageName: string): boolean => {
        if (!user) return false;
        const pagePerms = user.permissions?.[pageName];
        return Boolean(pagePerms && pagePerms.length > 0);
    };

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(token && user),
            login,
            logout,
            hasRole,
            hasPermission,
            canAccessPage,
        }),
        [user, token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}