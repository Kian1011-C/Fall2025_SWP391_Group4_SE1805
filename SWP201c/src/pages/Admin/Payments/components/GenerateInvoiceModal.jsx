// components/GenerateInvoiceModal.jsx
import React, { useState } from 'react';
import paymentService from '/src/assets/js/services/paymentService.js';

const GenerateInvoiceModal = ({ driver, onClose, onSuccess }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [billPreview, setBillPreview] = useState(null);

  // ✅ Tính toán và xem trước hóa đơn
  const handleCalculateBill = async () => {
    console.log('Generate invoice for driver:', driver);
    
    if (!driver.contractId) {
      setError('Không tìm thấy mã hợp đồng');
      return;
    }

    if (!driver.id) {
      setError('Không tìm thấy ID người dùng');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('✅ [Admin] Xuất hóa đơn:', {
        userId: driver.userId,
        contractId: driver.contractId,
        planName: driver.subscriptionType,
        year,
        month
      });

      // ✅ Gọi API backend để xuất hóa đơn (tạo payment pending)
      const result = await paymentService.adminGenerateMonthlyInvoice(
        driver.userId, // ✅ Dùng driver.userId thay vì driver.id
        driver.contractId,
        year,
        month
      );

      console.log('✅ [Admin] Kết quả xuất hóa đơn:', result);

      if (result.success && result.billInfo) {
        setBillPreview(result.billInfo);
        setSuccess('Hóa đơn đã được xuất thành công! Driver có thể thanh toán ngay.');
      } else {
        setError(result.message || 'Không thể xuất hóa đơn');
      }
    } catch (err) {
      console.error('Generate invoice error:', err);
      setError(`Có lỗi xảy ra khi xuất hóa đơn: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xác nhận và đóng modal
  const handleConfirm = () => {
    if (billPreview) {
      onSuccess(); // Refresh data
      onClose();
    } else {
      setError('Vui lòng tính toán hóa đơn trước');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 đ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

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
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
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
              Xuất hóa đơn thanh toán
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
              Khách hàng: {driver.name}
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

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Customer Info */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <div>
                <span style={{ color: '#6b7280' }}>Email:</span>
                <span style={{ marginLeft: '8px', fontWeight: '500' }}>{driver.email}</span>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>SĐT:</span>
                <span style={{ marginLeft: '8px', fontWeight: '500' }}>{driver.phone}</span>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>Hợp đồng:</span>
                <span style={{ marginLeft: '8px', fontWeight: '500' }}>#{driver.contractId}</span>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>Gói:</span>
                <span style={{ marginLeft: '8px', fontWeight: '500' }}>{driver.subscriptionType}</span>
              </div>
            </div>
          </div>

          {/* Period Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Kỳ thanh toán
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#6b7280' }}>
                  Năm
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  min="2020"
                  max="2030"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#6b7280' }}>
                  Tháng
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          {!billPreview && (
            <button
              onClick={handleCalculateBill}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                marginBottom: '16px'
              }}
            >
              {loading ? 'Đang tính toán...' : 'Tính toán hóa đơn'}
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              ✅ {success}
            </div>
          )}

          {/* Bill Preview */}
          {billPreview && (
            <div style={{
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                paddingBottom: '12px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Chi tiết hóa đơn tháng {month}/{year}
              </h3>
              
              <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Tổng quãng đường:</span>
                  <span style={{ fontWeight: '500' }}>{billPreview.totalKm} km</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Quãng đường cơ bản:</span>
                  <span style={{ fontWeight: '500' }}>{billPreview.baseDistance} km</span>
                </div>
                
                {billPreview.overageKm > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Vượt quá:</span>
                    <span style={{ fontWeight: '500', color: '#f59e0b' }}>{billPreview.overageKm} km</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Giá cơ bản:</span>
                  <span style={{ fontWeight: '500' }}>{formatCurrency(billPreview.basePrice)}</span>
                </div>
                
                {billPreview.overageFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Phí vượt quá:</span>
                    <span style={{ fontWeight: '500', color: '#f59e0b' }}>{formatCurrency(billPreview.overageFee)}</span>
                  </div>
                )}
                
                {billPreview.deposit_fee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Phí đặt cọc:</span>
                    <span style={{ fontWeight: '500', color: '#3b82f6' }}>{formatCurrency(billPreview.deposit_fee)}</span>
                  </div>
                )}
                
                <div style={{ 
                  borderTop: '1px solid #e5e7eb', 
                  paddingTop: '12px',
                  marginTop: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '500' }}>Phí sử dụng tháng:</span>
                    <span style={{ fontWeight: '600', fontSize: '15px' }}>{formatCurrency(billPreview.totalFee)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '700', fontSize: '16px', color: '#10b981' }}>Tổng thanh toán:</span>
                    <span style={{ fontWeight: '700', fontSize: '18px', color: '#10b981' }}>
                      {formatCurrency(billPreview.total_with_deposit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Hủy
          </button>
          
          {billPreview && (
            <button
              onClick={handleConfirm}
              style={{
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Xác nhận
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateInvoiceModal;
