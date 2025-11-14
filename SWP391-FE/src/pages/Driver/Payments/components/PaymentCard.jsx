// Payment Card Component
import React from 'react';

const PaymentCard = ({ payment, onViewDetails, formatDate, formatCurrency, getStatusStyle }) => {
  const statusStyle = getStatusStyle(payment.status);
  
  //  Kiểm tra xem có payment_url và status = 'in_progress' hay không
  const canPay = payment.paymentUrl && payment.status === 'in_progress';

  const handlePaymentClick = (e) => {
    e.stopPropagation(); // Ngăn trigger onClick của card
    if (canPay) {
      // Chuyển hướng đến VNPay
      window.location.href = payment.paymentUrl;
    }
  };

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
            {payment.vnpOrderInfo || payment.description || payment.paymentFor || 'Thanh toán'}
          </div>
          <div style={{ 
            color: '#B0B0B0',
            fontSize: '0.9rem',
            marginBottom: '5px'
          }}>
             {formatDate(payment.createdAt || payment.date || payment.paymentDate)}
          </div>
          <div style={{ 
            color: '#B0B0B0',
            fontSize: '0.85rem',
            marginBottom: '5px'
          }}>
             Mã GD: {payment.transactionRef || 'N/A'}
          </div>
          {payment.method && (
            <div style={{ 
              color: '#B0B0B0',
              fontSize: '0.9rem'
            }}>
               {payment.method === 'QR' ? 'QR Code / VNPay' : payment.method}
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
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            {statusStyle.text}
          </span>
          
          {/*  Nút thanh toán nếu chưa thanh toán */}
          {canPay && (
            <button
              onClick={handlePaymentClick}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
               Thanh toán ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
