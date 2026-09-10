import { apiClient } from "./api";
import type { UserRegisterPayload, User, TokenResponse, LoginCredentials } from "../types/auth.types";

export const authService = {
    register: async (params: UserRegisterPayload): Promise<User> => {
        const response = await apiClient.post<User>('/auth/register', params);
        return response.data;
    },

    login: async (params: LoginCredentials): Promise<TokenResponse> => {
        const formData = new FormData();
        formData.append('username', params.username);
        formData.append('password', params.password);
        const response = await apiClient.post<TokenResponse>('/auth/login', formData);
        return response.data;
    },

    getMe: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    }
};

