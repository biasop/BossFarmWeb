import React from 'react';
import { ShoppingCart, User as UserIcon, LogOut, Search, Sprout, Menu, Leaf, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
    onOpenSidebar: () => void;
    onOpenAuth?: () => void; // hàm mở trang đăng nhập
    onOpenCart?: () => void; // Hàm mở giỏ hàng
    searchTerm?: string;
    onSearchChange?: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar, onOpenAuth, onOpenCart, searchTerm = '', onSearchChange }) => {
    const { totalCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header className="header-wrapper">
            <div className="main-header" style={{ width: '100%', maxWidth: '100%', padding: '12px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Nút Menu màu trắng, có viền bo góc nhẹ */}
                    <button
                        className="menu-toggle-btn"
                        onClick={onOpenSidebar}
                        title="Menu danh mục"
                    >
                        <Menu size={22} color="var(--text-main)" />
                    </button>
                    {/* LOGO BOSS FARM */}
                    <a href="/" className="brand-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="brand-icon-box">
                            <Sprout size={24} color="var(--primary-600)" />
                        </div>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)', letterSpacing: '-0.02em' }}>
                            Boss Farm
                        </span>
                    </a>
                </div>

                {/* THANH TÌM KIẾM */}
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm phân bón NPK, hữu cơ sinh học, kích rễ..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>
                {/* CÁC NÚT BÊN PHẢI */}
                <div className="header-actions">
                    {/* NÚT TÀI KHOẢN */}
                    {isAuthenticated ? (
                        <div className="user-logged-in" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                Chào, {user?.full_name || user?.username}
                            </span>
                            <button
                                onClick={logout}
                                className="btn btn-outline"
                                style={{ padding: '6px 12px' }}
                                title="Đăng xuất"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={onOpenAuth} className="btn btn-outline">
                            <UserIcon size={18} />
                            <span>Đăng nhập</span>
                        </button>
                    )}
                    {/* NÚT GIỎ HÀNG */}
                    <button onClick={onOpenCart} className="btn btn-primary cart-btn-relative">
                        <ShoppingCart size={18} />
                        <span>Giỏ hàng</span>
                        {totalCount > 0 && (
                            <span className="cart-badge">{totalCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    )
}