// Payment History Component
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentHistory = ({ payments }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ 
        color: '#FFFFFF', 
        marginBottom: '20px',
        fontSize: '1.3rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
         Lịch sử thanh toán gần đây
      </h3>
      
      {payments.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {payments.map((payment, index) => (
            <div
              key={payment.paymentId || payment.id || index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '5px' }}>
                   Thanh toán {payment.method || 'N/A'}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
                  {payment.processedAt ? new Date(payment.processedAt).toLocaleString('vi-VN') : 'N/A'}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.7rem', marginTop: '2px' }}>
                  ID: {payment.transactionId || payment.paymentId || 'N/A'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  background: payment.status === 'success' ? 'rgba(25, 195, 125, 0.2)' : 
                             payment.status === 'pending' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                  color: payment.status === 'success' ? '#19c37d' : 
                         payment.status === 'pending' ? '#ffa500' : '#ff6b6b',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '5px'
                }}>
                  {payment.status === 'success' ? ' Thành công' : 
                   payment.status === 'pending' ? '⏳ Đang xử lý' : ' Thất bại'}
                </div>
                <div style={{ color: '#19c37d', fontSize: '0.9rem', fontWeight: '600' }}>
                  {payment.amount ? `${payment.amount.toLocaleString()} ${payment.currency || 'VND'}` : 'N/A'}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.7rem' }}>
                  {payment.method || 'N/A'}
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/driver/payments')}
            style={{
              background: 'rgba(25, 195, 125, 0.1)',
              border: '1px solid rgba(25, 195, 125, 0.3)',
              borderRadius: '8px',
              padding: '10px',
              color: '#19c37d',
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginTop: '10px'
            }}
          >
             Xem tất cả lịch sử
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px',
          textAlign: 'center',
          padding: '40px',
          color: '#B0B0B0'
        }}>
          <div style={{ fontSize: '3rem' }}></div>
          <div>Chưa có lịch sử thanh toán nào</div>
          <button
            onClick={() => navigate('/driver/subscriptions')}
            style={{
              background: 'linear-gradient(135deg, #9c88ff, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '10px'
            }}
          >
             Xem gói dịch vụ
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
