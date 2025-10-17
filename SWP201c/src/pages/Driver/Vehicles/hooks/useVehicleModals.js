// Driver/Vehicles/hooks/useVehicleModals.js
import { useState } from 'react';

/**
 * Custom hook for managing vehicle modals
 */
export const useVehicleModals = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const openDetailModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedVehicle(null);
    setShowDetailModal(false);
  };

  return {
    // Add modal state
    showAddModal,
    openAddModal,
    closeAddModal,

    // Detail modal state
    showDetailModal,
    selectedVehicle,
    openDetailModal,
    closeDetailModal
  };
};
