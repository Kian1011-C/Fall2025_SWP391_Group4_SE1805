// components/DriverRow.jsx
import React from 'react';

const DriverRow = ({ driver, onGenerateInvoice, onViewHistory, activeTab = 'need_invoice' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#6b7280';
      case 'suspended':
        return '#ef4444';
      default:
        return '#6b7280';
    }
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
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            ID: {driver.id}
          </div>
        </div>
      </td>
      
      <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
        <div style={{ marginBottom: '2px' }}>{driver.email}</div>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>{driver.phone}</div>
      </td>
      
      <td style={{ padding: '16px', fontSize: '14px', textAlign: 'center' }}>
        {activeTab === 'history' && driver.contracts ? (
          // Tab lịch sử: Hiển thị danh sách contracts
          <div style={{ fontSize: '12px' }}>
            {driver.contracts.map((contractId, idx) => (
              <div key={contractId} style={{ 
                marginBottom: idx < driver.contracts.length - 1 ? '4px' : '0',
                fontWeight: '500'
              }}>
                #{contractId}
              </div>
            ))}
          </div>
        ) : (
          // Tab khác: Hiển thị 1 contract và status
          <>
            <div style={{ marginBottom: '4px', fontWeight: '500' }}>
              #{driver.contractId}
            </div>
            <span style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: `${getStatusColor(driver.contractStatus)}20`,
              color: getStatusColor(driver.contractStatus)
            }}>
              {driver.contractStatus === 'active' ? 'Hoạt động' : 
               driver.contractStatus === 'inactive' ? 'Không hoạt động' : 'Tạm ngưng'}
            </span>
          </>
        )}
      </td>
      
      <td style={{ padding: '16px', fontSize: '14px', textAlign: 'center' }}>
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
      </td>
      
      <td style={{ padding: '16px', fontSize: '14px', textAlign: 'right' }}>
        <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
          {formatCurrency(driver.totalPaid)}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {formatDate(driver.lastPaymentDate)}
        </div>
      </td>
      
      {/* Chỉ hiển thị cột "Chưa TT" ở tab "Đợi thanh toán" */}
      {activeTab === 'waiting_payment' && (
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
            <span style={{ color: '#10b981', fontWeight: '500' }}>✓</span>
          )}
        </td>
      )}
      
      <td style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          {/* Tab 1: Chờ xuất hóa đơn - Chỉ hiển thị nút "Xuất hóa đơn" */}
          {activeTab === 'need_invoice' && (
            <button
              onClick={() => onGenerateInvoice(driver)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              <span>📄</span>
              Xuất hóa đơn
            </button>
          )}
          
          {/* Tab 2: Đợi thanh toán - Chỉ hiển thị nút "Xem lịch sử" */}
          {/* Tab 3: Lịch sử - Chỉ hiển thị nút "Xem lịch sử" */}
          {(activeTab === 'waiting_payment' || activeTab === 'history') && (
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
              <span>📋</span>
              Lịch sử
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default DriverRow;
