import { Sprout, Phone, Mail, MapPin, ShieldCheck, Truck, Headphones } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="footer-wrap">
            {/* 1. THANH CAM KẾT DỊCH VỤ */}
            <div className="container" style={{ marginBottom: '40px' }}>
                <div className="features-banner">
                    <div className="feature-item">
                        <ShieldCheck size={28} className="feature-icon" />
                        <div>
                            <h4>100% Chính Hãng</h4>
                            <p>Phân bón chuẩn nhà máy, kiểm định nghiêm ngặt</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <Truck size={28} className="feature-icon" />
                        <div>
                            <h4>Giao Hàng Tận Vườn</h4>
                            <p>Vận chuyển nhanh chóng toàn quốc</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <Headphones size={28} className="feature-icon" />
                        <div>
                            <h4>Tư Vấn Kỹ Thuật 24/7</h4>
                            <p>Kỹ sư nông nghiệp đồng hành cùng bà con</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. NỘI DUNG CHÍNH CỦA FOOTER */}
            <div className="container footer-grid">
                {/* CỘT 1: THƯƠNG HIỆU */}
                <div>
                    <div className="brand-logo" style={{ color: '#ffffff', marginBottom: '16px' }}>
                        <div className="brand-icon-box" style={{ backgroundColor: 'var(--primary-600)', color: '#ffffff' }}>
                            <Sprout size={24} />
                        </div>
                        <span>Boss Farm</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--primary-100)', marginBottom: '20px' }}>
                        Đồng hành cùng nhà nông Việt Nam với các giải pháp phân bón công nghệ cao, nâng cao năng suất và cải tạo đất bền vững.
                    </p>
                </div>

                {/* CỘT 2: DANH MỤC */}
                <div>
                    <h4 className="footer-col-title">Sản Phẩm</h4>
                    <ul className="footer-links">
                        <li><a href="#npk">Phân bón NPK Cao Cấp</a></li>
                        <li><a href="#huuco">Phân bón Hữu Cơ Sinh Học</a></li>
                        <li><a href="#kichre">Dinh dưỡng Kích Rễ - Đâm Chồi</a></li>
                        <li><a href="#nuoitrai">Dưỡng Hoa - Nuôi Trái Lớn</a></li>
                    </ul>
                </div>

                {/* CỘT 3: HỖ TRỢ */}
                <div>
                    <h4 className="footer-col-title">Hỗ Trợ Bà Con</h4>
                    <ul className="footer-links">
                        <li><a href="#guide">Cẩm nang kỹ thuật canh tác</a></li>
                        <li><a href="#policy">Chính sách giao hàng & đổi trả</a></li>
                        <li><a href="#warranty">Cam kết chất lượng</a></li>
                        <li><a href="#contact">Liên hệ mở đại lý</a></li>
                    </ul>
                </div>

                {/* CỘT 4: LIÊN HỆ */}
                <div>
                    <h4 className="footer-col-title">Liên Hệ Trực Tiếp</h4>
                    <ul className="footer-links" style={{ gap: '12px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Phone size={16} style={{ color: 'var(--primary-400)' }} />
                            <span>Hotline: 0988.123.456</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail size={16} style={{ color: 'var(--primary-400)' }} />
                            <span>Email: support@bossfarm.vn</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <MapPin size={16} style={{ color: 'var(--primary-400)', marginTop: '4px' }} />
                            <span>Kho tổng: Cần Thơ & TP. Hồ Chí Minh</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* 3. BẢN QUYỀN */}
            <div className="container footer-bottom">
                <p>© {new Date().getFullYear()} Boss Farm - Nông Nghiệp Bền Vững. All rights reserved.</p>
            </div>
        </footer>
    );
};
