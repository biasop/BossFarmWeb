import apiClient from './client';
import type { Category } from '../types/product.types';

export const categoryApi = {
    /**
     * Lấy danh sách tất cả các danh mục phân bón / vật tư
     */
    getCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get<Category[]>('/categories/');
        return response.data;
    },

    /**
     * Lấy chi tiết danh mục theo ID
     */
    getCategoryById: async (id: string): Promise<Category> => {
        const response = await apiClient.get<Category>(`/categories/${id}`);
        return response.data;
    },
};

export default categoryApi;
