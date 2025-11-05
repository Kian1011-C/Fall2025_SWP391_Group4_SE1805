// Admin Payments Management - index.jsx
import React, { useState, useMemo } from 'react';
import { usePaymentsData } from './hooks/usePaymentsData';
import DriverRow from './components/DriverRow';
import GenerateInvoiceModal from './components/GenerateInvoiceModal';
import PaymentHistoryModal from './components/PaymentHistoryModal';

const Payments = () => {
  const { drivers, loading, error, searchTerm, setSearchTerm, refreshData } = usePaymentsData();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activeTab, setActiveTab] = useState('need_invoice'); // 'need_invoice' | 'waiting_payment' | 'history'

  const handleGenerateInvoice = (driver) => {
    setSelectedDriver(driver);
    setShowInvoiceModal(true);
  };

  const handleViewHistory = (driver) => {
    setSelectedDriver(driver);
    setShowHistoryModal(true);
  };

  const handleInvoiceSuccess = () => {
    refreshData();
  };

  // Filter drivers based on active tab
  const filteredDrivers = useMemo(() => {
    if (activeTab === 'need_invoice') {
      // Tab 1: Hiển thị contracts CHƯA có payment pending (unpaidBills === 0)
      return drivers.filter(d => d.unpaidBills === 0);
    } else if (activeTab === 'waiting_payment') {
      // Tab 2: Hiển thị contracts ĐÃ có payment pending (unpaidBills > 0)
      return drivers.filter(d => d.unpaidBills > 0);
    } else {
      // Tab 3: Lịch sử - Gộp theo userId (1 user có thể có nhiều contracts)
      const userMap = new Map();
      drivers.forEach(driver => {
        if (!userMap.has(driver.userId)) {
          userMap.set(driver.userId, {
            ...driver,
            id: driver.userId, // Dùng userId làm key
            contracts: [driver.contractId], // Danh sách contractIds
            totalPaid: driver.totalPaid,
            unpaidBills: driver.unpaidBills
          });
        } else {
          // Gộp thông tin từ nhiều contracts của cùng 1 user
          const existing = userMap.get(driver.userId);
          existing.contracts.push(driver.contractId);
          existing.totalPaid += driver.totalPaid;
          existing.unpaidBills += driver.unpaidBills;
        }
      });
      return Array.from(userMap.values());
    }
  }, [drivers, activeTab]);

  // Pagination 8 drivers per page
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalDrivers = filteredDrivers.length;
  const totalPages = Math.max(1, Math.ceil(totalDrivers / itemsPerPage));
  const currentDrivers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDrivers.slice(start, start + itemsPerPage);
  }, [filteredDrivers, currentPage]);
  
  // Stats
  const activeContracts = drivers.filter(d => d.contractStatus === 'active').length;
  const needInvoice = drivers.filter(d => d.unpaidBills === 0).length;
  const waitingPayment = drivers.filter(d => d.unpaidBills > 0).length;
  const totalRevenue = drivers.reduce((sum, d) => sum + d.totalPaid, 0);
  const totalUsers = new Set(drivers.map(d => d.userId)).size; // Số user unique

  return (
    <div style={{ padding: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: '#111827' }}>
          Quản lý Thanh toán
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Quản lý hóa đơn và thanh toán của khách hàng
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              �
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Cần xuất hóa đơn
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
                {needInvoice}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⏳
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Đợi thanh toán
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
                {waitingPayment}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              👥
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Tổng khách hàng
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                {totalUsers}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '20px'
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '2px solid #f3f4f6',
          paddingBottom: '12px'
        }}>
          <button
            onClick={() => {
              setActiveTab('need_invoice');
              setCurrentPage(1);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'need_invoice' ? '#3b82f6' : 'transparent',
              color: activeTab === 'need_invoice' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📝 Chờ xuất hóa đơn ({needInvoice})
          </button>
          
          <button
            onClick={() => {
              setActiveTab('waiting_payment');
              setCurrentPage(1);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'waiting_payment' ? '#f59e0b' : 'transparent',
              color: activeTab === 'waiting_payment' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ⏳ Đợi thanh toán ({waitingPayment})
          </button>
          
          <button
            onClick={() => {
              setActiveTab('history');
              setCurrentPage(1);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'history' ? '#10b981' : 'transparent',
              color: activeTab === 'history' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📋 Lịch sử thanh toán ({totalUsers})
          </button>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm khách hàng (tên, email, SĐT)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          
          <button
            onClick={refreshData}
            style={{
              padding: '12px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* Drivers Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
            Đang tải dữ liệu...
          </div>
        ) : error ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#ef4444' }}>
            ⚠️ {error}
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
            {activeTab === 'need_invoice' && 'Không có hợp đồng nào cần xuất hóa đơn'}
            {activeTab === 'waiting_payment' && 'Không có hóa đơn nào đang chờ thanh toán'}
            {activeTab === 'history' && 'Không có dữ liệu lịch sử thanh toán'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Khách hàng
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Liên hệ
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Hợp đồng
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Gói
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'right',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Đã thanh toán
                </th>
                {/* Chỉ hiển thị cột "Chưa TT" ở tab "Đợi thanh toán" */}
                {activeTab === 'waiting_payment' && (
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Chưa TT
                  </th>
                )}
                <th style={{
                  padding: '16px',
                  textAlign: 'right',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDrivers.map(driver => (
                <DriverRow
                  key={driver.id}
                  driver={driver}
                  onGenerateInvoice={handleGenerateInvoice}
                  onViewHistory={handleViewHistory}
                  activeTab={activeTab}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalDrivers > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', padding: '20px 0' }}>
          <button
            style={{ minWidth: 44, height: 44, padding: '0 14px', borderRadius: 12, border: '1px solid #d1d5db', background: '#fff', fontWeight: 700, cursor: currentPage===1 ? 'not-allowed' : 'pointer', opacity: currentPage===1 ? .5 : 1 }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >«</button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{ minWidth: 44, height: 44, padding: '0 14px', borderRadius: 12, border: '1px solid #d1d5db', background: isActive ? '#0b74e5' : '#fff', color: isActive ? '#fff' : '#111827', fontWeight: 700 }}
              >{page}</button>
            );
          })}
          <button
            style={{ minWidth: 44, height: 44, padding: '0 14px', borderRadius: 12, border: '1px solid #d1d5db', background: '#fff', fontWeight: 700, cursor: currentPage===totalPages ? 'not-allowed' : 'pointer', opacity: currentPage===totalPages ? .5 : 1 }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          >»</button>
        </div>
      )}

      {/* Modals */}
      {showInvoiceModal && selectedDriver && (
        <GenerateInvoiceModal
          driver={selectedDriver}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedDriver(null);
          }}
          onSuccess={handleInvoiceSuccess}
        />
      )}

      {showHistoryModal && selectedDriver && (
        <PaymentHistoryModal
          driver={selectedDriver}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedDriver(null);
          }}
        />
      )}
    </div>
  );
};

export default Payments;
