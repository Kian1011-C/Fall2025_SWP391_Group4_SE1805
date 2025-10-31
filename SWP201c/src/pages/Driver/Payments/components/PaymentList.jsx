// src/pages/Driver/Payments/components/PaymentList.jsx
import React from 'react';
import PaymentCard from './PaymentCard';

const PaymentList = ({ payments, onViewDetails, formatDate, formatCurrency, getStatusStyle }) => {
  return (
    <div style={{ 
      display: 'grid',
      gap: '15px'
    }}>
      {/* Lặp qua mảng payments và tạo một PaymentCard cho mỗi item */}
      {payments.map((payment, index) => (
        <PaymentCard
          key={payment.id || payment.payment_id || index} // Dùng key duy nhất
          payment={payment}
          onViewDetails={onViewDetails}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusStyle={getStatusStyle}
        />
      ))}
    </div>
  );
};

export default PaymentList;