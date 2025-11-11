// src/pages/Driver/Payments/components/PaymentHistorySection.jsx
import React from 'react';
import PaymentList from './PaymentList'; // 👈 Component này sẽ hiển thị danh sách
import EmptyPayments from './EmptyPayments'; // 👈 Component hiển thị khi không có dữ liệu
import ErrorDisplay from './ErrorDisplay'; // 👈 Component hiển thị khi có lỗi

// --- CSS (Bạn có thể tách ra file CSS riêng) ---
const sectionStyle = {
    background: 'rgba(26, 32, 44, 0.6)', // Tương đương bg-gray-800/60
    backdropFilter: 'blur(10px)',
    padding: '25px',
    borderRadius: '16px', // Tương đương rounded-2xl
    border: '1px solid rgba(255, 255, 255, 0.1)', // border-white/10
    color: '#E8EAF6', // Màu chữ sáng
};

const headerStyle = {
    color: '#FFFFFF',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.25rem', // 20px
    fontWeight: '600',
};
// --- Hết CSS ---

/**
 * Component này là vỏ bọc, chịu trách nhiệm hiển thị 1 trong 3 trạng thái:
 * 1. Lỗi (ErrorDisplay)
 * 2. Danh sách (PaymentList)
 * 3. Rỗng (EmptyPayments)
 */
const PaymentHistorySection = ({ 
  paymentHistory, 
  error, 
  onViewDetails,
  formatDate,
  formatCurrency,
  getStatusStyle
}) => {

  const renderContent = () => {
    // 1. Ưu tiên hiển thị lỗi nếu có
    if (error) {
      return <ErrorDisplay error={error} />;
    }
    
    // 2. Kiểm tra xem có dữ liệu lịch sử không
    if (Array.isArray(paymentHistory) && paymentHistory.length > 0) {
      return (
        <PaymentList
          payments={paymentHistory}
          onViewDetails={onViewDetails}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusStyle={getStatusStyle}
        />
      );
    }
    
    // 3. Nếu không lỗi và không có dữ liệu -> Hiển thị rỗng
    return <EmptyPayments />;
  };

  return (
    <div style={sectionStyle}>
      <h3 style={headerStyle}>
        📜 Lịch sử thanh toán
      </h3>
      {renderContent()}
    </div>
  );
};

export default PaymentHistorySection;