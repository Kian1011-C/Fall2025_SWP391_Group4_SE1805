// Admin/Stations/index.jsx
// Container for Stations page - orchestrates all components and hooks

import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useStationsData, useStationsActions, useStationsFilters, useStationForm } from './hooks';
import {
  StationsHeader,
  StationsStats,
  StationsControls,
  StationsGrid,
  StationFormModal
} from './components';

const AdminStations = () => {
  // Custom hooks for data, actions, filters, and form management
  const { stations, loading, error } = useStationsData();
  const { createStation, updateStation, deleteStation } = useStationsActions();
  const { 
    searchQuery, 
    sortBy, 
    filteredStations, 
    setSearchQuery, 
    setSortBy 
  } = useStationsFilters(stations);
  const {
    showModal,
    editingStation,
    formData,
    formErrors,
    openCreateModal,
    openEditModal,
    closeModal,
    updateField,
    validateForm,
    isEditMode
  } = useStationForm();

  // Handle form submission (create or update)
  const handleFormSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }

    let result;
    if (isEditMode) {
      result = await updateStation(editingStation.id, formData);
    } else {
      result = await createStation(formData);
    }

    if (result.success) {
      closeModal();
    } else {
      alert(result.error || 'Đã xảy ra lỗi');
    }
  };

  // Handle station deletion
  const handleDelete = async (stationId) => {
    const result = await deleteStation(stationId);
    if (!result.success) {
      alert(result.error || 'Không thể xóa trạm');
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(106, 183, 255, 0.2)',
              borderTop: '4px solid #6ab7ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: '#B0B0B0', fontSize: '1.1rem' }}>
              Đang tải danh sách trạm...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout role="admin">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
            <h3 style={{ color: '#EF4444', marginBottom: '10px' }}>
              Lỗi tải dữ liệu
            </h3>
            <p style={{ color: '#B0B0B0' }}>{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <StationsHeader onAddStation={openCreateModal} />

      <StationsStats stations={stations} />

      <StationsControls
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
      />

      <StationsGrid
        stations={filteredStations}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <StationFormModal
        show={showModal}
        isEditMode={isEditMode}
        formData={formData}
        formErrors={formErrors}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        onFieldChange={updateField}
      />
    </DashboardLayout>
  );
};

export default AdminStations;
