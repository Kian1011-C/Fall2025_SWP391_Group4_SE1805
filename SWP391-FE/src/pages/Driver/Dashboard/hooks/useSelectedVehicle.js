// Driver/Dashboard/hooks/useSelectedVehicle.js
// Custom hook for managing selected vehicle state

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  saveSelectedVehicleToSession,
  getUpdatedVehicleFromSession,
  getAutoSelectedVehicle
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

  // Khi danh sách xe thay đổi: chỉ chọn xe nếu đã có trong session (người dùng chọn trước đó)
  // Không tự động chọn xe đầu tiên để buộc người dùng chọn qua popup
  useEffect(() => {
    if (vehicles.length > 0) {
      const sessionVehicle = getUpdatedVehicleFromSession();
      if (sessionVehicle) {
        const autoSelected = getAutoSelectedVehicle(vehicles, selectedVehicle, sessionVehicle);
        if (autoSelected && autoSelected !== selectedVehicle) {
          setSelectedVehicle(autoSelected);
        }
      } else {
        setSelectedVehicle(null);
      }
    } else {
      setSelectedVehicle(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles]);

  return {
    selectedVehicle,
    setSelectedVehicle
  };
};
