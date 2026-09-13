import React, { useState, useEffect } from 'react';
import { X, CheckCircle, PackageCheck, Truck, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/order.service';
import type { OrderResponse, OrderCreatePayload } from '../types/order.types';
import { getErrorMessage } from '../utils/error';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();

    const [recipientName, setRecipientName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [notes, setNotes] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [completedOrder, setCompletedOrder] = useState<OrderResponse | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (user) {
                setRecipientName(user.full_name || user.username);
            }
        } else {
            document.body.style.overflow = 'unset';
            setCompletedOrder(null);
            setErrorMessage('');
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (items.length === 0) {
            setErrorMessage('Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi đặt hàng.');
            return;
        }

        if (!recipientName.trim() || !phoneNumber.trim() || !shippingAddress.trim()) {
            setErrorMessage('Vui lòng điền đầy đủ Tên, Số điện thoại và Địa chỉ nhận hàng!');
            return;
        }

        try {
            setIsSubmitting(true);
            const orderPayload: OrderCreatePayload = {
                recipient_name: recipientName.trim(),
                phone_number: phoneNumber.trim(),
                shipping_address: shippingAddress.trim(),
                notes: notes.trim() || undefined,
                items: items.map((item) => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                })),
            };

            const order = await orderService.createOrder(orderPayload);
            clearCart();
            setCompletedOrder(order);
        } catch (err: any) {
            console.error('Lỗi khi đặt hàng:', err);
            setErrorMessage(getErrorMessage(err, 'Không thể tạo đơn hàng. Vui lòng thử lại!'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setCompletedOrder(null);
        setErrorMessage('');
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="modal-close-btn" title="Đóng">
                    <X size={20} />
                </button>
                {/* ================================================================= */}
                {/* TRƯỜNG HỢP 1: ĐÃ ĐẶT HÀNG THÀNH CÔNG 🎉 */}
                {/* ================================================================= */}
                {completedOrder ? (
                    <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                        <div style={{ color: 'var(--primary-600)', marginBottom: '16px' }}>
                            <CheckCircle size={64} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-800)', marginBottom: '8px' }}>
                            Đặt Hàng Thành Công!
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
                            Cảm ơn bạn đã tin tưởng lựa chọn phân bón dinh dưỡng của Boss Farm.
                        </p>
                        {/* Thẻ hóa đơn tóm tắt */}
                        <div className="card" style={{ backgroundColor: 'var(--bg-main)', textAlign: 'left', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Mã đơn hàng:</span>
                                <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>#{completedOrder.id.slice(0, 8)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Người nhận:</span>
                                <strong>{completedOrder.recipient_name} ({completedOrder.phone_number})</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Địa chỉ giao:</span>
                                <span style={{ maxWidth: '240px', textAlign: 'right' }}>{completedOrder.shipping_address}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-color)', marginTop: '8px' }}>
                                <span style={{ fontWeight: 700 }}>Tổng thanh toán (COD):</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                                    {Number(completedOrder.total_amount).toLocaleString('vi-VN')} đ
                                </span>
                            </div>
                        </div>
                        <button onClick={handleClose} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                            Tiếp Tục Mua Sắm
                        </button>
                    </div>
                ) : (
                    /* ================================================================= */
                    /* TRƯỜNG HỢP 2: FORM ĐIỀN THÔNG TIN ĐẶT HÀNG 📝 */
                    /* ================================================================= */
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <PackageCheck size={26} color="var(--primary-600)" />
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                Thông Tin Giao Hàng
                            </h2>
                        </div>
                        {errorMessage && (
                            <div className="alert-error" style={{ marginBottom: '16px' }}>
                                {errorMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmitOrder}>
                            {/* HỌ VÀ TÊN */}
                            <div className="form-group">
                                <label className="form-label">Họ và tên người nhận *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ví dụ: Nguyễn Văn Nông"
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    required
                                />
                            </div>
                            {/* SỐ ĐIỆN THOẠI */}
                            <div className="form-group">
                                <label className="form-label">Số điện thoại nhận hàng *</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="Ví dụ: 0912345678"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>
                            {/* ĐỊA CHỈ GIAO HÀNG */}
                            <div className="form-group">
                                <label className="form-label">Địa chỉ giao hàng (Thôn/Xã, Huyện, Tỉnh) *</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="Ví dụ: Ấp 2, Xã Tân Lập, Huyện Mộc Hóa, Long An"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    required
                                />
                            </div>
                            {/* GHI CHÚ */}
                            <div className="form-group">
                                <label className="form-label">Ghi chú cho nhà xe / tài xế</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ví dụ: Giao vào buổi sáng, gọi trước 15 phút..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                            {/* TỔNG TIỀN TÓM TẮT */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid var(--border-color)', margin: '16px 0' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Tổng thanh toán (COD khi nhận hàng):</span>
                                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                                    {totalAmount.toLocaleString('vi-VN')} đ
                                </span>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="spin-anim" />
                                        <span>Đang tạo đơn hàng...</span>
                                    </>
                                ) : (
                                    <>
                                        <Truck size={18} />
                                        <span>Xác Nhận Đặt Hàng</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};