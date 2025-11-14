// src/pages/Driver/Payments/PaymentReturn.jsx
// Trang xử lý kết quả thanh toán từ VNPay
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import paymentService from '/src/assets/js/services/paymentService.js';

const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Lấy query params từ URL
        const searchParams = new URLSearchParams(location.search);
        
        // Gọi API backend để verify
        const response = await paymentService.verifyVNPayReturn(searchParams);
        
        if (response.success) {
          setResult(response.payment);
        } else {
          setError(response.message || 'Xác thực thanh toán thất bại');
        }
      } catch (err) {
        console.error('Verify payment error:', err);
        setError('Lỗi khi xác thực thanh toán');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  const formatCurrency = (amount) => {
    if (!amount) return '0 VND';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '20px', fontWeight: '600' }}>Đang xác thực thanh toán...</div>
        </div>
      </div>
    );
  }

  const isSuccess = result?.status?.toLowerCase() === 'success' && result?.responseCode === '00';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '680px',
        margin: '40px auto',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          background: isSuccess 
            ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
            : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ fontSize: '48px' }}>
            {isSuccess ? '' : ''}
          </div>
          <div>
            <h1 style={{ 
              color: 'white', 
              margin: '0 0 8px 0', 
              fontSize: '24px', 
              fontWeight: '700' 
            }}>
              {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0, fontSize: '14px' }}>
              {result?.message || error || 'Vui lòng kiểm tra lại thông tin'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {result && (
            <>
              {/* Số tiền */}
              <div style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                  Số tiền thanh toán
                </div>
                <div style={{
                  color: '#19c37d',
                  fontSize: '32px',
                  fontWeight: '700'
                }}>
                  {formatCurrency(result.amount || 0)}
                </div>
              </div>

              {/* Chi tiết giao dịch */}
              <div style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '16px' 
                }}>
                  Chi tiết giao dịch
                </h3>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>Mã giao dịch:</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>
                      {result.txnRef || 'N/A'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>Mã phản hồi:</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>
                      {result.responseCode || 'N/A'}
                    </span>
                  </div>

                  {result.vnpBankCode && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af' }}>Ngân hàng:</span>
                      <span style={{ color: 'white', fontWeight: '600' }}>
                        {result.vnpBankCode}
                      </span>
                    </div>
                  )}

                  {result.vnpCardType && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af' }}>Loại thẻ:</span>
                      <span style={{ color: 'white', fontWeight: '600' }}>
                        {result.vnpCardType}
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>Thời gian:</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>
                      {formatDate(result.vnpPayDate || result.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {!isSuccess && (
                <div style={{
                  padding: '16px',
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <p style={{ color: '#fca5a5', margin: 0, fontSize: '14px' }}>
                     Nếu số tiền đã bị trừ nhưng giao dịch thất bại, vui lòng liên hệ bộ phận CSKH 
                    để được hỗ trợ. Mã giao dịch: <strong>{result.txnRef}</strong>
                  </p>
                </div>
              )}
            </>
          )}

          {/* Action buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/driver/payments')}
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Quay về Thanh toán
            </button>
            
            <button
              onClick={() => navigate('/driver/dashboard')}
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Về Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn;
