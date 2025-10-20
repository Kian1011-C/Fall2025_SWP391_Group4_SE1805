// Staff Battery Stock - Refactored
import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useBatteryStock } from './hooks/useBatteryStock';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import BatteryCardGrid from './components/BatteryCardGrid';
import EmptyState from './components/EmptyState';

const StaffBatteryStock = () => {
  const {
    loading, error,
    stats,
    filteredBatteries,
    fetchBatteryStock,
    filterStatus, setFilterStatus,
    getStatusColor, getStatusLabel
  } = useBatteryStock();

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>⚠️ {error}</div>
        <button onClick={fetchBatteryStock} style={{ marginTop: '20px', padding: '10px 20px', background: '#19c37d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Thử lại</button>
      </div>
    );
  }

  return (
    <DashboardLayout role="staff">
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>📦 Kho pin</h1>
          <p style={{ color: '#B0B0B0', margin: 0 }}>Theo dõi và quản lý tồn kho pin</p>
        </div>

        <StatsCards stats={stats} />
        <FilterBar filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

        {filteredBatteries.length > 0 ? (
          <BatteryCardGrid batteries={filteredBatteries} getStatusColor={getStatusColor} getStatusLabel={getStatusLabel} />
        ) : (
          <EmptyState />
        )}
      </div>
    </DashboardLayout>
  );
};

export default StaffBatteryStock;


