import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
    // 1. Lấy toàn bộ dữ liệu & hàm điều khiển từ CartContext
    const { items, totalCount, totalAmount, updateQuantity, removeFromCart } = useCart();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Nếu Drawer đang đóng thì không vẽ gì ra màn hình
    if (!isOpen) return null;

    return (
        <div className="drawer-backdrop" onClick={onClose}>
            {/* KHUNG TRƯỢT TỪ BÊN PHẢI (onClick stopPropagation để bấm vào trong không bị tắt) */}
            <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
                {/* HEADER CỦA GIỎ HÀNG */}
                <div className="drawer-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShoppingBag size={22} color="var(--primary-600)" />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                            Giỏ Hàng Của Bạn ({totalCount})
                        </h3>
                    </div>
                    <button onClick={onClose} className="btn-close" title="Đóng giỏ hàng">
                        <X size={20} />
                    </button>
                </div>

                {/* DANH SÁCH SẢN PHẨM TRONG GIỎ */}
                <div className="drawer-body">
                    {items.length === 0 ? (
                        <div className="cart-empty-state">
                            <ShoppingBag size={56} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                            <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>Giỏ hàng của bạn đang trống</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Hãy chọn các sản phẩm phân bón dinh dưỡng cho vườn cây của bạn nhé!
                            </p>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {items.map(({ product, quantity }) => (
                                <div key={product.id} className="cart-item-row">
                                    {/* Ảnh thu nhỏ */}
                                    <img
                                        src={product.thumbnail_url || 'https://via.placeholder.com/80'}
                                        alt={product.name}
                                        className="cart-item-img"
                                    />

                                    {/* Thông tin & Giá */}
                                    <div style={{ flex: 1 }}>
                                        <h4 className="cart-item-name">{product.name}</h4>
                                        <div className="cart-item-price">
                                            {Number(product.price).toLocaleString('vi-VN')} đ
                                        </div>

                                        {/* Bộ tăng giảm số lượng */}
                                        <div className="quantity-control">
                                            <button
                                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                                className="qty-btn"
                                                title="Giảm 1"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="qty-value">{quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                                className="qty-btn"
                                                title="Tăng 1"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Nút xóa món */}
                                    <button
                                        onClick={() => removeFromCart(product.id)}
                                        className="btn-trash"
                                        title="Xóa món này"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* FOOTER: TỔNG TIỀN VÀ NÚT TIẾP TỤC ĐẶT HÀNG */}
                {items.length > 0 && (
                    <div className="drawer-footer">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Tổng tiền:</span>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                                {totalAmount.toLocaleString('vi-VN')} đ
                            </span>
                        </div>

                        <button onClick={onCheckout} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                            <span>Tiến Hành Thanh Toán</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
