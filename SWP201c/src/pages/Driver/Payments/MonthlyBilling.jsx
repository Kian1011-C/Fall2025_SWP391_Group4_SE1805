// src/pages/Driver/Payments/MonthlyBilling.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext.jsx';
import paymentService from '/src/assets/js/services/paymentService.js';

const MonthlyBilling = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // State cho form
  const [contractId, setContractId] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  
  // State cho bill info (sau khi tính toán)
  const [billInfo, setBillInfo] = useState(null);

  // Hàm xử lý thanh toán
  const handlePayMonthlyBill = async () => {
    if (!contractId) {
      setError('Vui lòng nhập mã hợp đồng');
      return;
    }

    if (!currentUser || !currentUser.id) {
      setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await paymentService.payMonthlyBillVNPay(
        currentUser.id,
        parseInt(contractId),
        year,
        month
      );

      if (result.success && result.payUrl) {
        setSuccess('Đang chuyển đến trang thanh toán VNPay...');
        setBillInfo(result.billInfo);
        
        // Chuyển hướng đến VNPay sau 1 giây
        setTimeout(() => {
          window.location.href = result.payUrl;
        }, 1000);
      } else {
        setError(result.message || 'Không thể tạo hóa đơn thanh toán');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Lỗi khi tạo hóa đơn thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 VND';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      padding: '24px' 
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => navigate('/driver/payments')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ← Quay lại
          </button>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2rem', 
            fontWeight: '700',
            margin: 0
          }}>
            Thanh toán hóa đơn tháng
          </h1>
          <p style={{ color: '#9ca3af', marginTop: '8px' }}>
            Nhập thông tin để xem và thanh toán hóa đơn tháng qua VNPay
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#86efac',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            ✓ {success}
          </div>
        )}

        {/* Form */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              color: '#e5e7eb', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Mã hợp đồng *
            </label>
            <input
              type="number"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
              placeholder="Nhập mã hợp đồng"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                color: '#e5e7eb', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Năm *
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min="2020"
                max="2030"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                color: '#e5e7eb', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Tháng *
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m} style={{ background: '#1f2937' }}>
                    Tháng {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handlePayMonthlyBill}
            disabled={loading || !contractId}
            style={{
              width: '100%',
              padding: '14px',
              background: loading || !contractId 
                ? 'rgba(59, 130, 246, 0.5)' 
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading || !contractId ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? '⏳ Đang xử lý...' : '💳 Thanh toán qua VNPay'}
          </button>
        </div>

        {/* Bill Info Display (nếu có) */}
        {billInfo && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '24px'
          }}>
            <h3 style={{ 
              color: '#93c5fd', 
              fontSize: '1.2rem', 
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              📊 Thông tin hóa đơn
            </h3>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {billInfo.totalKm !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Tổng quãng đường:</span>
                  <span style={{ color: '#fff', fontWeight: '600' }}>{billInfo.totalKm} km</span>
                </div>
              )}
              
              {billInfo.baseDistance && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Quãng đường cơ bản:</span>
                  <span style={{ color: '#fff', fontWeight: '600' }}>{billInfo.baseDistance} km</span>
                </div>
              )}
              
              {billInfo.overageKm !== undefined && billInfo.overageKm > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Vượt quá:</span>
                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>{billInfo.overageKm} km</span>
                </div>
              )}
              
              {billInfo.basePrice && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Giá cơ bản:</span>
                  <span style={{ color: '#fff', fontWeight: '600' }}>{formatCurrency(billInfo.basePrice)}</span>
                </div>
              )}
              
              {billInfo.overageFee !== undefined && billInfo.overageFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Phí vượt quá:</span>
                  <span style={{ color: '#fbbf24', fontWeight: '600' }}>{formatCurrency(billInfo.overageFee)}</span>
                </div>
              )}
              
              {billInfo.deposit_fee && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Phí đặt cọc:</span>
                  <span style={{ color: '#60a5fa', fontWeight: '600' }}>{formatCurrency(billInfo.deposit_fee)}</span>
                </div>
              )}
              
              {(billInfo.totalFee || billInfo.total_with_deposit) && (
                <>
                  <div style={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
                    margin: '8px 0' 
                  }} />
                  {billInfo.totalFee && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#fff', fontSize: '1rem', fontWeight: '600' }}>
                        Phí sử dụng tháng:
                      </span>
                      <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600' }}>
                        {formatCurrency(billInfo.totalFee)}
                      </span>
                    </div>
                  )}
                  {billInfo.total_with_deposit && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#22c55e', fontSize: '1.1rem', fontWeight: '700' }}>
                        Tổng thanh toán:
                      </span>
                      <span style={{ 
                        color: '#22c55e', 
                        fontSize: '1.4rem', 
                        fontWeight: '800' 
                      }}>
                        {formatCurrency(billInfo.total_with_deposit)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Info box */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '24px'
        }}>
          <p style={{ color: '#c7d2fe', margin: 0, fontSize: '0.9rem' }}>
            ℹ️ <strong>Lưu ý:</strong> Hệ thống sẽ tự động tính toán hóa đơn dựa trên 
            quãng đường đã đi trong tháng và tạo link thanh toán VNPay. 
            Sau khi thanh toán thành công, hợp đồng sẽ được cập nhật trạng thái.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBilling;
