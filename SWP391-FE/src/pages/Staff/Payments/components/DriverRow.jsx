// components/DriverRow.jsx (Staff - Read Only)
import React from 'react';

const DriverRow = ({ driver, onViewHistory }) => { //  Xóa onGenerateInvoice prop
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
          {/* Ẩn ID như tab "Lịch sử" của Admin */}
        </div>
      </td>
      
      <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
        <div style={{ marginBottom: '2px' }}>{driver.email}</div>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>{driver.phone}</div>
      </td>
      
      <td style={{ padding: '16px', fontSize: '14px', textAlign: 'center' }}>
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
      
      <td style={{ padding: '16px', fontSize: '14px', textAlign: 'right' }}>
        <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
          {formatCurrency(driver.totalPaid)}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {formatDate(driver.lastPaymentDate)}
        </div>
      </td>
      
      <td style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          {/*  Staff chỉ có nút xem lịch sử, không có nút xuất hóa đơn */}
          <button
            onClick={() => onViewHistory(driver)}
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
        
            Xem lịch sử
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DriverRow;
