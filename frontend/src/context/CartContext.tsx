import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types/product.types';
import type { CartItem } from '../types/order.types';

// ============================================================================
// KHỐI 1: ĐỊNH NGHĨA GIAO DIỆN CONTEXT
// ============================================================================
interface CartContextType {
    items: CartItem[];
    totalCount: number;
    totalAmount: number;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'bossfarm_cart_items';

// ============================================================================
// KHỐI 2: TRẠM PHÁT SÓNG (PROVIDER)
// ============================================================================
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 1. Khởi tạo danh sách items (đọc từ localStorage nếu trước đó đã lưu)
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    // 2. Tự động lưu vào localStorage mỗi khi danh sách items thay đổi
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]); // Dùng trong CartContext: Cứ khi nào giỏ hàng đổi thì tự động lưu vào localStorage.

    // 3. Tính tổng số lượng món và tổng tiền
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const totalAmount = items.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.quantity;
    }, 0);

    // 4. Hàm: Thêm sản phẩm vào giỏ
    const addToCart = (product: Product, quantity: number = 1) => {
        setItems((prevItems) => {
            // Kiểm tra sản phẩm này đã có trong giỏ chưa
            const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);

            if (existingIndex > -1) {
                // Nếu đã có: Tăng số lượng của món đó lên
                const updatedItems = [...prevItems];
                updatedItems[existingIndex] = {
                    ...updatedItems[existingIndex],
                    quantity: updatedItems[existingIndex].quantity + quantity,
                };
                return updatedItems;
            } else {
                // Nếu chưa có: Thêm một món mới vào mảng
                return [...prevItems, { product, quantity }];
            }
        });
    };

    // 5. Hàm: Xóa 1 món khỏi giỏ
    const removeFromCart = (productId: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
    };

    // 6. Hàm: Tăng/giảm số lượng món
    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    };

    // 7. Hàm: Xóa sạch giỏ hàng (khi đặt hàng thành công)
    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                totalCount,
                totalAmount,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// ============================================================================
// KHỐI 3: CUSTOM HOOK GIÚP CÁC COMPONENT GỌI DÙNG NHANH
// ============================================================================
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart phải được sử dụng bên trong <CartProvider>');
    }
    return context;
};
