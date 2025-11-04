// src/pages/Driver/Payments/components/PaymentList.jsx
import React, { useMemo, useState } from 'react';

import PaymentCard from './PaymentCard';

const PaymentList = ({ payments, onViewDetails, formatDate, formatCurrency, getStatusStyle }) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = Array.isArray(payments) ? payments.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return (payments || []).slice(startIndex, endIndex);
  }, [payments, currentPage]);

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  return (
    <>
      <div style={{
        display: 'grid',
        gap: '15px'
      }}>
        {currentItems.map((payment, index) => (
          <PaymentCard
            key={payment.id || payment.payment_id || payment.paymentId || `${index}-${currentPage}`}
            payment={payment}
            onViewDetails={onViewDetails}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            getStatusStyle={getStatusStyle}
          />
        ))}
      </div>

      {/* Pagination controls styled purely by CSS classes added in payment.css */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className={`page-btn prev ${currentPage === 1 ? 'is-disabled' : ''}`}
            aria-disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            «
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                className={`page-btn ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            className={`page-btn next ${currentPage === totalPages ? 'is-disabled' : ''}`}
            aria-disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            »
          </button>
        </div>
      )}
    </>
  );
};

export default PaymentList;