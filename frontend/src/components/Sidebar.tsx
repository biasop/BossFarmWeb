import React from 'react';
import {
    X, Home, Sprout, BookOpen, PhoneCall,
    Package, PlusCircle, ShieldCheck, LogIn, LogOut, User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenAuth: () => void;
    onOpenCreateProduct?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    onOpenAuth,
    onOpenCreateProduct
}) => {
    const { user, isAuthenticated, isEditor, isAdmin, logout } = useAuth();

    if (!isOpen) return null;

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <aside
                className="sidebar-container"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header của Sidebar */}
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Sprout size={24} color="var(--primary-600)" />
                        <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-700)' }}>
                            Boss Farm
                        </span>
                    </div>
                    <button onClick={onClose} className="icon-btn">
                        <X size={20} />
                    </button>
                </div>
                {/* Khối User Profile */}
                <div className="sidebar-user-box">
                    {isAuthenticated && user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="avatar-circle">
                                <UserIcon size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                                    {user.full_name || user.username}
                                </div>
                                <span className="badge badge-gold" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                                    {user.role.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', gap: '8px' }}
                            onClick={() => { onClose(); onOpenAuth(); }}
                        >
                            <LogIn size={18} />
                            <span>Đăng nhập / Đăng ký</span>
                        </button>
                    )}
                </div>
                {/* Danh sách Menu chung cho mọi người */}
                <div className="sidebar-menu">
                    <div className="menu-group-title">DANH MỤC & DỊCH VỤ</div>

                    <a href="#" className="sidebar-item active" onClick={onClose}>
                        <Home size={18} />
                        <span>Trang chủ cửa hàng</span>
                    </a>
                    <a href="#" className="sidebar-item" onClick={onClose}>
                        <Sprout size={18} />
                        <span>Phân bón NPK & Hữu cơ</span>
                    </a>
                    <a href="#" className="sidebar-item" onClick={onClose}>
                        <BookOpen size={18} />
                        <span>Kỹ thuật canh tác</span>
                    </a>
                    <a href="#" className="sidebar-item" onClick={onClose}>
                        <PhoneCall size={18} />
                        <span>Tư vấn nông nghiệp (Hotline)</span>
                    </a>
                    {/* KHU VỰC PHÂN QUYỀN RIÊNG TỪNG ROLE (Sau này mở rộng thêm ở đây) */}
                    {isAuthenticated && (
                        <>
                            <div className="menu-group-title" style={{ marginTop: '20px' }}>
                                KHU VỰC CÁ NHÂN
                            </div>
                            {/* Dành cho Customer */}
                            <a href="#" className="sidebar-item" onClick={onClose}>
                                <Package size={18} />
                                <span>Đơn hàng của tôi</span>
                            </a>
                            {/* Dành cho Editor hoặc Admin */}
                            {isEditor && (
                                <button
                                    className="sidebar-item"
                                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                                    onClick={() => { onClose(); onOpenCreateProduct && onOpenCreateProduct(); }}
                                >
                                    <PlusCircle size={18} color="var(--primary-600)" />
                                    <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>+ Đăng Phân Bón Mới</span>
                                </button>
                            )}
                            {/* Dành riêng cho Admin */}
                            {isAdmin && (
                                <a href="#" className="sidebar-item" onClick={onClose}>
                                    <ShieldCheck size={18} color="var(--accent-gold)" />
                                    <span style={{ fontWeight: 600 }}>Quản trị hệ thống</span>
                                </a>
                            )}
                        </>
                    )}
                </div>
                {/* Nút Đăng xuất ở dưới cùng */}
                {isAuthenticated && (
                    <div className="sidebar-footer">
                        <button
                            className="btn btn-outline"
                            style={{ width: '100%', gap: '8px', color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={() => { logout(); onClose(); }}
                        >
                            <LogOut size={18} />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                )}
            </aside>
        </div>
    );
};