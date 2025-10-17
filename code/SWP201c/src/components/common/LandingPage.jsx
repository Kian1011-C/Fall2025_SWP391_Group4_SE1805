import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../assets/js/helpers/helpers';

const LandingPage = () => {
  const { setShowLoginModal, setShowRegisterModal } = useAuth();

  return (
    <div id="landing" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0b1020 0%, #0e1430 100%)' }}>
      <header>
        <div className="container">
          <nav className="nav">
            <div className="brand">
              <div className="logo">
                <svg viewBox="0 0 24 24">
                  <path d="M13 3l3.5 6L12 11.5 8.5 9 13 3zm4.5 9L16 14.5 12 17l-4-2.5 1.5-2.5 4.5 2.5L17.5 12zM12 19l-7.5-12L3 5l9 14 9-14-1.5 2L12 19z"/>
                </svg>
              </div>
              SWP201
            </div>
            <div className="nav-links">
              <a href="#features">Tính năng</a>
              <a href="#pricing">Gói dịch vụ</a>
              <a href="#about">Về chúng tôi</a>
            </div>
            <div className="auth-buttons">
              <button className="btn" onClick={() => setShowLoginModal(true)}>Đăng nhập</button>
              <button className="btn btn-primary" onClick={() => setShowRegisterModal(true)}>Đăng ký</button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="hero">
          <div className="container">
            <div className="eyebrow">⚡ Hệ thống đổi pin thông minh</div>
            <h1 className="title">Đổi pin xe điện <strong>nhanh chóng</strong><br/>và <strong>tiện lợi</strong></h1>
            <p className="subtitle">Giải pháp đổi pin tự động cho xe điện với mạng lưới trạm sạc rộng khắp thành phố. Chỉ 3 phút để có pin đầy 100%.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => setShowRegisterModal(true)}>Bắt đầu ngay</button>
              <button className="btn" onClick={() => setShowLoginModal(true)}>Đăng nhập</button>
            </div>
          </div>
        </div>

        <section id="features">
          <div className="container">
            <h2>Tính năng nổi bật</h2>
            <div className="grid">
              <div className="card"><div className="icon">⚡</div><h3>Đổi pin siêu nhanh</h3><p className="muted">Chỉ 3 phút để đổi pin, nhanh hơn việc đổ xăng truyền thống</p></div>
              <div className="card"><div className="icon">📍</div><h3>Mạng lưới rộng khắp</h3><p className="muted">Hơn 50 trạm đổi pin trên toàn thành phố</p></div>
              <div className="card featured"><div className="icon">📱</div><h3>Ứng dụng thông minh</h3><p className="muted">Theo dõi pin, tìm trạm, thanh toán tự động</p></div>
            </div>
          </div>
        </section>

        <section id="pricing" style={{padding: '80px 0', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'}}>
          <div className="container">
            <div style={{textAlign: 'center', marginBottom: '60px'}}>
              <h2 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: 'white'}}>Gói dịch vụ đổi pin thông minh</h2>
              <p style={{fontSize: '20px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto'}}>Chọn gói phù hợp với nhu cầu sử dụng. Tính phí theo quãng đường thực tế.</p>
            </div>
            {/* phần nội dung còn lại giữ nguyên như trước */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;


