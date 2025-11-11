// components/PaymentHistoryModal.jsx
import React, { useState, useEffect } from 'react';
import paymentService from '/src/assets/js/services/paymentService.js';

const PaymentHistoryModal = ({ driver, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, success, in_progress, failed

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Gọi API thực để lấy lịch sử thanh toán của user
        const result = await paymentService.adminGetUserPayments(driver.userId);
        
        if (result.success) {
          // Map dữ liệu từ backend sang format hiển thị
          const mappedHistory = (result.data || []).map(payment => ({
            id: payment.paymentId,
            // ✅ Chỉ có ngày thanh toán khi đã thanh toán thành công
            date: payment.status?.toLowerCase() === 'success' ? payment.vnpPayDate : null,
            month: extractMonthYear(payment.vnpOrderInfo || payment.createdAt),
            amount: payment.amount,
            status: mapStatus(payment.status),
            method: payment.method === 'QR' ? 'VNPay' : payment.method,
            transactionRef: payment.transactionRef,
            vnpTransactionNo: payment.vnpTransactionNo,
            vnpBankCode: payment.vnpBankCode,
            vnpCardType: payment.vnpCardType,
            vnpOrderInfo: payment.vnpOrderInfo,
            createdAt: payment.createdAt
          }));
          
          setHistory(mappedHistory);
        } else {
          throw new Error(result.message || 'Không thể tải lịch sử thanh toán');
        }
      } catch (err) {
        console.error('Error fetching payment history:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải lịch sử');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [driver.userId]);

  // ✅ Helper: Trích xuất tháng/năm từ orderInfo hoặc date
  const extractMonthYear = (text) => {
    if (!text) return 'N/A';
    // Nếu có text như "Thanh toan hop dong 1" thì lấy từ date
    const date = new Date(text);
    if (!isNaN(date.getTime())) {
      return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }
    return 'N/A';
  };

  // ✅ Map status từ backend
  const mapStatus = (status) => {
    const s = status?.toLowerCase();
    if (s === 'success') return 'paid';
    if (s === 'in_progress') return 'pending';
    if (s === 'failed') return 'failed';
    return 'unknown';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'paid':
        return { label: 'Đã thanh toán', color: '#10b981', bg: '#d1fae5' };
      case 'pending':
        return { label: 'Chưa thanh toán', color: '#f59e0b', bg: '#fef3c7' };
      case 'failed':
        return { label: 'Thất bại', color: '#ef4444', bg: '#fee2e2' };
      default:
        return { label: 'Không xác định', color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const totalPaid = history
    .filter(item => item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPending = history
    .filter(item => item.status === 'pending')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#111827' }}>
              Lịch sử thanh toán
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
              Khách hàng: {driver.name} • Contract: {driver.contractId} • Plan: {driver.subscriptionType}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{
          padding: '20px 24px',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Tổng đã thanh toán
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                {formatCurrency(totalPaid)}
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Chưa thanh toán
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>
                {formatCurrency(totalPending)}
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Tổng giao dịch
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                {history.length}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          gap: '8px'
        }}>
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'paid', label: 'Đã thanh toán' },
            { value: 'pending', label: 'Chưa thanh toán' },
            { value: 'failed', label: 'Thất bại' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === tab.value ? '#3b82f6' : 'white',
                color: filter === tab.value ? 'white' : '#6b7280',
                border: `1px solid ${filter === tab.value ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* History List */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Đang tải...
            </div>
          ) : filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Không có dữ liệu
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {filteredHistory.map(item => {
                const statusInfo = getStatusInfo(item.status);
                return (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: 'white',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '600', fontSize: '15px', color: '#111827' }}>
                            Tháng {item.month}
                          </span>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: statusInfo.bg,
                            color: statusInfo.color
                          }}>
                            {statusInfo.label}
                          </span>
                        </div>
                        
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          <div>
                            <span>Phương thức: </span>
                            <span style={{ fontWeight: '500', color: '#374151' }}>{item.method || '-'}</span>
                          </div>
                        </div>
                        
                        {item.transactionRef && (
                          <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>
                            Mã GD: {item.transactionRef}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                          {formatCurrency(item.amount)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                          ID: {item.id}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryModal;
