import React, { useState } from 'react';
// --- SỬA LỖI Ở ĐÂY: Thêm chữ 's' vào tên file ---
import { useTransactionsData } from './hooks/useTransactionsData';
import TransactionRow from './components/TransactionRow';
import TransactionDetailModal from './components/TransactionDetailModal';

const inputStyle = { background: '#374151', color: 'white', border: '1px solid #4b5563', padding: '10px 15px', borderRadius: '8px' };

const AdminTransactions = () => {
  const { 
    transactions, isLoading, error, refetch, 
    filterStatus, setFilterStatus, 
    searchQuery, setSearchQuery,
    dateRange, setDateRange
  } = useTransactionsData(); // Hook này giờ sẽ được import đúng
  
  const [selectedTx, setSelectedTx] = useState(null);

  const handleDateChange = (e) => {
    setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Đang tải lịch sử giao dịch...</p>;
    if (error) return ( <div style={{ color: '#ef4444', textAlign: 'center' }}><p>Lỗi: {error}</p><button onClick={refetch}>Thử lại</button></div> );
    if (transactions.length === 0) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Không tìm thấy giao dịch nào.</p>;

    return (
      <div style={{ background: '#1f2937', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#374151' }}>
              <th style={{ padding: '15px 20px' }}>Mã Giao dịch</th>
              <th style={{ padding: '15px 20px' }}>Tài xế ID</th>
              <th style={{ padding: '15px 20px' }}>Trạm ID</th>
              <th style={{ padding: '15px 20px' }}>Trạng thái</th>
              <th style={{ padding: '15px 20px' }}>Thời gian</th>
              <th style={{ padding: '15px 20px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => <TransactionRow key={tx.swapId} transaction={tx} onSelect={setSelectedTx} />)}
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
            <p style={{ margin: '5px 0 0 0', color: '#9ca3af' }}>Xem và lọc toàn bộ giao dịch trong hệ thống.</p>
          </div>
        </div>
        
        {/* Thanh Filter */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <input 
            type="text"
            placeholder="Tìm theo ID Giao dịch, User ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={inputStyle}>
            <option value="">Tất cả trạng thái</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="INITIATED">Đang chờ</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="FAILED">Thất bại</option>
          </select>
          <input type="date" name="start" value={dateRange.start} onChange={handleDateChange} style={inputStyle} />
          <input type="date" name="end" value={dateRange.end} onChange={handleDateChange} style={inputStyle} />
        </div>

        {renderContent()}
      </div>
      
      <TransactionDetailModal 
        transaction={selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />
    </>
  );
};

export default AdminTransactions;