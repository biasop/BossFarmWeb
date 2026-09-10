import { apiClient } from "./api";
import type { OrderCreatePayload, OrderResponse } from "../types/order.types";

export const orderService = {
    createOrder: async (payload: OrderCreatePayload): Promise<OrderResponse> => {
        const response = await apiClient.post<OrderResponse>('/orders/', payload);
        return response.data;
    },

    getOrders: async (): Promise<OrderResponse[]> => {
        const response = await apiClient.get<OrderResponse[]>('/orders/');
        return response.data;
    },

    getOrderById: async (id: string): Promise<OrderResponse> => {
        const response = await apiClient.get<OrderResponse>(`/orders/${id}`);
        return response.data;
    },
}

/*
GET: apiClient.get(url, { params }) $\rightarrow$ Cần { params } để Axios biết đây là tham số gắn trên URL.
POST: apiClient.post(url, payload) $\rightarrow$ Truyền thẳng payload làm nội dung Body JSON!
*/
