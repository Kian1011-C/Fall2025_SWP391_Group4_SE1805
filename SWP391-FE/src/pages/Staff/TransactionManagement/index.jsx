// Staff/TransactionManagement/index.jsx  
// Lịch sử đổi Pin - Giao diện Staff với khả năng lọc và theo dõi

import React, { useState, useMemo } from 'react';
import { useTransactionsData } from './hooks/useTransactionsData';
import TransactionDetailModal from './components/TransactionDetailModal';

const getStatusBadge = (status) => {
  const s = status ? status.toUpperCase() : '';
  const baseStyle = { 
    padding: '6px 14px', 
    borderRadius: '20px', 
    fontSize: '12px', 
    fontWeight: '600', 
    display: 'inline-block' 
  };
  
  if (s === 'COMPLETED') return { ...baseStyle, background: '#166534', color: '#86efac' };
  if (s === 'INITIATED' || s === 'IN_PROGRESS') return { ...baseStyle, background: '#1e40af', color: '#93c5fd' };
  if (s === 'CANCELLED') return { ...baseStyle, background: '#854d0e', color: '#fde047' };
  if (s === 'FAILED') return { ...baseStyle, background: '#991b1b', color: '#fca5a5' };
  return { ...baseStyle, background: '#475569', color: '#cbd5e1' };
};

const TransactionRow = ({ transaction, onViewDetails }) => (
  <tr style={styles.row}>
    <td style={styles.cellId}>
      <div style={styles.idBadge}>#{transaction.swapId}</div>
    </td>
    <td style={styles.cell}>
      <div style={styles.infoBlock}>
         <span style={styles.label}>User #{transaction.userId}</span>
      </div>
    </td>
    <td style={styles.cell}>
      <div style={styles.infoBlock}>
         <span style={styles.label}>Station #{transaction.stationId}</span>
      </div>
    </td>
    <td style={styles.cell}>
      <div style={styles.batteryInfo}>
        <span style={{ color: '#ef4444' }}> #{transaction.oldBatteryId}</span>
        <span style={{ color: '#64748b', margin: '0 8px' }}>→</span>
        <span style={{ color: '#10b981' }}> #{transaction.newBatteryId}</span>
      </div>
    </td>
    <td style={styles.cell}>
      <span style={getStatusBadge(transaction.swapStatus)}>
        {transaction.swapStatus}
      </span>
    </td>
    <td style={styles.cell}>
      <div style={styles.datetime}>
        <div>{new Date(transaction.swapDate).toLocaleDateString('vi-VN')}</div>
        <div style={{ color: '#64748b', fontSize: '12px' }}>
          {new Date(transaction.swapDate).toLocaleTimeString('vi-VN')}
        </div>
      </div>
    </td>
    <td style={styles.cellAction}>
      <button onClick={() => onViewDetails(transaction)} style={styles.detailBtn}>
         Chi tiết
      </button>
    </td>
  </tr>
);

