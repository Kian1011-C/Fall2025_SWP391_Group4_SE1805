import React from 'react';

const TransactionsTable = ({ data, getStatusColor, getPaymentMethodColor, formatCurrency, formatDateTime, onView }) => {
  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Mã GD</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Khách hàng</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Trạm</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>Pin</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>Trạng thái</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>Thanh toán</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>Thời gian</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map(transaction => (
            <tr key={transaction.id}>
              <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontWeight: 'bold', color: '#4f46e5' }}>{transaction.transactionId}</div>
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontWeight: 'bold', color: '#111827' }}>{transaction.userName}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{transaction.userId}</div>
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>{transaction.stationName}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{transaction.batteryId}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{transaction.batteryCapacity}</div>
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: 'white', background: getStatusColor(transaction.status) }}>
                  {transaction.status}
                </span>
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: getPaymentMethodColor(transaction.paymentMethod) }}>
                  {transaction.paymentMethod}
                </div>
                {transaction.amount > 0 && (
                  <div style={{ fontSize: '12px', color: '#19c37d', fontWeight: 'bold' }}>
                    {formatCurrency(transaction.amount)}
                  </div>
                )}
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6', textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
                <div>{formatDateTime(transaction.timestamp)}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{transaction.duration}</div>
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                <button onClick={() => onView(transaction)} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer' }}>
                  👁️ Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;


