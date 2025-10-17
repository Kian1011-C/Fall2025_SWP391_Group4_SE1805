// Driver/Payments/components/PaymentHistorySection.jsx
import React from 'react';
import PaymentList from './PaymentList';
import EmptyPayments from './EmptyPayments';
import ErrorDisplay from './ErrorDisplay';

const PaymentHistorySection = ({ 
  paymentHistory, 
  error, 
  onViewDetails,
  formatDate,
  formatCurrency,
  getStatusStyle
}) => {
  return (
    <div style={{ 
      background: 'rgba(26, 32, 44, 0.6)',
      backdropFilter: 'blur(10px)',
      padding: '25px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ 
        color: '#FFFFFF', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        📜 Lịch sử thanh toán
      </h3>

      {error ? (
        <ErrorDisplay error={error} />
      ) : paymentHistory.length > 0 ? (
        <PaymentList
          payments={paymentHistory}
          onViewDetails={onViewDetails}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusStyle={getStatusStyle}
        />
      ) : (
        <EmptyPayments />
      )}
    </div>
  );
};

export default PaymentHistorySection;
