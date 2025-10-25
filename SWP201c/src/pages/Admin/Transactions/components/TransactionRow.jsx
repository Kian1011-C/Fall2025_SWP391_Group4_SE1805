import React from 'react';

const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : '';
    const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'completed') return { ...style, background: '#166534', color: '#86efac' };
    if (s === 'initiated' || s === 'in_progress') return { ...style, background: '#1e40af', color: '#93c5fd' };
    if (s === 'cancelled' || s === 'failed') return { ...style, background: '#991b1b', color: '#fca5a5' };
    return { ...style, background: '#4b5563', color: '#e5e7eb' };
};

const TransactionRow = ({ transaction, onSelect }) => {
  return (
    <tr style={{ borderTop: '1px solid #374151' }}>
      <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>{transaction.swapId}</td>
      <td style={{ padding: '15px 20px' }}>{transaction.userId}</td>
      <td style={{ padding: '15px 20px' }}>{transaction.stationId}</td>
      <td style={{ padding: '15px 20px' }}><span style={getStatusStyle(transaction.swapStatus)}>{transaction.swapStatus}</span></td>
      <td style={{ padding: '15px 20px' }}>{new Date(transaction.swapDate).toLocaleString('vi-VN')}</td>
      <td style={{ padding: '15px 20px' }}>
        <button 
          onClick={() => onSelect(transaction)}
          style={{ background: '#374151', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
          Chi tiết
        </button>
      </td>
    </tr>
  );
};

export default TransactionRow;