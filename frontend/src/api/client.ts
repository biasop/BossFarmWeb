import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request Interceptor: Tự động đính kèm Access Token nếu người dùng đã đăng nhập
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        try {
            const authStorage = localStorage.getItem('bossfarm-auth-storage');
            if (authStorage) {
                const parsed = JSON.parse(authStorage);
                const token = parsed?.state?.token;
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch {
            // Trường hợp lỗi parse localStorage không làm gián đoạn request
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi tập trung (ví dụ 401 Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ detail?: string | { msg: string }[] }>) => {
        if (error.response?.status === 401) {
            // Token hết hạn hoặc không hợp lệ -> Xoá token nếu cần
            console.warn('Phiên đăng nhập đã hết hạn hoặc không hợp lệ.');
        }

        // Chuẩn hoá thông điệp lỗi trả về từ FastAPI
        let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau!';
        if (error.response?.data?.detail) {
            if (typeof error.response.data.detail === 'string') {
                errorMessage = error.response.data.detail;
            } else if (Array.isArray(error.response.data.detail)) {
                errorMessage = error.response.data.detail.map((err) => err.msg).join(', ');
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        return Promise.reject(new Error(errorMessage));
    }
);

export default apiClient;
