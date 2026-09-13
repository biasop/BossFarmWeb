import React, { useState, useEffect } from 'react';
import { X, Lock, User, Mail, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRegisterPayload, LoginCredentials } from '../types/auth.types';
import { getErrorMessage } from '../utils/error';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuth();

    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Reset form và chặn cuộn body khi modal mở
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setErrorMessage('');
        } else {
            document.body.style.overflow = 'unset';
            setUsername('');
            setPassword('');
            setEmail('');
            setFullName('');
            setErrorMessage('');
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            if (activeTab === 'login') {
                const login_in4: LoginCredentials = {
                    username: username.trim(),
                    password: password
                };
                await login(login_in4);
            } else {
                const register_in4: UserRegisterPayload = {
                    username: username.trim(),
                    email: email.trim(),
                    password: password,
                    full_name: fullName.trim() || undefined
                };
                await register(register_in4);
            }
            onClose();

        } catch (err: any) {
            console.error('Lỗi xác thực:', err);
            setErrorMessage(getErrorMessage(err, 'Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin!'));
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close-btn" title="Đóng">
                    <X size={20} />
                </button>
                {/* CHUYỂN TAB ĐĂNG NHẬP / ĐĂNG KÝ */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
                        style={{
                            flex: 1,
                            padding: '12px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            borderBottom: activeTab === 'login' ? '3px solid var(--primary-600)' : 'none',
                            color: activeTab === 'login' ? 'var(--primary-600)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                        }}
                    >
                        Đăng Nhập
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
                        style={{
                            flex: 1,
                            padding: '12px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            borderBottom: activeTab === 'register' ? '3px solid var(--primary-600)' : 'none',
                            color: activeTab === 'register' ? 'var(--primary-600)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                        }}
                    >
                        Tạo Tài Khoản
                    </button>
                </div>
                {/* THÔNG BÁO LỖI NẾU CÓ */}
                {errorMessage && (
                    <div className="alert-error" style={{ marginBottom: '16px' }}>
                        {errorMessage}
                    </div>
                )}
                {/* FORM NHẬP DỮ LIỆU */}
                <form onSubmit={handleSubmit}>
                    {/* TÊN ĐĂNG NHẬP */}
                    <div className="form-group">
                        <label className="form-label">Tên đăng nhập hoặc Email *</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập username hoặc email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <User size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        </div>
                    </div>
                    {/* EMAIL (CHỈ HIỆN KHI ĐĂNG KÝ) */}
                    {activeTab === 'register' && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Email hợp lệ *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="vidu@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Mail size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Họ và tên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ví dụ: Nguyễn Văn Nông"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                    {/* MẬT KHẨU */}
                    <div className="form-group">
                        <label className="form-label">Mật khẩu *</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Mật khẩu tối thiểu 8 ký tự"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                            <Lock size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px', marginTop: '12px' }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="spin-anim" />
                                <span>Đang xử lý...</span>
                            </>
                        ) : activeTab === 'login' ? (
                            <>
                                <LogIn size={18} />
                                <span>Đăng Nhập Ngay</span>
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                <span>Hoàn Tất Đăng Ký</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};