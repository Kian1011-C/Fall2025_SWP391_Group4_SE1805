// Driver Payment Management using API

import React, { useState, useEffect } from 'react';
import paymentService from '../../assets/js/services/paymentService';
import authService from '../../assets/js/services/authService';
import DashboardLayout from '../../layouts/DashboardLayout';

const DriverPayments = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        const result = await paymentService.getPaymentHistory(currentUser.id);
        
        if (result.success) {
          setPaymentHistory(result.data);
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('Không thể tải lịch sử thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (paymentData) => {
    try {
      const result = await paymentService.processPayment(paymentData);
      
      if (result.success) {
        alert('Thanh toán thành công!');
        fetchPaymentHistory();
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: '#FFFFFF' }}>Đang tải...</div>;
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px' }}>
        <h1 style={{ color: '#FFFFFF' }}>💳 Thanh toán</h1>
      <p style={{ color: '#E0E0E0' }}>Quản lý thanh toán và gói dịch vụ</p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'history' ? '#19c37d' : 'transparent',
            color: '#FFFFFF',
            border: '1px solid #19c37d',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📜 Lịch sử
        </button>
        <button
          onClick={() => setActiveTab('payment')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'payment' ? '#19c37d' : 'transparent',
            color: '#FFFFFF',
            border: '1px solid #19c37d',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          💰 Thanh toán
        </button>
      </div>

      {activeTab === 'history' && (
        <div style={{ marginTop: '30px', background: 'rgba(26, 32, 44, 0.8)', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ color: '#FFFFFF' }}>📜 Lịch sử thanh toán</h3>
          {error ? (
            <p style={{ color: '#ff6b6b' }}>Lỗi: {error}</p>
          ) : paymentHistory.length > 0 ? (
            <div style={{ marginTop: '20px' }}>
              {paymentHistory.map(payment => (
                <div key={payment.id} style={{
                  padding: '15px',
                  marginBottom: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px'
                }}>
                  <div style={{ color: '#FFFFFF' }}>
                    <strong>{payment.description}</strong>
                  </div>
                  <div style={{ color: '#19c37d', marginTop: '5px' }}>
                    {payment.amount} VND - {payment.date}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#E0E0E0', marginTop: '20px' }}>Chưa có giao dịch</p>
          )}
        </div>
      )}

      {activeTab === 'payment' && (
        <div style={{ marginTop: '30px', background: 'rgba(26, 32, 44, 0.8)', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ color: '#FFFFFF' }}>💰 Thanh toán mới</h3>
          <button
            onClick={() => handleProcessPayment({
              amount: 100000,
              userId: authService.getCurrentUser()?.id,
              paymentMethod: 'card'
            })}
            style={{
              padding: '15px 30px',
              marginTop: '20px',
              background: '#19c37d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Thanh toán 100,000đ
          </button>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default DriverPayments;