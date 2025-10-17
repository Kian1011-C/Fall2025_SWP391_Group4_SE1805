// Driver/StationsMap/hooks/useStationBooking.js
// Hook for handling station booking

import { useState } from 'react';
import stationService from '../../../../assets/js/services/stationService';
import { createBookingRequest } from '../utils';

export const useStationBooking = (onSuccess) => {
  const [booking, setBooking] = useState(false);

  const bookStation = async (stationId, date, timeSlot) => {
    try {
      setBooking(true);
      
      const requestData = createBookingRequest(stationId, date, timeSlot);
      
      const result = await stationService.bookStation(stationId, requestData);
      
      if (result.success) {
        alert('Đặt chỗ thành công!');
        if (onSuccess) {
          onSuccess();
        }
        return { success: true };
      } else {
        alert(`Lỗi: ${result.message}`);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Có lỗi xảy ra khi đặt chỗ!');
      return { success: false, error: error.message };
    } finally {
      setBooking(false);
    }
  };

  return {
    bookStation,
    booking
  };
};
