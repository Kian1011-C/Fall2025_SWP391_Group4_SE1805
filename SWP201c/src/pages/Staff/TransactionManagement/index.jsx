import React, { useState } from 'react';
import { useTransactionsData } from './hooks/useTransactionsData';
import TransactionDetailModal from './components/TransactionDetailModal';

const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : '';
    const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'completed') return { ...style, background: '#166534', color: '#86efac' };
    if (s === 'initiated' || s === 'in_progress') return { ...style, background: '#1e40af', color: '#93c5fd' };
    if (s === 'cancelled' || s === 'failed') return { ...style, background: '#991b1b', color: '#fca5a5' };
    return { ...style, background: '#475569', color: '#cbd5e1' };
};

const TransactionRow = ({ transaction, onViewDetails }) => (
  <tr style={{ borderTop: '1px solid #334155' }}>
    <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>{transaction.swapId}</td>
    <td style={{ padding: '15px 20px' }}>{transaction.userId}</td>
    <td style={{ padding: '15px 20px' }}>{transaction.stationId}</td>
    <td style={{ padding: '15px 20px' }}><span style={getStatusStyle(transaction.swapStatus)}>{transaction.swapStatus}</span></td>
    <td style={{ padding: '15px 20px' }}>{new Date(transaction.swapDate).toLocaleString('vi-VN')}</td>
    <td style={{ padding: '15px 20px' }}>
      <button onClick={() => onViewDetails(transaction)} style={{ background: '#334155', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
        Chi tiết
      </button>
    </td>
  </tr>
);

const StaffTransactionManagement = () => {
  const { transactions, isLoading, error, refetch, filterStatus, setFilterStatus, filterDate, setFilterDate } = useTransactionsData();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Đang tải lịch sử giao dịch...</p>;
    if (error) return ( <div style={{ color: '#ef4444', textAlign: 'center' }}><p>Lỗi: {error}</p><button onClick={refetch}>Thử lại</button></div> );
    if (transactions.length === 0) return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Không tìm thấy giao dịch nào.</p>;

    return (
      <div style={{ background: '#1e293b', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#334155' }}>
              <th style={{ padding: '15px 20px' }}>Mã Giao dịch</th>
              <th style={{ padding: '15px 20px' }}>Tài xế ID</th>
              <th style={{ padding: '15px 20px' }}>Trạm ID</th>
              <th style={{ padding: '15px 20px' }}>Trạng thái</th>
              <th style={{ padding: '15px 20px' }}>Thời gian</th>
              <th style={{ padding: '15px 20px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => <TransactionRow key={tx.swapId} transaction={tx} onViewDetails={setSelectedTransaction} />)}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>Quản lý Giao dịch</h1>
            <p style={{ margin: '5px 0 0 0', color: '#94a3b8' }}>Xem và lọc lịch sử đổi pin của khách hàng.</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ background: '#334155', color: 'white', border: '1px solid #475569', padding: '10px', borderRadius: '8px' }}>
              <option value="">Tất cả trạng thái</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="INITIATED">Đang chờ</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ background: '#334155', color: 'white', border: '1px solid #475569', padding: '8px', borderRadius: '8px' }} />
            <button onClick={refetch} style={{ background: '#334155', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>🔄 Tải lại</button>
          </div>
        </div>
        {renderContent()}
      </div>
      <TransactionDetailModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
    </>
  );
};

export default StaffTransactionManagement;