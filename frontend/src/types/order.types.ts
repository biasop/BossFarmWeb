import type { Product } from './product.types.ts';

export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface OrderItemCreate {
    product_id: string;
    quantity: number;
}

export interface OrderCreatePayload {
    recipient_name: string;
    phone_number: string;
    shipping_address: string;
    notes?: string | null;
    items: OrderItemCreate[];
}

export interface OrderItemResponse {
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price?: number | null;
}

export interface OrderResponse {
    id: string;
    user_id?: string | null;
    recipient_name: string;
    phone_number: string;
    shipping_address: string;
    notes?: string | null;
    total_amount: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    created_at: string;
    updated_at: string;
    items: OrderItemResponse[];
}
