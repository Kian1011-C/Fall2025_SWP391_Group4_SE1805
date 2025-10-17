// Payment Detail Modal Component
import React from 'react';

const PaymentDetailModal = ({ 
  show, 
  payment, 
  onClose, 
  formatDate, 
  formatCurrency, 
  getStatusStyle 
}) => {
  if (!show || !payment) return null;

  const statusStyle = getStatusStyle(payment.status);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#1a202c',
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '600px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '25px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '15px'
        }}>
          <h2 style={{ color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            💳 Chi tiết thanh toán
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#B0B0B0',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px 10px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Payment Icon & Amount */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>💰</div>
          <div style={{ 
            color: '#19c37d',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '10px'
          }}>
            {formatCurrency(payment.amount)}
          </div>
          <span style={{
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: '600',
            background: statusStyle.background,
            color: statusStyle.color,
            display: 'inline-block'
          }}>
            {statusStyle.text}
          </span>
        </div>

        {/* Payment Details */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#19c37d', marginBottom: '15px' }}>📋 Thông tin giao dịch</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#B0B0B0' }}>Mã giao dịch:</span>
              <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
                #{payment.id || payment.transactionId || 'N/A'}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#B0B0B0' }}>Mô tả:</span>
              <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
                {payment.description || payment.paymentFor || 'Thanh toán'}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#B0B0B0' }}>Ngày giờ:</span>
              <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
                {formatDate(payment.date || payment.paymentDate || payment.createdAt)}
              </span>
            </div>
            
            {payment.paymentMethod && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#B0B0B0' }}>Phương thức:</span>
                <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
                  {payment.paymentMethod === 'card' ? '💳 Thẻ' : 
                   payment.paymentMethod === 'cash' ? '💵 Tiền mặt' : 
                   payment.paymentMethod === 'bank_transfer' ? '🏦 Chuyển khoản' :
                   payment.paymentMethod}
                </span>
              </div>
            )}
            
            {payment.contractNumber && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#B0B0B0' }}>Hợp đồng:</span>
                <span style={{ color: '#9c88ff', fontWeight: '600' }}>
                  {payment.contractNumber}
                </span>
              </div>
            )}
            
            {payment.vehiclePlate && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#B0B0B0' }}>Biển số xe:</span>
                <span style={{ color: '#6ab7ff', fontWeight: '600' }}>
                  {payment.vehiclePlate}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {(payment.notes || payment.reference) && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#19c37d', marginBottom: '15px' }}>📝 Ghi chú</h4>
            <p style={{ color: '#B0B0B0', margin: 0, lineHeight: '1.6' }}>
              {payment.notes || payment.reference}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '25px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Đóng
          </button>
          <button
            onClick={() => {
              alert('Tính năng in hóa đơn đang phát triển');
            }}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #19c37d, #15a36a)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
            }}
          >
            🖨️ In hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
