// Main App Routes
// combine tất cả routes

import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DriverRoutes from './DriverRoutes';
import StaffRoutes from './StaffRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/driver/*" element={<DriverRoutes />} />
      <Route path="/staff/*" element={<StaffRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
};

// Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
        🔋 EV Battery Swap System
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '3rem', textAlign: 'center', opacity: 0.8 }}>
        Hệ thống đổi pin xe điện thông minh
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        maxWidth: '800px',
        width: '100%'
      }}>
        <button
          onClick={() => navigate('/staff/dashboard')}
          style={{
            background: 'linear-gradient(135deg, #19c37d, #16a085)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '2rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 32px rgba(25, 195, 125, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)';
            e.target.style.boxShadow = '0 12px 40px rgba(25, 195, 125, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 32px rgba(25, 195, 125, 0.3)';
          }}
        >
          👨‍💼 Staff Dashboard
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
            Quản lý trạm và hỗ trợ khách hàng
          </div>
        </button>
        
        <button
          onClick={() => navigate('/driver/dashboard')}
          style={{
            background: 'linear-gradient(135deg, #6ab7ff, #4a90e2)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '2rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 32px rgba(106, 183, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)';
            e.target.style.boxShadow = '0 12px 40px rgba(106, 183, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 32px rgba(106, 183, 255, 0.3)';
          }}
        >
          🚗 Driver Dashboard
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
            Tìm trạm và đổi pin
          </div>
        </button>
        
        <button
          onClick={() => navigate('/admin/dashboard')}
          style={{
            background: 'linear-gradient(135deg, #ffa500, #ff8c00)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '2rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 32px rgba(255, 165, 0, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)';
            e.target.style.boxShadow = '0 12px 40px rgba(255, 165, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 32px rgba(255, 165, 0, 0.3)';
          }}
        >
          👑 Admin Dashboard
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
            Quản lý hệ thống
          </div>
        </button>
      </div>
    </div>
  );
};

export default AppRoutes;