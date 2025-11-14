import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../assets/js/helpers/helpers';

const LandingPage = () => {
  const { setShowLoginModal, setShowRegisterModal } = useAuth();

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <div id="landing" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0b1020 0%, #0e1430 100%)' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(11, 16, 32, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="container">
          <nav className="nav" style={{ padding: '16px 0' }}>
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(168, 85, 247, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)',
                position: 'relative',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(168, 85, 247, 0.6), 0 0 40px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(168, 85, 247, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)';
              }}>
                <span style={{
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: '900',
                  fontFamily: 'sans-serif',
                  letterSpacing: '-1px',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>EV</span>
              </div>
              <span style={{
                background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '22px',
                fontWeight: '800',
                fontFamily: 'sans-serif',
                letterSpacing: '0.5px'
              }}>Battery SWAP</span>
            </div>
            <div className="nav-links" style={{ display: 'flex', gap: '32px' }}>
              <a href="#features" style={{
                color: '#e2e8f0',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                position: 'relative',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#a855f7';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}>Tính năng</a>
              <a href="#pricing" style={{
                color: '#e2e8f0',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                position: 'relative',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#a855f7';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}>Gói dịch vụ</a>
              <a href="#about" style={{
                color: '#e2e8f0',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                position: 'relative',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#a855f7';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}>Về chúng tôi</a>
            </div>
            <div className="auth-buttons" style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn" 
                onClick={handleLoginClick}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: '2px solid rgba(168, 85, 247, 0.3)',
                  background: 'transparent',
                  color: '#e2e8f0',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(168, 85, 247, 0.1)';
                  e.target.style.borderColor = '#a855f7';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                }}>Đăng nhập</button>
              <button 
                className="btn btn-primary" 
                onClick={handleRegisterClick}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.4)';
                }}>Đăng ký</button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="hero">
          <div className="container">
            <div className="eyebrow">
               Hệ thống đổi pin thông minh
            </div>
            <h1 className="title">
              Đổi pin xe điện <strong>nhanh chóng</strong><br/>
              và <strong>tiện lợi</strong>
            </h1>
            <p style={{ 
              color: 'var(--muted)', 
              maxWidth: '780px', 
              margin: '0 auto 22px', 
              fontSize: '16px',
              textAlign: 'center',
              width: '100%'
            }}>
              Giải pháp đổi pin tự động cho xe điện với mạng lưới trạm sạc rộng khắp thành phố. 
              Chỉ 3 phút để có pin đầy 100%.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={handleRegisterClick}>
                Bắt đầu ngay
              </button>
              <button className="btn" onClick={handleLoginClick}>
                Đăng nhập
              </button>
            </div>
          </div>
        </div>

        <section id="features">
          <div className="container">
            <h2>Tính năng nổi bật</h2>
            <div className="grid">
              <div className="card">
                <div className="icon"></div>
                <h3>Đổi pin siêu nhanh</h3>
                <p className="muted">Chỉ 3 phút để đổi pin, nhanh hơn việc đổ xăng truyền thống</p>
              </div>
              <div className="card">
                <div className="icon"></div>
                <h3>Mạng lưới rộng khắp</h3>
                <p className="muted">Hơn 50 trạm đổi pin trên toàn thành phố</p>
              </div>
              <div className="card featured">
                <div className="icon"></div>
                <h3>Ứng dụng thông minh</h3>
                <p className="muted">Theo dõi pin, tìm trạm, thanh toán tự động</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" style={{padding: '80px 0', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'}}>
          <div className="container">
            <div style={{textAlign: 'center', marginBottom: '60px'}}>
              <h2 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: 'white'}}>
                Gói dịch vụ đổi pin thông minh
              </h2>
              <p style={{fontSize: '20px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto'}}>
                Chọn gói phù hợp với nhu cầu sử dụng. Tính phí theo quãng đường thực tế.
              </p>
            </div>
            
            <div className="pricing" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {/* Eco Plan */}
              <div className="card" style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}>
                <div style={{marginBottom: '24px'}}>
                  <h3 style={{fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>Eco</h3>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>Tiết kiệm nhất</div>
                </div>
                <div style={{marginBottom: '24px'}}>
                  <div style={{fontSize: '48px', fontWeight: 'bold', color: '#10b981'}}>135,000₫</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '16px'}}>/tháng</div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px'}}>
                    Quãng đường cơ sở: 200 km
                  </div>
                </div>
                <ul style={{listStyle: 'none', padding: '0', marginBottom: '32px', textAlign: 'left'}}>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#10b981', marginRight: '12px', fontSize: '18px'}}></span>
                    200 km/tháng
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#10b981', marginRight: '12px', fontSize: '18px'}}></span>
                    Ứng dụng cơ bản
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#10b981', marginRight: '12px', fontSize: '18px'}}></span>
                    Hỗ trợ 24/7
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#ef4444', marginRight: '12px', fontSize: '18px'}}></span>
                    Phí vượt km nếu {'>'}200km
                  </li>
                </ul>
                <button 
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    handleLoginClick();
                    showToast('Vui lòng đăng nhập để chọn gói!', 'info');
                  }}
                >
                  Chọn gói Eco
                </button>
              </div>

              {/* Cơ bản Plan */}
              <div className="card" style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}>
                <div style={{marginBottom: '24px'}}>
                  <h3 style={{fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>Cơ bản</h3>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>Phù hợp gia đình</div>
                </div>
                <div style={{marginBottom: '24px'}}>
                  <div style={{fontSize: '48px', fontWeight: 'bold', color: '#3b82f6'}}>270,000₫</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '16px'}}>/tháng</div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px'}}>
                    Quãng đường cơ sở: 400 km
                  </div>
                </div>
                <ul style={{listStyle: 'none', padding: '0', marginBottom: '32px', textAlign: 'left'}}>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#3b82f6', marginRight: '12px', fontSize: '18px'}}></span>
                    400 km/tháng
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#3b82f6', marginRight: '12px', fontSize: '18px'}}></span>
                    Ứng dụng đầy đủ
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#3b82f6', marginRight: '12px', fontSize: '18px'}}></span>
                    Ưu tiên đổi pin
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#3b82f6', marginRight: '12px', fontSize: '18px'}}></span>
                    Hỗ trợ ưu tiên
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#ef4444', marginRight: '12px', fontSize: '18px'}}></span>
                    Phí vượt km nếu {'>'}400km
                  </li>
                </ul>
                <button 
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    handleLoginClick();
                    showToast('Vui lòng đăng nhập để chọn gói!', 'info');
                  }}
                >
                  Chọn gói Cơ bản
                </button>
              </div>

              {/* Plus Plan */}
              <div className="card featured" style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1))',
                border: '2px solid #a855f7',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                transform: 'scale(1.05)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
                  color: 'white',
                  padding: '6px 20px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  PHỔ BIẾN NHẤT
                </div>
                <div style={{marginBottom: '24px', marginTop: '16px'}}>
                  <h3 style={{fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>Plus</h3>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>Tối ưu hiệu quả</div>
                </div>
                <div style={{marginBottom: '24px'}}>
                  <div style={{fontSize: '48px', fontWeight: 'bold', color: '#a855f7'}}>400,000₫</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '16px'}}>/tháng</div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px'}}>
                    Quãng đường cơ sở: 600 km
                  </div>
                </div>
                <ul style={{listStyle: 'none', padding: '0', marginBottom: '32px', textAlign: 'left'}}>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#a855f7', marginRight: '12px', fontSize: '18px'}}></span>
                    600 km/tháng
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#a855f7', marginRight: '12px', fontSize: '18px'}}></span>
                    Ứng dụng đầy đủ
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#a855f7', marginRight: '12px', fontSize: '18px'}}></span>
                    Ưu tiên đổi pin
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#a855f7', marginRight: '12px', fontSize: '18px'}}></span>
                    Thông báo real-time
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#a855f7', marginRight: '12px', fontSize: '18px'}}></span>
                    Đặt trước trạm
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#ef4444', marginRight: '12px', fontSize: '18px'}}></span>
                    Phí vượt km nếu {'>'}600km
                  </li>
                </ul>
                <button 
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)'
                  }}
                  onClick={() => {
                    handleLoginClick();
                    showToast('Vui lòng đăng nhập để chọn gói!', 'info');
                  }}
                >
                  Chọn gói Plus
                </button>
              </div>

              {/* Premium Plan */}
              <div className="card" style={{
                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(202, 138, 4, 0.1))',
                border: '2px solid #eab308',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                  color: 'white',
                  padding: '6px 20px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  DOANH NGHIỆP
                </div>
                <div style={{marginBottom: '24px', marginTop: '16px'}}>
                  <h3 style={{fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>Premium</h3>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>Không giới hạn</div>
                </div>
                <div style={{marginBottom: '24px'}}>
                  <div style={{fontSize: '42px', fontWeight: 'bold', color: '#eab308'}}>3,000,000₫</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '16px'}}>/tháng</div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px'}}>
                    Quãng đường: Không giới hạn
                  </div>
                </div>
                <ul style={{listStyle: 'none', padding: '0', marginBottom: '32px', textAlign: 'left'}}>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}></span>
                    Không giới hạn km
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}></span>
                    Tính năng cao cấp
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}></span>
                    Đặt trước trạm đổi
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}></span>
                    Hỗ trợ VIP 24/7
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}></span>
                    Xe thay thế khẩn cấp
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}></span>
                    Không phí vượt km
                  </li>
                </ul>
                <button 
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    handleLoginClick();
                    showToast('Vui lòng đăng nhập để chọn gói!', 'info');
                  }}
                >
                  Chọn gói Premium
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section style={{padding: '80px 0', background: '#0f172a'}}>
          <div className="container">
            <div style={{textAlign: 'center', marginBottom: '60px'}}>
              <h2 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: 'white'}}>
                Mạng lưới trạm đổi pin toàn quốc
              </h2>
              <p style={{fontSize: '20px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto'}}>
                Hơn 500 trạm đổi pin trên toàn quốc, sẵn sàng phục vụ 24/7
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '40px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                height: '500px',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed rgba(255,255,255,0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{textAlign: 'center', zIndex: 2}}>
                  <div style={{fontSize: '64px', marginBottom: '20px'}}></div>
                  <h3 style={{color: 'white', marginBottom: '16px'}}>Bản đồ tương tác</h3>
                  <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: '24px'}}>
                    Tìm trạm đổi pin gần nhất với công nghệ GPS chính xác
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      handleLoginClick();
                      showToast('Đăng nhập để xem bản đồ chi tiết!', 'info');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Xem bản đồ đầy đủ
                  </button>
                </div>
                
                {/* Animated background elements */}
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: '15%',
                  width: '12px',
                  height: '12px',
                  background: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '60%',
                  left: '70%',
                  width: '12px',
                  height: '12px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite 0.5s'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '40%',
                  right: '20%',
                  width: '12px',
                  height: '12px',
                  background: '#a855f7',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite 1s'
                }}></div>
              </div>
              
              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                marginTop: '40px'
              }}>
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <div style={{fontSize: '36px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px'}}>
                    500+
                  </div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '16px'}}>
                    Trạm đổi pin
                  </div>
                </div>
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <div style={{fontSize: '36px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px'}}>
                    24/7
                  </div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '16px'}}>
                    Hoạt động liên tục
                  </div>
                </div>
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <div style={{fontSize: '36px', fontWeight: 'bold', color: '#a855f7', marginBottom: '8px'}}>
                    63
                  </div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '16px'}}>
                    Tỉnh thành
                  </div>
                </div>
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <div style={{fontSize: '36px', fontWeight: 'bold', color: '#eab308', marginBottom: '8px'}}>
                    {'<'}3min
                  </div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '16px'}}>
                    Thời gian đổi pin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{
        background: 'linear-gradient(180deg, #0a0f1e 0%, #050813 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '60px 0 30px',
        marginTop: '80px'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            {/* Brand Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
                }}>
                  <span style={{
                    color: '#000000',
                    fontSize: '16px',
                    fontWeight: '900',
                    fontFamily: 'sans-serif',
                    letterSpacing: '-1px'
                  }}>EV</span>
                </div>
                <span style={{
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: '700',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.5px'
                }}>Battery SWAP</span>
              </div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                lineHeight: '1.6',
                marginBottom: '20px',
                maxWidth: '280px'
              }}>
                Giải pháp đổi pin tự động cho xe điện với mạng lưới trạm sạc rộng khắp. Đổi pin nhanh chóng, tiện lợi chỉ trong 3 phút.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="#" style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #a855f7, #3b82f6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <span style={{ fontSize: '18px' }}></span>
                </a>
                <a href="#" style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #a855f7, #3b82f6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <span style={{ fontSize: '18px' }}></span>
                </a>
                <a href="#" style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #a855f7, #3b82f6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <span style={{ fontSize: '18px' }}></span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '20px'
              }}>Liên kết nhanh</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '12px' }}>
                  <a href="#features" style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                    Tính năng
                  </a>
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <a href="#pricing" style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                    Gói dịch vụ
                  </a>
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <a href="#about" style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                    Về chúng tôi
                  </a>
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <a href="#" style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                    Hỗ trợ
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '20px'
              }}>Liên hệ</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '16px', marginTop: '2px' }}></span>
                  <span style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    123 Đường ABC, Quận XYZ,<br />TP. Hồ Chí Minh
                  </span>
                </li>
                <li style={{
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '16px' }}></span>
                  <a href="tel:+84901234567" style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                    090 123 4567
                  </a>
                </li>
                <li style={{
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '16px' }}></span>
                  <a href="mailto:evdriversystem@gmail.com" style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                   evdriversystem@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 style={{
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '20px'
              }}>Chính sách</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '12px' }}>
                  <a href="#" style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                    Điều khoản sử dụng
                  </a>
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <a href="#" style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                    Chính sách bảo mật
                  </a>
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <a href="#" style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                    Chính sách hoàn tiền
                  </a>
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <a href="#" style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                    Câu hỏi thường gặp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '30px',
            textAlign: 'center'
          }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px',
              margin: 0
            }}>
              © {new Date().getFullYear()} Battery SWAP. Tất cả các quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

