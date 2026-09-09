export type UserRole = 'admin' | 'editor' | 'customer';

export interface User {
    id: string;
    username: string;
    email: string;
    full_name?: string | null;
    role: UserRole;
    is_active: boolean;
    created_at: string;
    last_login_at?: string | null;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface UserRegisterPayload {
    username: string;
    email: string;
    password: string;
    full_name?: string;
}

export interface LoginCredentials {
    username: string; // Tên đăng nhập hoặc Email
    password: string;
}
