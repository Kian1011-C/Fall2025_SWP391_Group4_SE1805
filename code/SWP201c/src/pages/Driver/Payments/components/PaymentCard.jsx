// Payment Card Component
import React from 'react';

const PaymentCard = ({ payment, onViewDetails, formatDate, formatCurrency, getStatusStyle }) => {
  const statusStyle = getStatusStyle(payment.status);

  return (
    <div 
      style={{
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={() => onViewDetails(payment)}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ 
            color: '#FFFFFF', 
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            {payment.description || payment.paymentFor || 'Thanh toán'}
          </div>
          <div style={{ 
            color: '#B0B0B0',
            fontSize: '0.9rem',
            marginBottom: '5px'
          }}>
            🕒 {formatDate(payment.date || payment.paymentDate || payment.createdAt)}
          </div>
          {payment.paymentMethod && (
            <div style={{ 
              color: '#B0B0B0',
              fontSize: '0.9rem'
            }}>
              💳 {payment.paymentMethod === 'card' ? 'Thẻ' : 
                   payment.paymentMethod === 'cash' ? 'Tiền mặt' : 
                   payment.paymentMethod}
            </div>
          )}
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            color: '#19c37d',
            fontSize: '1.3rem',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            {formatCurrency(payment.amount)}
          </div>
          <span style={{
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: '600',
            background: statusStyle.background,
            color: statusStyle.color,
            display: 'inline-block'
          }}>
            {statusStyle.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
