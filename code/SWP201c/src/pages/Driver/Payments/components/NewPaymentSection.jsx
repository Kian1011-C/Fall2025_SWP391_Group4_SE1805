// New Payment Section Component
import React from 'react';
import authService from '../../../../assets/js/services/authService';

const NewPaymentSection = ({ onProcessPayment }) => {
  return (
    <div style={{
      padding: '30px',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚧</div>
      <h4 style={{ color: '#FFFFFF', marginBottom: '10px' }}>
        Tính năng đang phát triển
      </h4>
      <p style={{ color: '#B0B0B0', marginBottom: '25px' }}>
        Tích hợp cổng thanh toán đang được hoàn thiện
      </p>
      
      {/* Demo Payment Button */}
      <button
        onClick={() => onProcessPayment({
          amount: 100000,
          userId: authService.getCurrentUser()?.id,
          paymentMethod: 'card',
          description: 'Thanh toán demo'
        })}
        style={{
          padding: '15px 30px',
          background: 'linear-gradient(135deg, #19c37d, #15a36a)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(25, 195, 125, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(25, 195, 125, 0.3)';
        }}
      >
        💳 Thanh toán demo 100,000đ
      </button>
    </div>
  );
};

export default NewPaymentSection;
