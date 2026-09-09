import apiClient from './client';
import type { Product, ProductQueryParams } from '../types/product.types';

export const productApi = {
    /**
     * Lấy danh sách sản phẩm (hỗ trợ phân trang, tìm kiếm theo tên, lọc active)
     */
    getProducts: async (params?: ProductQueryParams): Promise<Product[]> => {
        const response = await apiClient.get<Product[]>('/products/', {
            params,
        });
        return response.data;
    },

    /**
     * Lấy chi tiết sản phẩm theo ID (UUID)
     */
    getProductById: async (id: string): Promise<Product> => {
        const response = await apiClient.get<Product>(`/products/${id}`);
        return response.data;
    },
};

export default productApi;
