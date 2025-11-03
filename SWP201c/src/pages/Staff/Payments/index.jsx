// Staff Payments Management - index.jsx (Read Only)
import React, { useState } from 'react';
import { usePaymentsData } from './hooks/usePaymentsData';
import DriverRow from './components/DriverRow';
import PaymentHistoryModal from './components/PaymentHistoryModal';

const Payments = () => {
  const { drivers, loading, error, searchTerm, setSearchTerm, refreshData } = usePaymentsData();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // ✅ Staff chỉ xem lịch sử, không xuất hóa đơn
  const handleViewHistory = (driver) => {
    setSelectedDriver(driver);
    setShowHistoryModal(true);
  };

  const totalDrivers = drivers.length;
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
          Xem hóa đơn và lịch sử thanh toán của khách hàng
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
        ) : drivers.length === 0 ? (
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
              {drivers.map(driver => (
                <DriverRow
                  key={driver.id}
                  driver={driver}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal - Chỉ có PaymentHistory (Staff read-only) */}
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
