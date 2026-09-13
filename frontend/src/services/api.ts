import axios from "axios";

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://bossfarm-api.onrender.com/api/v1';

// Chuẩn hóa tự động URL (xóa dấu gạch chéo dư, thêm /api/v1 nếu thiếu)
rawBaseUrl = rawBaseUrl.trim().replace(/([^:])\/+/g, '$1/');
rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');
if (rawBaseUrl.endsWith('/api')) {
    rawBaseUrl = `${rawBaseUrl}/v1`;
} else if (!rawBaseUrl.endsWith('/api/v1')) {
    rawBaseUrl = `${rawBaseUrl}/api/v1`;
}
rawBaseUrl = rawBaseUrl.replace(/([^:])\/+/g, '$1/');

const BASE_URL = rawBaseUrl;

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

//apiClient là đối tượng gì? Nó là một Object (đối tượng) chứa sẵn các phương thức gọi
//  HTTP: apiClient.get(), apiClient.post(), apiClient.put(), apiClient.delete(). Tất
//  cả các hàm này khi gọi đều tự động kế thừa sẵn BASE_URL và headers đã cấu hình


apiClient.interceptors.request.use(
    (config) => { // một object chứa thông tin của request sắp gửi
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
        return Promise.reject(error);
    }
);