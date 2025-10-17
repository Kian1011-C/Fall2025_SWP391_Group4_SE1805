// Admin/Contracts/index.jsx
// Main container for Admin Contracts Management (Refactored with SoC)

import React, { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

// Custom hooks
import {
  useContractsData,
  useContractsActions,
  useContractsFilters
} from './hooks';

// Components
import {
  ContractsHeader,
  ContractsStatsCards,
  ContractsControls,
  ContractsTable,
  ContractDetailModal
} from './components';

const AdminContracts = () => {
  // Modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // Custom hooks
  const { contracts, loading, error, refetch } = useContractsData();
  const { handleApproveContract } = useContractsActions(refetch);

  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedType,
    setSelectedType,
    filteredContracts,
    stats
  } = useContractsFilters(contracts);

  // Event handlers
  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setShowDetailModal(true);
  };

  const handleModalClose = () => {
    setShowDetailModal(false);
    setSelectedContract(null);
  };

  const handleApprove = async (contractId) => {
    await handleApproveContract(contractId);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#FFFFFF' }}>
        <h2>Đang tải dữ liệu hợp đồng...</h2>
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

  // Main render
  return (
    <DashboardLayout role="admin">
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <ContractsHeader />

        {/* Statistics Cards */}
        <ContractsStatsCards stats={stats} />

        {/* Search & Filter Controls */}
        <ContractsControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />

        {/* Contracts Table */}
        <ContractsTable
          contracts={filteredContracts}
          onViewDetails={handleViewDetails}
          onApprove={handleApprove}
        />

        {/* Contract Detail Modal */}
        <ContractDetailModal
          isOpen={showDetailModal}
          contract={selectedContract}
          onClose={handleModalClose}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminContracts;
