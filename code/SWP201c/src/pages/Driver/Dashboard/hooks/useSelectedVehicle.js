// Driver/Dashboard/hooks/useSelectedVehicle.js
// Custom hook for managing selected vehicle state

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  saveSelectedVehicleToSession,
  getUpdatedVehicleFromSession
} from '../utils';

export const useSelectedVehicle = (vehicles) => {
  const location = useLocation();
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Save to session storage when selected vehicle changes
  useEffect(() => {
    saveSelectedVehicleToSession(selectedVehicle);
  }, [selectedVehicle]);

  // Check for updated vehicle from swap battery flow
  useEffect(() => {
    if (location.state?.updatedVehicle) {
      console.log('🔄 Received updated vehicle from swap:', location.state.updatedVehicle);
      sessionStorage.setItem('selectedVehicle', JSON.stringify(location.state.updatedVehicle));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Initialize from session only; do NOT auto-select to force user choice
  useEffect(() => {
    const sessionVehicle = getUpdatedVehicleFromSession();
    if (!selectedVehicle && sessionVehicle) {
      setSelectedVehicle(sessionVehicle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles]);

  return {
    selectedVehicle,
    setSelectedVehicle
  };
};
