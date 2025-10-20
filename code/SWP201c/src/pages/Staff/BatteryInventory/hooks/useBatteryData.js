// Staff/BatteryInventory/hooks/useBatteryData.js
import { useState, useEffect } from 'react';
import batteryService from '../../../../assets/js/services/batteryService';

/**
 * Custom hook for fetching battery inventory data
 */
export const useBatteryData = () => {
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBatteries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔋 Fetching batteries...');
      const result = await batteryService.getAllBatteries();
      
      if (result.success) {
        console.log('✅ Batteries loaded:', result.data);
        setBatteries(result.data || []);
      } else {
        console.warn('⚠️ Failed to load batteries:', result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error('❌ Error loading batteries:', err);
      setError('Lỗi khi tải dữ liệu pin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatteries();
  }, []);

  return {
    batteries,
    setBatteries,
    loading,
    error,
    refetch: fetchBatteries
  };
};
