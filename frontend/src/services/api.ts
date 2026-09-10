import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

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
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
)