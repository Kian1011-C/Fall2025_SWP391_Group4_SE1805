import React from 'react';
import NavBar from '../component/NavBar';
import './HomePage.css';
// Images
import StationImg from '../../image/Tycorun-Manufacturer-Direct-Selling-Outdoor-Lithium-Battery-Charging-Swapping-Cabinet-EV-Bike-Battery-Swapping-Station-Photoroom.png';
import ChargingIcon from '../../image/simple-ev-charging-station-icon-vector.jpg';
import EnergyStorage from '../../image/battery-energy-storage-linear-style-600nw-2484430209.webp';

const HomePage = () => {
  return (
    <div className="homepage">
      <NavBar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Hệ sinh thái trạm đổi pin xe điện tối ưu
            </h1>
            <p className="hero-subtitle">
              Quản lý và giám sát các trạm đối pin xe điện một cách hiệu quả, hiện đại và chuyên nghiệp
            </p>
            <button className="cta-button" onClick={() => window.location.href = '/login'}>
              Log in to get started
            </button>
            <p className="cta-description">
              Truy cập đầy đủ tính năng quản lý trạm đổi pin
            </p>
          </div>
          <div className="hero-visual">
            <img
              src={StationImg}
              alt="Battery swapping station"
              className="hero-station-img"
              loading="lazy"
            />
                     
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How it work</h2>
          <p className="section-description">
            Khám phá cách hệ thống đổi pin EV giúp bạn luôn di chuyển chỉ với 3 bước đơn giản.
          </p>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-icon">
                <div className="icon-circle">
                  <div className="person-icon">👤</div>
                </div>
              </div>
              <h3 className="step-title">Create Account</h3>
              <p className="step-description">
                Tạo tài khoản để bắt đầu sử dụng dịch vụ đổi pin EV. Liên kết phương tiện và chọn gói dịch vụ phù hợp
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <div className="icon-circle">
                  <div className="station-icon">⛽</div>
                </div>
              </div>
              <h3 className="step-title">Find Station</h3>
              <p className="step-description">
                Dùng ứng dụng để định vị các trạm đổi pin gần bạn. Kiểm tra tình trạng pin và đặt lịch trước để đảm bảo có pin đầy
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <div className="icon-circle">
                  <div className="battery-icon">🔋</div>
                </div>
              </div>
              <h3 className="step-title">Swap & Go</h3>
              <p className="step-description">
                Chỉ cần đến trạm, quất mà đăng nhập, đổi pin trong vài phút và tiếp tục hành trình với pin đầy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-logo">
                <div className="logo-icon">EV</div>
                <span className="logo-text">EV Battery Swap</span>
              </div>
              <p className="footer-tagline">
                pháp đãi thông minh, thanh chăng và tiện lợi cho xe điện của bạn
              </p>
              <div className="social-icons">
                <div className="social-icon facebook">f</div>
                <div className="social-icon twitter">t</div>
                <div className="social-icon instagram">i</div>
                <div className="social-icon youtube">y</div>
              </div>
            </div>
            <div className="footer-center">
              <h4 className="footer-title">Usefull Link</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#book">Book a Swap</a></li>
                <li><a href="#plans">Plans & Pricing</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-right">
              <h4 className="footer-title">Contact Us</h4>
              <div className="contact-info">
                <p>📞 (128) 1234 9870</p>
                <p>✉️ support@evswap.com</p>
                <p>📍 HONGT / TP.HCM</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 EV Battery Swap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

