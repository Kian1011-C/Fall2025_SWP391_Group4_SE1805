// Driver/Payments/index.jsx
// Payments page (container inlined)
import React, { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { usePaymentsData, usePaymentModal, usePaymentProcess } from './hooks';
import { formatDate, formatCurrency, getStatusStyle } from './utils';
import {
  PaymentTabs,
  PaymentHistorySection,
  NewPaymentTab,
  PaymentDetailModal
} from './components';

/**
 * Payments Container Component
 * Manages payment history and new payments
 */
const PaymentsContainer = () => {
  const [activeTab, setActiveTab] = useState('history');

  // Fetch payment history
  const { paymentHistory, loading, error, refetch } = usePaymentsData();

  // Modal management
  const {
    showDetailModal,
    selectedPayment,
    openDetailModal,
    closeDetailModal
  } = usePaymentModal();

  // Payment processing
  const { processPayment } = usePaymentProcess(refetch);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="driver">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>
            ⏳ Đang tải...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#FFFFFF', 
            margin: '0 0 10px 0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            💳 Thanh toán
          </h1>
          <p style={{ color: '#B0B0B0', margin: 0 }}>
            Quản lý thanh toán và gói dịch vụ
          </p>
        </div>

        {/* Tabs */}
        <PaymentTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Payment History Tab */}
        {activeTab === 'history' && (
          <PaymentHistorySection
            paymentHistory={paymentHistory}
            error={error}
            onViewDetails={openDetailModal}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            getStatusStyle={getStatusStyle}
          />
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <NewPaymentTab onProcessPayment={processPayment} />
        )}

        {/* Payment Detail Modal */}
        <PaymentDetailModal
          show={showDetailModal}
          payment={selectedPayment}
          onClose={closeDetailModal}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusStyle={getStatusStyle}
        />
      </div>
    </DashboardLayout>
  );
};

export default PaymentsContainer;
