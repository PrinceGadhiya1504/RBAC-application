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
): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/users/${userId}`, userData);
    return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
    await api.delete(`/users/${userId}`);
};

export const uploadUserProfilePicture = async (
    userId: number,
    file: File
): Promise<UserResponse> => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    const response = await api.post<UserResponse>(
        `/users/${userId}/profile-picture`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};