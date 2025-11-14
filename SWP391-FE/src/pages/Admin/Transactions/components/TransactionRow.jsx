// Admin/Transactions/components/TransactionRow.jsx
// Row component cho bảng lịch sử đổi pin

import React from 'react';

const getStatusStyle = (status) => {
  const s = status ? status.toUpperCase() : '';
  const baseStyle = { 
    padding: '6px 14px', 
    borderRadius: '20px', 
    fontSize: '12px', 
    fontWeight: '600', 
    display: 'inline-block',
    textAlign: 'center'
  };
  
  if (s === 'COMPLETED') return { ...baseStyle, background: '#166534', color: '#86efac' };
  if (s === 'INITIATED' || s === 'IN_PROGRESS') return { ...baseStyle, background: '#1e40af', color: '#93c5fd' };
  if (s === 'CANCELLED') return { ...baseStyle, background: '#854d0e', color: '#fde047' };
  if (s === 'FAILED') return { ...baseStyle, background: '#991b1b', color: '#fca5a5' };
  return { ...baseStyle, background: '#475569', color: '#cbd5e1' };
};

const TransactionRow = ({ transaction, onSelect }) => {
  return (
    <tr style={styles.row}>
      <td style={styles.cellId}>
        <div style={styles.idBadge}>#{transaction.swapId}</div>
      </td>
      
      <td style={styles.cell}>
        <div style={styles.userInfo}>
          <div style={styles.userIcon}></div>
          <div>
            <div style={styles.userId}>User #{transaction.userId}</div>
            <div style={styles.userName}>{transaction.userName || 'N/A'}</div>
          </div>
        </div>
      </td>
      
      <td style={styles.cell}>
        <div style={styles.stationInfo}>
          <div style={styles.stationIcon}></div>
          <div>
            <div style={styles.stationId}>Station #{transaction.stationId}</div>
            <div style={styles.stationName}>{transaction.stationName || 'N/A'}</div>
          </div>
        </div>
      </td>
      
      <td style={styles.cell}>
        <div style={styles.batterySwap}>
          <span style={styles.batteryOld}> #{transaction.oldBatteryId}</span>
          <span style={styles.arrow}>→</span>
          <span style={styles.batteryNew}> #{transaction.newBatteryId}</span>
        </div>
      </td>
      
      <td style={styles.cell}>
        <span style={getStatusStyle(transaction.swapStatus)}>
          {transaction.swapStatus}
        </span>
      </td>
      
      <td style={styles.cell}>
        <div style={styles.datetime}>
          <div style={styles.date}>
            {new Date(transaction.swapDate).toLocaleDateString('vi-VN')}
          </div>
          <div style={styles.time}>
            {new Date(transaction.swapDate).toLocaleTimeString('vi-VN')}
          </div>
        </div>
      </td>
      
      <td style={styles.cellAction}>
        <button 
          onClick={() => onSelect(transaction)}
          style={styles.detailBtn}
          onMouseEnter={(e) => e.target.style.background = '#475569'}
          onMouseLeave={(e) => e.target.style.background = '#334155'}
        >
           Chi tiết
        </button>
      </td>
    </tr>
  );
};

const styles = {
  row: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.2s ease'
  },
  cell: {
    padding: '16px 20px',
    color: '#e2e8f0',
    fontSize: '14px'
  },
  cellId: {
    padding: '16px 20px'
  },
  cellAction: {
    padding: '16px 20px',
    textAlign: 'center'
  },
  idBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    color: '#60a5fa',
    fontWeight: '700',
    fontFamily: 'monospace',
    fontSize: '14px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  userIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(25, 195, 125, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px'
  },
  userId: {
    color: '#fff',
    fontWeight: '600',
    fontSize: '13px'
  },
  userName: {
    color: '#94a3b8',
    fontSize: '12px',
    marginTop: '2px'
  },
  stationInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  stationIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(245, 158, 11, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px'
  },
  stationId: {
    color: '#fff',
    fontWeight: '600',
    fontSize: '13px'
  },
  stationName: {
    color: '#94a3b8',
    fontSize: '12px',
    marginTop: '2px'
  },
  batterySwap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px'
  },
  batteryOld: {
    color: '#ef4444',
    fontWeight: '500'
  },
  arrow: {
    color: '#94a3b8',
    fontSize: '16px'
  },
  batteryNew: {
    color: '#10b981',
    fontWeight: '500'
  },
  datetime: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  date: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500'
  },
  time: {
    color: '#94a3b8',
    fontSize: '12px'
  },
  detailBtn: {
    padding: '8px 16px',
    background: '#334155',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  }
};

export default TransactionRow;