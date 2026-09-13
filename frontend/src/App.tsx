import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { productService } from './services/product.service';
import type { Product } from './types/product.types';
import { Sparkles } from 'lucide-react';
import { ProductDetailModal } from './components/ProductDetailModal';


export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 1. Quản lý trạng thái Mở/Đóng của các Modal & Drawer
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 2. Tải sản phẩm từ Backend (có debounce khi gõ tìm kiếm)
  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const queryParams = searchTerm.trim()
          ? { search: searchTerm.trim(), limit: 20 }
          : { limit: 12 };
        const data = await productService.getProducts(queryParams);
        setProducts(data);
      } catch (error) {
        console.error('Không thể tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <AuthProvider>
      <CartProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* A. NAVBAR */}
          <Navbar
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* B. THÂN TRANG */}
          <main style={{ flex: 1, paddingBottom: '60px' }}>
            <section style={{ backgroundColor: 'var(--primary-800)', color: '#ffffff', padding: '50px 20px', textAlign: 'center', marginBottom: '40px' }}>
              <div className="container">
                <span className="badge badge-gold" style={{ marginBottom: '16px' }}>
                  <Sparkles size={14} /> Nông Nghiệp Công Nghệ Mới
                </span>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
                  Giải Pháp Dinh Dưỡng Toàn Diện Cho Cây Trồng
                </h1>
                <p style={{ fontSize: '1.05rem', color: 'var(--primary-100)', maxWidth: '650px', margin: '0 auto' }}>
                  Cung cấp các dòng phân bón NPK cao cấp, hữu cơ vi sinh giúp phục hồi đất, kích rễ khỏe và tăng năng suất vượt trội.
                </p>
              </div>
            </section>

            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Sản Phẩm Nổi Bật
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Các dòng phân bón được bà con tin dùng nhiều nhất vụ mùa này
                  </p>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Đang tải sản phẩm từ máy chủ Boss Farm...
                </div>
              ) : products.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                  {products.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      onSelect={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Chưa có sản phẩm nào trong cơ sở dữ liệu.
                </div>
              )}
            </div>
          </main>

          {/* C. FOOTER */}
          <Footer />

          {/* D. CÁC HỘP THOẠI POPUP & NGĂN KÉO */}
          {/* 1. Modal Đăng nhập / Đăng ký */}
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
          />

          {/* 2. Ngăn kéo Giỏ hàng trượt */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={() => {
              setIsCartOpen(false);       // Đóng giỏ hàng
              setIsCheckoutOpen(true);    // Mở popup Đặt hàng
            }}
          />

          {/* 3. Modal Đặt hàng & Xác nhận thanh toán */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />

          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)} // Đóng modal
          />

        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
