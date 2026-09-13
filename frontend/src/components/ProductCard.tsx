import React from 'react';
import { ShoppingCart, Sparkles, Sprout } from 'lucide-react';
import type { Product } from '../types/product.types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
    product: Product;
    onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
    const { addToCart } = useCart();
    const [imgError, setImgError] = React.useState(false);

    const formattedPrice = Number(product.price).toLocaleString('vi-VN');

    return (
        <div className="product-card">
            {/* 1. KHU VỰC BẤM VÀO ĐỂ XEM CHI TIẾT (ẢNH + THÔNG TIN) */}
            <div
                onClick={() => onSelect?.(product)}
                style={{ cursor: onSelect ? 'pointer' : 'default' }}
            >
                {/* ẢNH SẢN PHẨM & HUY HIỆU */}
                <div className="product-thumb-wrap">
                    {product.is_featured && (
                        <span className="badge badge-gold product-badge-float">
                            <Sparkles size={12} /> Nổi bật
                        </span>
                    )}
                    {product.thumbnail_url && !imgError ? (
                        <img
                            src={product.thumbnail_url}
                            alt={product.name}
                            className="product-thumb"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="product-thumb-placeholder">
                            <Sprout size={44} />
                            <span>Boss Farm Quality</span>
                        </div>
                    )}
                </div>
                {/* THÔNG TIN CHỮ */}
                <div className="product-content">
                    <h3 className="product-name" title={product.name}>
                        {product.name}
                    </h3>
                    <p className="product-benefits">
                        {product.benefits || product.composition || 'Dinh dưỡng cao cấp cho cây trồng.'}
                    </p>
                </div>
            </div>
            {/* 2. CHÂN THẺ: GIÁ VÀ NÚT THÊM VÀO GIỎ */}
            <div className="product-footer" style={{ padding: '0 1rem 1rem' }}>
                <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Giá niêm yết</span>
                    <div className="product-price">{formattedPrice} đ</div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Ngăn không cho sự kiện click lan ra ngoài làm mở trang chi tiết
                        addToCart(product, 1);
                    }}
                    className="btn btn-primary add-cart-btn"
                    title="Thêm vào giỏ hàng"
                >
                    <ShoppingCart size={18} />
                </button>
            </div>
        </div>
    );
};

