// Admin/Batteries/index.jsx
// Main container for Admin Batteries Management (Refactored with SoC)

import React, { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

// Custom hooks
import {
  useBatteriesData,
  useBatteriesActions,
  useBatteriesFilters
} from './hooks';

// Components
import {
  BatteriesHeader,
  BatteriesStatsCards,
  BatteriesControls,
  BatteriesGrid,
  AddBatteryModal
} from './components';

const AdminBatteries = () => {
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);

  // Custom hooks
  const { batteries, loading, error, refetch } = useBatteriesData();
  const {
    handleMaintenanceBattery,
    handleDeleteBattery,
    handleAddBattery
  } = useBatteriesActions(refetch);

  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    filteredBatteries,
    stats
  } = useBatteriesFilters(batteries);

  // Event handlers
  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };

  const handleAddSubmit = async (batteryData) => {
    const result = await handleAddBattery(batteryData);
    
    if (result.success) {
      setShowAddModal(false);
    }
    // If not implemented or error, modal stays open for user to see alert
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#FFFFFF' }}>
        <h2>Đang tải dữ liệu pin...</h2>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
        <h2>Lỗi: {error}</h2>
        <button 
          onClick={refetch} 
          style={{ 
            marginTop: '20px', 
            padding: '10px 20px',
            background: '#19c37d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Thêm log để kiểm tra render trong AdminBatteries
  console.log('🔍 AdminBatteries: Rendering with props:', { batteries, loading, error });

  // Main render
  return (
    <DashboardLayout role="admin">
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <BatteriesHeader />

        {/* Statistics Cards */}
        <BatteriesStatsCards stats={stats} />

        {/* Search & Filter Controls */}
        <BatteriesControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onAddClick={handleAddClick}
        />

        {/* Batteries Grid */}
        <BatteriesGrid
          batteries={filteredBatteries}
          onMaintenance={handleMaintenanceBattery}
          onDelete={handleDeleteBattery}
        />

        {/* Add Battery Modal */}
        <AddBatteryModal
          isOpen={showAddModal}
          onClose={handleModalClose}
          onSubmit={handleAddSubmit}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminBatteries;
