import apiClient from './client';
import type { OrderCreatePayload, OrderResponse } from '../types/order.types';

export const orderApi = {
    /**
     * Tạo đơn đặt hàng mới (gồm thông tin người nhận và danh sách sản phẩm)
     */
    createOrder: async (payload: OrderCreatePayload): Promise<OrderResponse> => {
        const response = await apiClient.post<OrderResponse>('/orders/', payload);
        return response.data;
    },

    /**
     * Lấy danh sách đơn hàng (hỗ trợ phân trang)
     */
    getOrders: async (params?: { skip?: number; limit?: number }): Promise<OrderResponse[]> => {
        const response = await apiClient.get<OrderResponse[]>('/orders/', {
            params,
        });
        return response.data;
    },

    /**
     * Lấy chi tiết đơn hàng theo ID
     */
    getOrderById: async (id: string): Promise<OrderResponse> => {
        const response = await apiClient.get<OrderResponse>(`/orders/${id}`);
        return response.data;
    },
};

export default orderApi;
