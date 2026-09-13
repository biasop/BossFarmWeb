import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, Check, Sparkles, Sprout, AlertCircle, BookOpen } from 'lucide-react';
import type { Product } from '../types/product.types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
    product: Product | null;
    onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState<number>(1);
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const [imgError, setImgError] = useState<boolean>(false);

    // Reset số lượng về 1 mỗi khi đổi sản phẩm khác và khóa cuộn body
    useEffect(() => {
        if (product) {
            document.body.style.overflow = 'hidden';
            setQuantity(1);
            setIsAdded(false);
            setImgError(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [product]);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            onClose(); // Thêm xong tự động đóng popup
        }, 800);
    };

    const formattedPrice = Number(product.price).toLocaleString('vi-VN');

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-content"
                style={{ maxWidth: '750px', padding: '32px' }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="modal-close-btn" title="Đóng">
                    <X size={20} />
                </button>

                <div className="product-detail-grid">
                    {/* CỘT TRÁI: ẢNH LỚN */}
                    <div className="product-detail-img-wrap">
                        {product.is_featured && (
                            <span className="badge badge-gold" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                                <Sparkles size={12} /> Nổi bật
                            </span>
                        )}

                        {product.thumbnail_url && !imgError ? (
                            <img
                                src={product.thumbnail_url}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--primary-600)' }}>
                                <Sprout size={64} />
                                <span style={{ fontWeight: 700 }}>Boss Farm Premium</span>
                            </div>
                        )}
                    </div>

                    {/* CỘT PHẢI: THÔNG TIN CHI TIẾT & CHỌN SỐ LƯỢNG */}
                    <div className="product-detail-info">
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                            {product.name}
                        </h2>

                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-600)', marginBottom: '16px' }}>
                            {formattedPrice} đ
                        </div>

                        {/* BẢNG THÔNG SỐ KỸ THUẬT NÔNG NGHIỆP */}
                        <div className="product-specs-box">
                            {product.composition && (
                                <div className="spec-row">
                                    <strong>Thành phần:</strong>
                                    <span>{product.composition}</span>
                                </div>
                            )}
                            {product.benefits && (
                                <div className="spec-row">
                                    <strong>Công dụng:</strong>
                                    <span>{product.benefits}</span>
                                </div>
                            )}
                            {product.usage_instructions && (
                                <div className="spec-row">
                                    <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <BookOpen size={14} /> Hướng dẫn:
                                    </strong>
                                    <span>{product.usage_instructions}</span>
                                </div>
                            )}
                            {product.storage_warnings && (
                                <div className="spec-row">
                                    <strong style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-warning)' }}>
                                        <AlertCircle size={14} /> Bảo quản:
                                    </strong>
                                    <span>{product.storage_warnings}</span>
                                </div>
                            )}
                        </div>

                        {/* CHỌN SỐ LƯỢNG VÀ NÚT THÊM VÀO GIỎ */}
                        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Số lượng:</span>
                                <div className="quantity-control" style={{ padding: '2px' }}>
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="qty-btn"
                                        style={{ padding: '6px 12px' }}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="qty-value" style={{ fontSize: '1rem', minWidth: '40px', textAlign: 'center' }}>
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="qty-btn"
                                        style={{ padding: '6px 12px' }}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isAdded}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                            >
                                {isAdded ? (
                                    <>
                                        <Check size={20} />
                                        <span>Đã Thêm Vào Giỏ!</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        <span>Thêm {quantity} Sản Phẩm Vào Giỏ ({(Number(product.price) * quantity).toLocaleString('vi-VN')} đ)</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