const StaffSwapHistory = () => {
  const { 
    transactions, 
    isLoading, 
    error, 
    refetch, 
    filterStatus, 
    setFilterStatus, 
    filterDate, 
    setFilterDate 
  } = useTransactionsData();
  
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Thống kê
  const stats = useMemo(() => {
    const completed = transactions.filter(t => t.swapStatus === 'COMPLETED').length;
    const initiated = transactions.filter(t => t.swapStatus === 'INITIATED').length;
    const total = transactions.length;
    
    return {
      total,
      completed,
      initiated,
      successRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
    };
  }, [transactions]);

  // Filter theo search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    
    const query = searchQuery.toLowerCase();
    return transactions.filter(tx => 
      tx.swapId.toString().includes(query) ||
      tx.userId.toString().includes(query) ||
      tx.stationId.toString().includes(query)
    );
  }, [transactions, searchQuery]);

  const renderStats = () => (
    <div style={styles.statsGrid}>
      <div style={styles.statCard}>
        <div style={styles.statIcon}></div>
        <div>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Tổng giao dịch</div>
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={{ ...styles.statIcon, background: 'rgba(16, 185, 129, 0.2)' }}></div>
        <div>
          <div style={{ ...styles.statValue, color: '#10b981' }}>{stats.completed}</div>
          <div style={styles.statLabel}>Hoàn thành</div>
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={{ ...styles.statIcon, background: 'rgba(59, 130, 246, 0.2)' }}>⏳</div>
        <div>
          <div style={{ ...styles.statValue, color: '#3b82f6' }}>{stats.initiated}</div>
          <div style={styles.statLabel}>Đang xử lý</div>
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={{ ...styles.statIcon, background: 'rgba(245, 158, 11, 0.2)' }}></div>
        <div>
          <div style={{ ...styles.statValue, color: '#f59e0b' }}>{stats.successRate}%</div>
          <div style={styles.statLabel}>Tỷ lệ thành công</div>
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div style={styles.filterContainer}>
      <input 
        type="text"
        placeholder=" Tìm kiếm theo mã GD, User ID, Station ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchInput}
      />

      <select 
        value={filterStatus} 
        onChange={(e) => setFilterStatus(e.target.value)} 
        style={styles.filterSelect}
      >
        <option value=""> Tất cả trạng thái</option>
        <option value="COMPLETED"> Hoàn thành</option>
        <option value="INITIATED">⏳ Đang xử lý</option>
        <option value="CANCELLED"> Đã hủy</option>
        <option value="FAILED"> Thất bại</option>
      </select>

      <input 
        type="date" 
        value={filterDate} 
        onChange={(e) => setFilterDate(e.target.value)} 
        style={styles.dateInput}
      />

      <button onClick={refetch} style={styles.refreshBtn}>
         Tải lại
      </button>
    </div>
  );

  // Pagination 8 per page
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil((filteredTransactions || []).length / itemsPerPage));
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return (filteredTransactions || []).slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={styles.centerMessage}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Đang tải lịch sử đổi pin...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}></div>
          <h3 style={styles.errorTitle}>Lỗi tải dữ liệu</h3>
          <p style={styles.errorMessage}>{error}</p>
          <button onClick={refetch} style={styles.retryBtn}> Thử lại</button>
        </div>
      );
    }

    if (filteredTransactions.length === 0) {
      return (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}></div>
          <h3 style={styles.emptyTitle}>Không tìm thấy giao dịch</h3>
          <p style={styles.emptyMessage}>
            {searchQuery ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có giao dịch nào'}
          </p>
        </div>
      );
    }

    return (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Mã GD</th>
              <th style={styles.th}>Tài xế</th>
              <th style={styles.th}>Trạm</th>
              <th style={styles.th}>Pin cũ → Pin mới</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={styles.th}>Thời gian</th>
              <th style={styles.th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(tx => (
              <TransactionRow 
                key={tx.swapId} 
                transaction={tx} 
                onViewDetails={setSelectedTransaction} 
              />
            ))}
          </tbody>
        </table>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={{ ...styles.pageBtn, ...(currentPage === 1 ? styles.pageBtnDisabled : {}) }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              «
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  style={{ ...styles.pageBtn, ...(isActive ? styles.pageBtnActive : {}) }}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
            <button
              style={{ ...styles.pageBtn, ...(currentPage === totalPages ? styles.pageBtnDisabled : {}) }}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}> Lịch sử đổi Pin</h1>
          <p style={styles.subtitle}>
            Theo dõi và quản lý lịch sử giao dịch đổi pin của khách hàng
          </p>
        </div>
      </div>

      {/* Stats */}
      {renderStats()}

      {/* Filters */}
      {renderFilters()}

      {/* Content */}
      {renderContent()}

      {/* Modal */}
      <TransactionDetailModal 
        transaction={selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
      />
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1600px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '30px'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '32px',
    fontWeight: '700',
    color: '#fff'
  },
  subtitle: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '15px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  statIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    background: 'rgba(59, 130, 246, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    lineHeight: 1
  },
  statLabel: {
    fontSize: '13px',
    color: '#94a3b8',
    marginTop: '5px'
  },
  filterContainer: {
    background: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '25px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: '1 1 300px',
    padding: '12px 16px',
    background: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px'
  },
  filterSelect: {
    padding: '12px 16px',
    background: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer'
  },
  dateInput: {
    padding: '12px 16px',
    background: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px'
  },
  refreshBtn: {
    padding: '12px 20px',
    background: '#10b981',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  tableContainer: {
    background: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px'
  },
  tableHeader: {
    background: '#1e293b'
  },
  th: {
    padding: '16px 20px',
    textAlign: 'left',
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  row: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
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
  infoBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  label: {
    color: '#fff',
    fontWeight: '500'
  },
  batteryInfo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '500'
  },
  datetime: {
    color: '#fff',
    fontSize: '13px'
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
    whiteSpace: 'nowrap'
  },
  centerMessage: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  loader: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  loadingText: {
    color: '#94a3b8'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '16px',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  errorTitle: {
    color: '#ef4444',
    fontSize: '24px',
    marginBottom: '10px'
  },
  errorMessage: {
    color: '#fca5a5',
    marginBottom: '20px'
  },
  retryBtn: {
    padding: '12px 24px',
    background: '#ef4444',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer'
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(30, 41, 59, 0.4)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  emptyTitle: {
    color: '#fff',
    fontSize: '24px',
    marginBottom: '10px'
  },
  emptyMessage: {
    color: '#94a3b8'
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '20px 0'
  },
  pageBtn: {
    minWidth: '44px',
    height: '44px',
    padding: '0 14px',
    borderRadius: '12px',
    border: '1px solid rgba(226,232,240,.6)',
    background: '#fff',
    color: '#0f172a',
    fontWeight: 700,
    fontSize: '16px',
    cursor: 'pointer'
  },
  pageBtnActive: {
    background: '#0b74e5',
    borderColor: '#0a66cc',
    color: '#fff'
  },
  pageBtnDisabled: {
    opacity: .5,
    cursor: 'not-allowed'
  }
};

export default StaffSwapHistory;