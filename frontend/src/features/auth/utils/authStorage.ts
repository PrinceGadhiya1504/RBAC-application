import type { AuthUser } from "../types/auth.types";

const TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

export const saveAuthData = (token: string, user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAccessToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const getAuthUser = (): AuthUser | null => {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user) as AuthUser;
    } catch {
        return null;
    }
};

export const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};