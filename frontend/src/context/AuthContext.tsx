import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { User, LoginCredentials, UserRegisterPayload } from '../types/auth.types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (payload: UserRegisterPayload) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const isAuthenticated = user !== null;
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const checkLoggedInUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const curUser = await authService.getMe();
                    setUser(curUser);
                } catch {
                    localStorage.removeItem('access_token');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        const handleUnauthorized = () => {
            setUser(null);
        };

        checkLoggedInUser();
        window.addEventListener('auth:unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const data = await authService.login(credentials);
        localStorage.setItem('access_token', data.access_token);
        const curUser = await authService.getMe()
        setUser(curUser);
    }

    const register = async (payload: UserRegisterPayload) => {
        await authService.register(payload);
        await login({ username: payload.username, password: payload.password });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null)
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isAdmin,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được sử dụng bên trong <AuthProvider>');
    }
    return context;
};