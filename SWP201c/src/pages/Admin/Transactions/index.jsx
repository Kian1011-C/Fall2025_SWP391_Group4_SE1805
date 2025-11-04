// Admin/Transactions/index.jsx
// Lịch sử đổi Pin - Giao diện hiện đại với thống kê và filter đầy đủ

import React, { useState, useMemo } from 'react';
import { useTransactionsData } from './hooks/useTransactionsData';
import TransactionRow from './components/TransactionRow';
import TransactionDetailModal from './components/TransactionDetailModal';

const AdminSwapHistory = () => {
  const { 
    transactions, 
    isLoading, 
    error, 
    refetch, 
    filterStatus, 
    setFilterStatus, 
    searchQuery, 
    setSearchQuery,
    dateRange, 
    setDateRange
  } = useTransactionsData();
  
  const [selectedTx, setSelectedTx] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' hoặc 'cards'

  // Pagination 8 items per page
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil((transactions || []).length / itemsPerPage));
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return (transactions || []).slice(start, start + itemsPerPage);
  }, [transactions, currentPage]);

  // Thống kê
  const stats = useMemo(() => {
    const completed = transactions.filter(t => t.swapStatus === 'COMPLETED').length;
    const initiated = transactions.filter(t => t.swapStatus === 'INITIATED').length;
    const cancelled = transactions.filter(t => t.swapStatus === 'CANCELLED').length;
    const failed = transactions.filter(t => t.swapStatus === 'FAILED').length;
    
    return {
      total: transactions.length,
      completed,
      initiated,
      cancelled,
      failed,
      successRate: transactions.length > 0 ? ((completed / transactions.length) * 100).toFixed(1) : 0
    };
  }, [transactions]);

  const handleDateChange = (e) => {
    setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExport = () => {
    console.log('📥 Xuất dữ liệu:', transactions);
    alert('Chức năng xuất dữ liệu đang được phát triển');
  };

  const renderStats = () => (
    <div style={styles.statsGrid}>
      <div style={styles.statCard}>
        <div style={styles.statIcon}>📊</div>
        <div style={styles.statContent}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Tổng giao dịch</div>
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={{ ...styles.statIcon, background: 'rgba(25, 195, 125, 0.2)' }}>✅</div>
        <div style={styles.statContent}>
          <div style={{ ...styles.statValue, color: '#19c37d' }}>{stats.completed}</div>
          <div style={styles.statLabel}>Hoàn thành</div>
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={{ ...styles.statIcon, background: 'rgba(59, 130, 246, 0.2)' }}>⏳</div>
        <div style={styles.statContent}>
          <div style={{ ...styles.statValue, color: '#3b82f6' }}>{stats.initiated}</div>
          <div style={styles.statLabel}>Đang xử lý</div>
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={{ ...styles.statIcon, background: 'rgba(239, 68, 68, 0.2)' }}>❌</div>
        <div style={styles.statContent}>
          <div style={{ ...styles.statValue, color: '#ef4444' }}>{stats.cancelled + stats.failed}</div>
          <div style={styles.statLabel}>Thất bại/Hủy</div>
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={{ ...styles.statIcon, background: 'rgba(245, 158, 11, 0.2)' }}>📈</div>
        <div style={styles.statContent}>
          <div style={{ ...styles.statValue, color: '#f59e0b' }}>{stats.successRate}%</div>
          <div style={styles.statLabel}>Tỷ lệ thành công</div>
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div style={styles.filterContainer}>
      <div style={styles.filterRow}>
        <input 
          type="text"
          placeholder="🔍 Tìm kiếm theo mã GD, User ID, Trạm ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)} 
          style={styles.filterSelect}
        >
          <option value="">📋 Tất cả trạng thái</option>
          <option value="COMPLETED">✅ Hoàn thành</option>
          <option value="INITIATED">⏳ Đang xử lý</option>
          <option value="CANCELLED">🚫 Đã hủy</option>
          <option value="FAILED">❌ Thất bại</option>
        </select>

        <input 
          type="date" 
          name="start" 
          value={dateRange.start} 
          onChange={handleDateChange} 
          style={styles.dateInput}
          title="Từ ngày"
        />

        <input 
          type="date" 
          name="end" 
          value={dateRange.end} 
          onChange={handleDateChange} 
          style={styles.dateInput}
          title="Đến ngày"
        />

        <button onClick={refetch} style={styles.refreshBtn} title="Tải lại">
          🔄
        </button>

        <button onClick={handleExport} style={styles.exportBtn}>
          📥 Xuất Excel
        </button>
      </div>

      <div style={styles.viewModeToggle}>
        <button 
          onClick={() => setViewMode('table')}
          style={{
            ...styles.viewModeBtn,
            background: viewMode === 'table' ? '#3b82f6' : 'transparent'
          }}
        >
          📊 Bảng
        </button>
        <button 
          onClick={() => setViewMode('cards')}
          style={{
            ...styles.viewModeBtn,
            background: viewMode === 'cards' ? '#3b82f6' : 'transparent'
          }}
        >
          🗂️ Thẻ
        </button>
      </div>
    </div>
  );

  const renderTable = () => (
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
              onSelect={setSelectedTx} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCards = () => (
    <div style={styles.cardsGrid}>
      {currentItems.map(tx => (
        <div key={tx.swapId} style={styles.card} onClick={() => setSelectedTx(tx)}>
          <div style={styles.cardHeader}>
            <div style={styles.cardId}>#{tx.swapId}</div>
            <div style={getStatusBadge(tx.swapStatus)}>{tx.swapStatus}</div>
          </div>
          
          <div style={styles.cardBody}>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>👤 Tài xế:</span>
              <span style={styles.cardValue}>User #{tx.userId}</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>🏢 Trạm:</span>
              <span style={styles.cardValue}>Station #{tx.stationId}</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>🔋 Pin:</span>
              <span style={styles.cardValue}>#{tx.oldBatteryId} → #{tx.newBatteryId}</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>⏰ Thời gian:</span>
              <span style={styles.cardValue}>
                {new Date(tx.swapDate).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Lỗi tải dữ liệu</h3>
          <p style={styles.errorMessage}>{error}</p>
          <button onClick={refetch} style={styles.retryBtn}>🔄 Thử lại</button>
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={styles.emptyTitle}>Không có giao dịch</h3>
          <p style={styles.emptyMessage}>
            Chưa có lịch sử đổi pin nào trong hệ thống
          </p>
        </div>
      );
    }

    return viewMode === 'table' ? renderTable() : renderCards();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🔄 Lịch sử đổi Pin</h1>
          <p style={styles.subtitle}>
            Quản lý và theo dõi toàn bộ giao dịch đổi pin trong hệ thống
          </p>
        </div>
      </div>

      {/* Stats */}
      {renderStats()}

      {/* Filters */}
      {renderFilters()}

      {/* Content */}
      {renderContent()}

      {/* Pagination controls */}
      {transactions.length > 0 && (
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

      {/* Modal */}
      <TransactionDetailModal 
        transaction={selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />
    </div>
  );
};

const getStatusBadge = (status) => {
  const baseStyle = {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  };

  if (status === 'COMPLETED') {
    return { ...baseStyle, background: '#166534', color: '#86efac' };
  }
  if (status === 'INITIATED') {
    return { ...baseStyle, background: '#1e40af', color: '#93c5fd' };
  }
  if (status === 'CANCELLED' || status === 'FAILED') {
    return { ...baseStyle, background: '#991b1b', color: '#fca5a5' };
  }
  return { ...baseStyle, background: '#475569', color: '#cbd5e1' };
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    alignItems: 'center',
    transition: 'all 0.3s ease',
    cursor: 'default'
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
  statContent: {
    flex: 1
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
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  filterRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '15px',
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
    padding: '12px 16px',
    background: '#334155',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  exportBtn: {
    padding: '12px 20px',
    background: '#10b981',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  viewModeToggle: {
    display: 'flex',
    gap: '8px'
  },
  viewModeBtn: {
    padding: '8px 16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s'
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
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  card: {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  cardId: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'monospace'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px'
  },
  cardLabel: {
    color: '#94a3b8'
  },
  cardValue: {
    color: '#fff',
    fontWeight: '500'
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
    color: '#94a3b8',
    fontSize: '16px'
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
    fontSize: '14px',
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

export default AdminSwapHistory;