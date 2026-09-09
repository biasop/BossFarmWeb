import apiClient from './client';
import type { LoginCredentials, TokenResponse, User, UserRegisterPayload } from '../types/auth.types';

export const authApi = {
    /**
     * Đăng nhập nhận JWT Access Token
     * Backend FastAPI sử dụng OAuth2PasswordRequestForm nên gửi dữ liệu dạng form URL-encoded
     */
    login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
        const formData = new URLSearchParams();
        formData.append('username', credentials.username.trim());
        formData.append('password', credentials.password);

        const response = await apiClient.post<TokenResponse>('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    },

    /**
     * Đăng ký tài khoản người dùng mới
     */
    register: async (payload: UserRegisterPayload): Promise<User> => {
        const response = await apiClient.post<User>('/auth/register', payload);
        return response.data;
    },

    /**
     * Lấy thông tin tài khoản người dùng đang đăng nhập
     */
    getMe: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },
};

export default authApi;
