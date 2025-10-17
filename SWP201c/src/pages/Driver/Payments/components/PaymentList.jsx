// Payment List Component
import React from 'react';
import PaymentCard from './PaymentCard';

const PaymentList = ({ payments, onViewDetails, formatDate, formatCurrency, getStatusStyle }) => {
  return (
    <div style={{ 
      display: 'grid',
      gap: '15px'
    }}>
      {payments.map((payment, index) => (
        <PaymentCard
          key={payment.id || index}
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
