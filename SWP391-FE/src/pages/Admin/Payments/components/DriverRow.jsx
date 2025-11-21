// components/DriverRow.jsx
import React from 'react';

const DriverRow = ({ driver, onGenerateInvoice, onViewHistory, activeTab }) => {
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

  return (
    <tr style={{
      borderBottom: '1px solid #e5e7eb',
      transition: 'background-color 0.2s'
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <td style={{ padding: '16px', fontSize: '14px' }}>
        <div>
          <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
            {driver.name}
          </div>
          {/* Chỉ hiện ID ở tab "Xuất hóa đơn" và "Chờ thanh toán", ẩn ở tab "Lịch sử" */}
          {activeTab !== 'history' && (
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              ID: {driver.id}
            </div>
          )}
        </div>
      </td>
      
      <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
        <div style={{ marginBottom: '2px' }}>{driver.email}</div>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>{driver.phone}</div>
      </td>
      
      <td style={{ padding: '16px', fontSize: '14px', textAlign: 'center' }}>
        <div style={{ marginBottom: '4px', fontWeight: '600', color: '#111827' }}>
          #{driver.contractId}
        </div>
        <span style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: driver.contractStatus === 'active' ? '#dcfce7' : 
                          driver.contractStatus === 'inactive' ? '#f3f4f6' : '#fee2e2',
          color: driver.contractStatus === 'active' ? '#166534' : 
                 driver.contractStatus === 'inactive' ? '#374151' : '#991b1b'
        }}>
          {driver.contractStatus === 'active' ? 'Hoạt động' : 
           driver.contractStatus === 'inactive' ? 'Không hoạt động' : 'Tạm ngưng'}
        </span>
      </td>
      
      <td style={{ padding: '16px', fontSize: '14px', textAlign: 'center' }}>
        {/* Hiển thị nhiều gói nếu user có nhiều contract */}
        {driver.subscriptionTypes ? (
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {driver.subscriptionTypes.map((type, index) => (
              <span key={index} style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: '500',
                backgroundColor: type === 'Premium' ? '#dbeafe' : '#f3f4f6',
                color: type === 'Premium' ? '#1e40af' : '#374151'
              }}>
                {type}
              </span>
            ))}
          </div>
        ) : (
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '500',
            backgroundColor: driver.subscriptionType === 'Premium' ? '#dbeafe' : '#f3f4f6',
            color: driver.subscriptionType === 'Premium' ? '#1e40af' : '#374151'
          }}>
            {driver.subscriptionType}
          </span>
        )}
      </td>
      
      {/* Chỉ hiện cột "Đã thanh toán" ở tab "Lịch sử" */}
      {activeTab === 'history' && (
        <td style={{ padding: '16px', fontSize: '14px', textAlign: 'right' }}>
          <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
            {formatCurrency(driver.totalPaid)}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {formatDate(driver.lastPaymentDate)}
          </div>
        </td>
      )}
      
      {activeTab === 'pending' && (
        <td style={{ padding: '16px', fontSize: '14px', textAlign: 'center' }}>
          {driver.unpaidBills > 0 ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              fontWeight: '600',
              fontSize: '13px'
            }}>
              {driver.unpaidBills}
            </span>
          ) : (
            <span style={{ color: '#10b981', fontWeight: '500' }}></span>
          )}
        </td>
      )}
      
      {activeTab !== 'pending' && (
        <td style={{ padding: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            {activeTab === 'generate' && (() => {
              // Check nếu contract bị tạm ngưng (suspended/SUSPENDED hoặc không phải active/ACTIVE)
              const isSuspended = driver.contractStatus !== 'active' && 
                                 driver.contractStatus !== 'ACTIVE' && 
                                 driver.contractStatus !== 'inactive' &&
                                 driver.contractStatus !== 'INACTIVE';
              
              return (
                <button
                  onClick={() => onGenerateInvoice(driver)}
                  disabled={isSuspended}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isSuspended ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: isSuspended ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: isSuspended ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isSuspended) {
                      e.target.style.backgroundColor = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSuspended) {
                      e.target.style.backgroundColor = '#3b82f6';
                    }
                  }}
                >
                  <span></span>
                  Xuất hóa đơn
                </button>
              );
            })()}
            
            {activeTab === 'history' && (
              <button
                onClick={() => onViewHistory(driver)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.borderColor = '#e5e7eb';
                }}
              >
                Lịch sử
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default DriverRow;
