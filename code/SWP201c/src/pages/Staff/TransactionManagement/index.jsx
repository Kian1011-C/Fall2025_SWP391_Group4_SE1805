// Staff Transaction Management - Refactored (Container)
import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import StatsCards from './components/StatsCards';
import Filters from './components/Filters';
import TransactionsTable from './components/TransactionsTable';
import DetailModal from './components/DetailModal';
import { useTransactionsData, useFormatters } from './hooks/useTransactionsData';

const INITIAL_TRANSACTIONS = [
  { id: 1, transactionId: 'TXN-001', userId: 'driver1@example.com', userName: 'Nguyễn Văn A', stationId: 1, stationName: 'Trạm đổi pin Quận 1', batteryId: 'BAT-001', batteryCapacity: '72V 45Ah', swapType: 'Đổi pin', amount: 0, paymentMethod: 'Gói dịch vụ', status: 'Hoàn thành', timestamp: '2024-01-15 14:30:25', duration: '3 phút 45 giây', batteryHealthBefore: 25, batteryHealthAfter: 100 },
  { id: 2, transactionId: 'TXN-002', userId: 'driver2@example.com', userName: 'Trần Thị B', stationId: 3, stationName: 'Trạm đổi pin Quận 7', batteryId: 'BAT-004', batteryCapacity: '60V 50Ah', swapType: 'Đổi pin', amount: 0, paymentMethod: 'Gói dịch vụ', status: 'Hoàn thành', timestamp: '2024-01-15 10:20:15', duration: '2 phút 30 giây', batteryHealthBefore: 15, batteryHealthAfter: 100 },
  { id: 3, transactionId: 'TXN-003', userId: 'driver1@example.com', userName: 'Nguyễn Văn A', stationId: 1, stationName: 'Trạm đổi pin Quận 1', batteryId: 'BAT-002', batteryCapacity: '60V 50Ah', swapType: 'Đổi pin', amount: 0, paymentMethod: 'Gói dịch vụ', status: 'Hoàn thành', timestamp: '2024-01-14 16:45:30', duration: '4 phút 12 giây', batteryHealthBefore: 30, batteryHealthAfter: 100 },
  { id: 4, transactionId: 'TXN-004', userId: 'driver3@example.com', userName: 'Lê Văn C', stationId: 2, stationName: 'Trạm đổi pin Quận 3', batteryId: 'BAT-003', batteryCapacity: '48V 24Ah', swapType: 'Đổi pin', amount: 50000, paymentMethod: 'Thanh toán lẻ', status: 'Hoàn thành', timestamp: '2024-01-10 09:15:45', duration: '5 phút 20 giây', batteryHealthBefore: 5, batteryHealthAfter: 100 },
  { id: 5, transactionId: 'TXN-005', userId: 'driver2@example.com', userName: 'Trần Thị B', stationId: 3, stationName: 'Trạm đổi pin Quận 7', batteryId: 'BAT-005', batteryCapacity: '60V 50Ah', swapType: 'Đổi pin', amount: 0, paymentMethod: 'Gói dịch vụ', status: 'Đang xử lý', timestamp: '2024-01-15 18:30:10', duration: 'Đang xử lý', batteryHealthBefore: 20, batteryHealthAfter: null },
  { id: 6, transactionId: 'TXN-006', userId: 'driver1@example.com', userName: 'Nguyễn Văn A', stationId: 1, stationName: 'Trạm đổi pin Quận 1', batteryId: 'BAT-001', batteryCapacity: '72V 45Ah', swapType: 'Đổi pin', amount: 0, paymentMethod: 'Gói dịch vụ', status: 'Thất bại', timestamp: '2024-01-12 11:20:30', duration: '1 phút 15 giây', batteryHealthBefore: 40, batteryHealthAfter: 40, errorMessage: 'Lỗi kết nối với pin' }
];

const StaffTransactionManagement = () => {
  const data = useTransactionsData(INITIAL_TRANSACTIONS);
  const { getStatusColor, getPaymentMethodColor, formatCurrency, formatDateTime } = useFormatters();

  return (
    <DashboardLayout role="staff">
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>💳 Quản lý giao dịch</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>Hiển thị danh sách toàn bộ lịch sử đổi pin và thanh toán</p>
        </div>

        <StatsCards stats={data.stats} formatCurrency={formatCurrency} />

        <Filters
          filterStatus={data.filterStatus}
          setFilterStatus={data.setFilterStatus}
          filterStation={data.filterStation}
          setFilterStation={data.setFilterStation}
          filterDate={data.filterDate}
          setFilterDate={data.setFilterDate}
          statusOptions={data.statusOptions}
          stations={data.stations}
        />

        <TransactionsTable
          data={data.filteredTransactions}
          getStatusColor={getStatusColor}
          getPaymentMethodColor={getPaymentMethodColor}
          formatCurrency={formatCurrency}
          formatDateTime={formatDateTime}
          onView={data.openDetailModal}
        />

        <DetailModal
          show={data.showDetailModal}
          transaction={data.selectedTransaction}
          onClose={() => data.setShowDetailModal(false)}
          getStatusColor={getStatusColor}
          getPaymentMethodColor={getPaymentMethodColor}
          formatCurrency={formatCurrency}
          formatDateTime={formatDateTime}
        />
      </div>
    </DashboardLayout>
  );
};

export default StaffTransactionManagement;


