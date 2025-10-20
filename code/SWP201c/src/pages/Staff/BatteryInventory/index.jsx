// Staff/BatteryInventory/index.jsx
// Battery Inventory page (container inlined)
import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useBatteryData, useBatteryFilters, useBatteryUpdate } from './hooks';
import {
  InventoryHeader,
  BatteryFilters,
  BatteryStats,
  BatteryTable,
  BatteryUpdateModal
} from './components';

/**
 * Battery Inventory Container Component
 * Track and update battery status (in use, charging, damaged)
 */
const BatteryInventoryContainer = () => {
  // Fetch battery data
  const { batteries, setBatteries, loading, error } = useBatteryData();

  // Filter management
  const {
    filterStatus,
    setFilterStatus,
    filterStation,
    setFilterStation,
    stations,
    filteredBatteries
  } = useBatteryFilters(batteries);

  // Update modal management
  const {
    showUpdateModal,
    selectedBattery,
    updateData,
    isUpdating,
    openUpdateModal,
    closeUpdateModal,
    updateField,
    handleUpdateBattery
  } = useBatteryUpdate(batteries, setBatteries);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="staff">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>
            ⏳ Đang tải...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout role="staff">
        <div style={{ padding: '20px' }}>
          <InventoryHeader />
          <div style={{ 
            textAlign: 'center', 
            padding: '50px', 
            color: '#ff6b6b',
            background: 'rgba(255, 107, 107, 0.1)',
            borderRadius: '12px'
          }}>
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="staff">
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <InventoryHeader />

        {/* Filters */}
        <BatteryFilters
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterStation={filterStation}
          setFilterStation={setFilterStation}
          stations={stations}
        />

        {/* Stats */}
        <BatteryStats batteries={filteredBatteries} />

        {/* Table */}
        <BatteryTable
          batteries={filteredBatteries}
          onUpdateBattery={openUpdateModal}
        />

        {/* Update Modal */}
        <BatteryUpdateModal
          show={showUpdateModal}
          battery={selectedBattery}
          updateData={updateData}
          isUpdating={isUpdating}
          onUpdateField={updateField}
          onSave={handleUpdateBattery}
          onClose={closeUpdateModal}
        />
      </div>
    </DashboardLayout>
  );
};

export default BatteryInventoryContainer;
