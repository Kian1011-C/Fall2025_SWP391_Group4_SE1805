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
  const [activeTab, setActiveTab] = useState('generate'); // 'generate', 'pending', 'history'

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
    setActiveTab('pending'); // Chuyển sang tab "Chờ thanh toán"
  };

  // Filter drivers based on active tab
  const filteredDrivers = useMemo(() => {
    if (activeTab === 'pending') {
      // Tab "Chờ thanh toán": Chỉ hiện những cái đã xuất hóa đơn (có payment in_progress)
      return drivers.filter(driver => driver.hasGeneratedInvoice);
    } else if (activeTab === 'history') {
      // Tab "Lịch sử": Gộp users có cùng email
      const userMap = new Map();
      drivers.forEach(driver => {
        const key = driver.email || driver.userId;
        if (!userMap.has(key)) {
          userMap.set(key, { 
            ...driver,
            subscriptionTypes: [driver.subscriptionType] // Lưu array các gói
          });
        } else {
          const existing = userMap.get(key);
          existing.totalPaid += driver.totalPaid;
          existing.unpaidBills += driver.unpaidBills;
          // Thêm gói mới nếu chưa có
          if (!existing.subscriptionTypes.includes(driver.subscriptionType)) {
            existing.subscriptionTypes.push(driver.subscriptionType);
          }
        }
      });
      return Array.from(userMap.values());
    }
    // Tab "Xuất hóa đơn": Show tất cả
    return drivers;
  }, [drivers, activeTab]);

  // Pagination 8 drivers per page
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Reset page when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const totalDrivers = filteredDrivers.length;
  const totalPages = Math.max(1, Math.ceil(totalDrivers / itemsPerPage));
  const currentDrivers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDrivers.slice(start, start + itemsPerPage);
  }, [filteredDrivers, currentPage]);
  
  const activeContracts = drivers.filter(d => d.contractStatus === 'active').length;
  const unpaidBills = drivers.reduce((sum, d) => sum + d.unpaidBills, 0);
  const totalRevenue = drivers.reduce((sum, d) => sum + d.totalPaid, 0);

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
              👥
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Tổng khách hàng
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                {totalDrivers}
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
              ✓
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Hợp đồng hoạt động
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                {activeContracts}
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
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⚠️
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Hóa đơn chưa thanh toán
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>
                {unpaidBills}
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
        marginBottom: '20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
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

      {/* Tabs Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '20px',
        padding: '8px',
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => setActiveTab('generate')}
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: activeTab === 'generate' ? '#3b82f6' : 'transparent',
            color: activeTab === 'generate' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📝 Xuất hóa đơn
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: activeTab === 'pending' ? '#3b82f6' : 'transparent',
            color: activeTab === 'pending' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ⏳ Chờ thanh toán
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            flex: 1,
            padding: '12px 20px',
            backgroundColor: activeTab === 'history' ? '#3b82f6' : 'transparent',
            color: activeTab === 'history' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📜 Lịch sử
        </button>
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
            Không tìm thấy khách hàng nào
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
                {/* Chỉ hiện cột "Đã thanh toán" ở tab "Lịch sử" */}
                {activeTab === 'history' && (
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
                )}
                {/* Chỉ hiện cột "Chưa TT" ở tab "pending" */}
                {activeTab === 'pending' && (
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
                {/* Ẩn cột "Thao tác" ở tab "Chờ thanh toán" */}
                {activeTab !== 'pending' && (
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
                )}
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
