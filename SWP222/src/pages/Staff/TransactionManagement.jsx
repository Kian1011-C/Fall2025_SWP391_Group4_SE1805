// Staff Transaction Management
// Display all battery swap and payment history

import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

// Temporary darkTheme object (darkTheme.js file not found)
const darkTheme = {
  colors: { primary: '#4f46e5', secondary: '#6b7280', text: '#1f2937' },
  components: {
    pageHeader: { marginBottom: '24px' },
    pageTitle: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' },
    pageSubtitle: { fontSize: '14px', color: '#6b7280', marginTop: '8px' },
    statsCard: { padding: '20px', borderRadius: '8px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    card: { padding: '20px', borderRadius: '8px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
  }
};
const buttonHoverEffects = (e) => { e.target.style.opacity = '0.8'; };
const buttonLeaveEffects = (e) => { e.target.style.opacity = '1'; };

const StaffTransactionManagement = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      transactionId: "TXN-001",
      userId: "driver1@example.com",
      userName: "Nguyễn Văn A",
      stationId: 1,
      stationName: "Trạm đổi pin Quận 1",
      batteryId: "BAT-001",
      batteryCapacity: "72V 45Ah",
      swapType: "Đổi pin",
      amount: 0,
      paymentMethod: "Gói dịch vụ",
      status: "Hoàn thành",
      timestamp: "2024-01-15 14:30:25",
      duration: "3 phút 45 giây",
      batteryHealthBefore: 25,
      batteryHealthAfter: 100
    },
    {
      id: 2,
      transactionId: "TXN-002",
      userId: "driver2@example.com",
      userName: "Trần Thị B",
      stationId: 3,
      stationName: "Trạm đổi pin Quận 7",
      batteryId: "BAT-004",
      batteryCapacity: "60V 50Ah",
      swapType: "Đổi pin",
      amount: 0,
      paymentMethod: "Gói dịch vụ",
      status: "Hoàn thành",
      timestamp: "2024-01-15 10:20:15",
      duration: "2 phút 30 giây",
      batteryHealthBefore: 15,
      batteryHealthAfter: 100
    },
    {
      id: 3,
      transactionId: "TXN-003",
      userId: "driver1@example.com",
      userName: "Nguyễn Văn A",
      stationId: 1,
      stationName: "Trạm đổi pin Quận 1",
      batteryId: "BAT-002",
      batteryCapacity: "60V 50Ah",
      swapType: "Đổi pin",
      amount: 0,
      paymentMethod: "Gói dịch vụ",
      status: "Hoàn thành",
      timestamp: "2024-01-14 16:45:30",
      duration: "4 phút 12 giây",
      batteryHealthBefore: 30,
      batteryHealthAfter: 100
    },
    {
      id: 4,
      transactionId: "TXN-004",
      userId: "driver3@example.com",
      userName: "Lê Văn C",
      stationId: 2,
      stationName: "Trạm đổi pin Quận 3",
      batteryId: "BAT-003",
      batteryCapacity: "48V 24Ah",
      swapType: "Đổi pin",
      amount: 50000,
      paymentMethod: "Thanh toán lẻ",
      status: "Hoàn thành",
      timestamp: "2024-01-10 09:15:45",
      duration: "5 phút 20 giây",
      batteryHealthBefore: 5,
      batteryHealthAfter: 100
    },
    {
      id: 5,
      transactionId: "TXN-005",
      userId: "driver2@example.com",
      userName: "Trần Thị B",
      stationId: 3,
      stationName: "Trạm đổi pin Quận 7",
      batteryId: "BAT-005",
      batteryCapacity: "60V 50Ah",
      swapType: "Đổi pin",
      amount: 0,
      paymentMethod: "Gói dịch vụ",
      status: "Đang xử lý",
      timestamp: "2024-01-15 18:30:10",
      duration: "Đang xử lý",
      batteryHealthBefore: 20,
      batteryHealthAfter: null
    },
    {
      id: 6,
      transactionId: "TXN-006",
      userId: "driver1@example.com",
      userName: "Nguyễn Văn A",
      stationId: 1,
      stationName: "Trạm đổi pin Quận 1",
      batteryId: "BAT-001",
      batteryCapacity: "72V 45Ah",
      swapType: "Đổi pin",
      amount: 0,
      paymentMethod: "Gói dịch vụ",
      status: "Thất bại",
      timestamp: "2024-01-12 11:20:30",
      duration: "1 phút 15 giây",
      batteryHealthBefore: 40,
      batteryHealthAfter: 40,
      errorMessage: "Lỗi kết nối với pin"
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterStation, setFilterStation] = useState('Tất cả');
  const [filterDate, setFilterDate] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const stations = [...new Set(transactions.map(t => t.stationName))];
  const statusOptions = ['Hoàn thành', 'Đang xử lý', 'Thất bại'];

  const filteredTransactions = transactions.filter(transaction => {
    const statusMatch = filterStatus === 'Tất cả' || transaction.status === filterStatus;
    const stationMatch = filterStation === 'Tất cả' || transaction.stationName === filterStation;
    const dateMatch = !filterDate || transaction.timestamp.startsWith(filterDate);
    return statusMatch && stationMatch && dateMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành': return '#19c37d';
      case 'Đang xử lý': return '#6ab7ff';
      case 'Thất bại': return '#ff4757';
      default: return '#6c757d';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Gói dịch vụ': return '#19c37d';
      case 'Thanh toán lẻ': return '#ffa500';
      case 'Thẻ tín dụng': return '#6ab7ff';
      case 'Ví điện tử': return '#9c88ff';
      default: return '#6c757d';
    }
  };

  const openDetailModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const getTransactionStats = () => {
    const stats = {
      total: transactions.length,
      completed: transactions.filter(t => t.status === 'Hoàn thành').length,
      processing: transactions.filter(t => t.status === 'Đang xử lý').length,
      failed: transactions.filter(t => t.status === 'Thất bại').length,
      totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0)
    };
    return stats;
  };

  const stats = getTransactionStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  return (
    <DashboardLayout role="staff">
      <div className="staff-transaction-management" style={{ padding: '20px' }}>
        <div className="page-header" style={darkTheme.components.pageHeader}>
        <h1 style={darkTheme.components.pageTitle}>💳 Quản lý giao dịch</h1>
        <p style={darkTheme.components.pageSubtitle}>Hiển thị danh sách toàn bộ lịch sử đổi pin và thanh toán</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={darkTheme.components.statsCard}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: darkTheme.colors.primary }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
            Tổng giao dịch
          </div>
        </div>
        <div style={darkTheme.components.statsCard}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d' }}>
            {stats.completed}
          </div>
          <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
            Hoàn thành
          </div>
        </div>
        <div style={darkTheme.components.statsCard}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff' }}>
            {stats.processing}
          </div>
          <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
            Đang xử lý
          </div>
        </div>
        <div style={darkTheme.components.statsCard}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4757' }}>
            {stats.failed}
          </div>
          <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
            Thất bại
          </div>
        </div>
        <div style={darkTheme.components.statsCard}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#19c37d' }}>
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
            Tổng doanh thu
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters" style={{ 
        ...darkTheme.components.card,
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={darkTheme.components.label}>Lọc theo trạng thái:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                border: darkTheme.components.input.border,
                borderRadius: '6px',
                fontSize: '14px',
                background: darkTheme.components.input.background,
                color: darkTheme.colors.primary
              }}
            >
              <option value="Tất cả">Tất cả</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={darkTheme.components.label}>Lọc theo trạm:</label>
            <select 
              value={filterStation}
              onChange={(e) => setFilterStation(e.target.value)}
              style={{
                padding: '8px 12px',
                border: darkTheme.components.input.border,
                borderRadius: '6px',
                fontSize: '14px',
                background: darkTheme.components.input.background,
                color: darkTheme.colors.primary
              }}
            >
              <option value="Tất cả">Tất cả</option>
              {stations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={darkTheme.components.label}>Lọc theo ngày:</label>
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{
                padding: '8px 12px',
                border: darkTheme.components.input.border,
                borderRadius: '6px',
                fontSize: '14px',
                background: darkTheme.components.input.background,
                color: darkTheme.colors.primary
              }}
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table" style={darkTheme.components.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: darkTheme.colors.borderLight }}>
            <tr>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'left' }}>Mã GD</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'left' }}>Khách hàng</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'left' }}>Trạm</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Pin</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Trạng thái</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Thanh toán</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Thời gian</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id} style={darkTheme.components.tableRow}>
                <td style={darkTheme.components.tableCell}>
                  <div style={{ fontWeight: 'bold', color: darkTheme.colors.primary }}>{transaction.transactionId}</div>
                </td>
                <td style={darkTheme.components.tableCell}>
                  <div style={{ fontWeight: 'bold', color: darkTheme.colors.primary }}>{transaction.userName}</div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.muted }}>{transaction.userId}</div>
                </td>
                <td style={darkTheme.components.tableCell}>{transaction.stationName}</td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.muted }}>{transaction.batteryId}</div>
                  <div style={{ fontSize: '11px', color: darkTheme.colors.muted }}>{transaction.batteryCapacity}</div>
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    background: getStatusColor(transaction.status)
                  }}>
                    {transaction.status}
                  </span>
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: getPaymentMethodColor(transaction.paymentMethod) }}>
                    {transaction.paymentMethod}
                  </div>
                  {transaction.amount > 0 && (
                    <div style={{ fontSize: '12px', color: '#19c37d', fontWeight: 'bold' }}>
                      {formatCurrency(transaction.amount)}
                    </div>
                  )}
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center', color: darkTheme.colors.muted, fontSize: '12px' }}>
                  <div>{formatDateTime(transaction.timestamp)}</div>
                  <div style={{ fontSize: '11px', color: darkTheme.colors.muted }}>
                    {transaction.duration}
                  </div>
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center' }}>
                  <button 
                    onClick={() => openDetailModal(transaction)}
                    style={darkTheme.components.button.info}
                    onMouseEnter={(e) => buttonHoverEffects.info(e)}
                    onMouseLeave={(e) => buttonLeaveEffects.info(e)}
                  >
                    👁️ Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '700px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>Chi tiết giao dịch</h3>
              <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '14px' }}>
                Mã giao dịch: {selectedTransaction.transactionId}
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Khách hàng</label>
                <p style={{ margin: '5px 0', fontSize: '16px' }}>{selectedTransaction.userName}</p>
                <p style={{ margin: '0', fontSize: '14px', color: '#7f8c8d' }}>{selectedTransaction.userId}</p>
              </div>
              <div>
                <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Trạng thái</label>
                <p style={{ margin: '5px 0', fontSize: '16px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    background: getStatusColor(selectedTransaction.status)
                  }}>
                    {selectedTransaction.status}
                  </span>
                </p>
              </div>
              <div>
                <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Trạm</label>
                <p style={{ margin: '5px 0', fontSize: '16px' }}>{selectedTransaction.stationName}</p>
              </div>
              <div>
                <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Pin</label>
                <p style={{ margin: '5px 0', fontSize: '16px' }}>{selectedTransaction.batteryId}</p>
                <p style={{ margin: '0', fontSize: '14px', color: '#7f8c8d' }}>{selectedTransaction.batteryCapacity}</p>
              </div>
              <div>
                <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Phương thức thanh toán</label>
                <p style={{ margin: '5px 0', fontSize: '16px', color: getPaymentMethodColor(selectedTransaction.paymentMethod) }}>
                  {selectedTransaction.paymentMethod}
                </p>
                {selectedTransaction.amount > 0 && (
                  <p style={{ margin: '0', fontSize: '16px', color: '#19c37d', fontWeight: 'bold' }}>
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                )}
              </div>
              <div>
                <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Thời gian</label>
                <p style={{ margin: '5px 0', fontSize: '16px' }}>{formatDateTime(selectedTransaction.timestamp)}</p>
                <p style={{ margin: '0', fontSize: '14px', color: '#7f8c8d' }}>
                  Thời gian xử lý: {selectedTransaction.duration}
                </p>
              </div>
            </div>

            {/* Battery Health Info */}
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Thông tin pin</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Sức khỏe trước khi đổi</label>
                  <p style={{ margin: '5px 0', fontSize: '16px', color: '#ff4757' }}>
                    {selectedTransaction.batteryHealthBefore}%
                  </p>
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', color: '#7f8c8d' }}>Sức khỏe sau khi đổi</label>
                  <p style={{ margin: '5px 0', fontSize: '16px', color: '#19c37d' }}>
                    {selectedTransaction.batteryHealthAfter ? `${selectedTransaction.batteryHealthAfter}%` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {selectedTransaction.errorMessage && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#ffe6e6', borderRadius: '8px', border: '1px solid #ff4757' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#ff4757' }}>Lỗi</h4>
                <p style={{ margin: '0', color: '#ff4757' }}>{selectedTransaction.errorMessage}</p>
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: '20px', textAlign: 'right' }}>
              <button 
                onClick={() => setShowDetailModal(false)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #19c37d, #15a85a)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default StaffTransactionManagement;
