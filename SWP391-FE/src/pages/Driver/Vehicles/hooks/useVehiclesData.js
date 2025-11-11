// Driver/Vehicles/hooks/useVehiclesData.js
import { useState, useEffect, useCallback } from 'react';
import vehicleService from '../../../../assets/js/services/vehicleService';
import contractService from '../../../../assets/js/services/contractService';
import { 
  getUserId, 
  processVehiclesList,
  normalizeContract
} from '../utils';

/**
 * Custom hook for fetching vehicles and contracts
 */
export const useVehiclesData = () => {
  const [vehicles, setVehicles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch vehicles - useCallback để tránh tạo lại function mỗi lần render
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user from localStorage (where authService saves it)
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const userId = getUserId(user);

      if (!userId) {
        throw new Error('User not found. Please login again.');
      }

      // Fetch vehicles directly from vehicle service
      const response = await vehicleService.getUserVehicles(userId);

      // Extract vehicles from response
      const vehiclesList = response.success ? (response.data || []) : [];

      // Process vehicles (normalize + session updates)
      const processedVehicles = processVehiclesList(vehiclesList);
      setVehicles(processedVehicles);

      // Fetch contracts - gọi getUserContracts với userId để lấy contracts của user hiện tại
      const contractsResponse = await contractService.getUserContracts(userId);
      const contractsList = contractsResponse.success ? (contractsResponse.data || []) : [];
      const normalizedContracts = contractsList.map(normalizeContract);
      setContracts(normalizedContracts);

    } catch (err) {
      console.error('❌ Error fetching vehicles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - chỉ tạo 1 lần

  // Initial fetch
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    contracts,
    loading,
    error,
    refetch: fetchVehicles
  };
};
