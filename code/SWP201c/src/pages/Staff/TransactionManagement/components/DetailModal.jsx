import React from 'react';

const DetailModal = ({ show, transaction, onClose, getStatusColor, getPaymentMethodColor, formatCurrency, formatDateTime }) => {
  if (!show || !transaction) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '30px', width: '700px', maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#2c3e50' }}>Chi tiết giao dịch</h3>
          <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '14px' }}>Mã giao dịch: {transaction.transactionId}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Khách hàng</label>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>{transaction.userName}</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#7f8c8d' }}>{transaction.userId}</p>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Trạng thái</label>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>
              <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: 'white', background: getStatusColor(transaction.status) }}>{transaction.status}</span>
            </p>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Trạm</label>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>{transaction.stationName}</p>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Pin</label>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>{transaction.batteryId}</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#7f8c8d' }}>{transaction.batteryCapacity}</p>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Thanh toán</label>
            <p style={{ margin: '5px 0', fontSize: '16px', color: getPaymentMethodColor(transaction.paymentMethod) }}>{transaction.paymentMethod}</p>
            {transaction.amount > 0 && (
              <p style={{ margin: 0, fontSize: '16px', color: '#19c37d', fontWeight: 'bold' }}>{formatCurrency(transaction.amount)}</p>
            )}
          </div>
          <div>
            <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Thời gian</label>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>{formatDateTime(transaction.timestamp)}</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#7f8c8d' }}>Thời gian xử lý: {transaction.duration}</p>
          </div>
        </div>
        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Thông tin pin</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Sức khỏe trước khi đổi</label>
              <p style={{ margin: '5px 0', fontSize: '16px', color: '#ff4757' }}>{transaction.batteryHealthBefore}%</p>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Sức khỏe sau khi đổi</label>
              <p style={{ margin: '5px 0', fontSize: '16px', color: '#19c37d' }}>{transaction.batteryHealthAfter ? `${transaction.batteryHealthAfter}%` : 'N/A'}</p>
            </div>
          </div>
        </div>
        {transaction.errorMessage && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#ffe6e6', borderRadius: '8px', border: '1px solid #ff4757' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#ff4757' }}>Lỗi</h4>
            <p style={{ margin: 0, color: '#ff4757' }}>{transaction.errorMessage}</p>
          </div>
        )}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: 'linear-gradient(135deg, #19c37d, #15a85a)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;


