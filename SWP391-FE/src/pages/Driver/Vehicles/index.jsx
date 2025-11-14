// Driver/Vehicles/index.jsx
// Vehicles page (container inlined)
import React, { useMemo } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useVehiclesData, useVehicleModals, useVehicleForm } from './hooks';
import { findVehicleContract } from './utils';
import {
  VehicleList,
  EmptyVehicles,
  AddVehicleModal,
  VehicleDetailModal
} from './components';

/**
 * Vehicles Container Component
 * Manages vehicle display, adding, and detail viewing
 */
const VehiclesContainer = () => {
  // Fetch data
  const { vehicles, contracts, loading, error, refetch } = useVehiclesData();

  // Modal management
  const {
    showAddModal,
    openAddModal,
    closeAddModal,
    showDetailModal,
    selectedVehicle,
    openDetailModal,
    closeDetailModal
  } = useVehicleModals();

  // Form management
  const {
    formData,
    formErrors,
    submitting,
    updateField,
    handleSubmit
  } = useVehicleForm(() => {
    closeAddModal();
    refetch();
  });

  // Get contract for selected vehicle - useMemo để tránh tính toán lại mỗi lần render
  const selectedVehicleContract = useMemo(() => {
    return selectedVehicle ? findVehicleContract(selectedVehicle, contracts) : null;
  }, [selectedVehicle, contracts]);

  // Handle add vehicle
  const handleAddVehicle = async () => {
    const success = await handleSubmit();
    if (!success) {
      console.error('Failed to add vehicle');
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="vehicles-container">
          <div className="vehicles-header">
            <h1>Quản lý phương tiện</h1>
          </div>
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' }}>
            Đang tải dữ liệu...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="vehicles-container">
          <div className="vehicles-header">
            <h1>Quản lý phương tiện</h1>
          </div>
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#ff6b6b' }}>
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="vehicles-container">
        {/* Header */}
        <div className="vehicles-header">
          <h1>Quản lý phương tiện</h1>
          <button 
            className="btn btn-primary" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log(' Button clicked - opening modal');
              openAddModal();
            }}
            style={{ cursor: 'pointer', zIndex: 10 }}
          >
            <i className="fas fa-plus"></i>
            Thêm phương tiện
          </button>
        </div>

        {/* Vehicles List */}
        {vehicles.length > 0 ? (
          <VehicleList
            vehicles={vehicles}
            onViewDetails={openDetailModal}
          />
        ) : (
          <EmptyVehicles onAddVehicle={openAddModal} />
        )}
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        show={showAddModal}
        formData={formData}
        formErrors={formErrors}
        submitting={submitting}
        onUpdateField={updateField}
        onSubmit={handleAddVehicle}
        onClose={closeAddModal}
      />

      {/* Vehicle Detail Modal */}
      {showDetailModal && selectedVehicle && (
        <VehicleDetailModal
          show={showDetailModal}
          vehicle={selectedVehicle}
          vehicleContract={selectedVehicleContract}
          onClose={closeDetailModal}
        />
      )}
    </DashboardLayout>
  );
};

export default VehiclesContainer;
