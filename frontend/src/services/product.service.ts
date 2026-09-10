import { apiClient } from './api';
// 2. Import các DTO (Types) để TypeScript hỗ trợ kiểm tra kiểu dữ liệu & tự gợi ý code
import type { Product, Category, ProductQueryParams } from '../types/product.types';


export const productService = {
    getProducts: async (params?: ProductQueryParams): Promise<Product[]> => {
        const response = await apiClient.get<Product[]>('/products/', { params });
        return response.data;
    },

    getProductById: async (id: string): Promise<Product> => {
        const response = await apiClient.get<Product>(`/products/${id}`);
        return response.data;
    },

    getCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get<Category[]>('/categories/');
        return response.data;
    }
};