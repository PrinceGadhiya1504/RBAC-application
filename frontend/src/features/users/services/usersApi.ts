import { api } from "@/lib/api";
import type {
    CreateUserRequest,
    UpdateUserRequest,
    User,
    UserResponse,
    UsersResponse,
} from "../types/user.types";

export const fetchUsers = async (): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>("/users");
    return response.data;
};

export const fetchUserById = async (userId: number): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/users/${userId}`);
    return response.data;
};

export const createUser = async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>("/users", userData);
    return response.data;
};

export const updateUser = async (
    userId: number,
    userData: UpdateUserRequest
): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, userData);
    return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
    await api.delete(`/users/${userId}`);
};
