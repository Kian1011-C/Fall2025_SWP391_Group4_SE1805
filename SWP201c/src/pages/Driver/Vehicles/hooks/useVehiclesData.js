// Driver/Vehicles/hooks/useVehiclesData.js
import { useState, useEffect } from 'react';
import userService from '../../../../assets/js/services/userService';
import contractService from '../../../../assets/js/services/contractService';
import { 
  getUserId, 
  extractVehiclesFromResponse, 
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

  // Fetch contracts
  const fetchContracts = async (userId) => {
    if (!userId) return [];

    try {
      console.log('📋 Fetching contracts for user:', userId);
      const response = await contractService.getContracts(userId);
      console.log('📋 Contracts response:', response);

      if (response.success && response.data) {
        const contractsList = Array.isArray(response.data) 
          ? response.data 
          : response.data.contracts || [];
        
        const normalized = contractsList.map(normalizeContract);
        console.log('✅ Contracts loaded:', normalized.length);
        return normalized;
      }

      return [];
    } catch (err) {
      console.error('❌ Error fetching contracts:', err);
      return [];
    }
  };

  // Fetch vehicles
  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const userId = getUserId(user);

      if (!userId) {
        throw new Error('User not found. Please login again.');
      }

      console.log('🚗 Fetching data for user:', userId);

      // Fetch user data (includes vehicles)
      const response = await userService.getUserById(userId);
      console.log('📦 User data response:', response);

      // Extract vehicles
      const vehiclesList = extractVehiclesFromResponse(response);
      console.log('🚗 Raw vehicles:', vehiclesList);

      // Process vehicles (normalize + session updates)
      const processedVehicles = processVehiclesList(vehiclesList);
      console.log('✅ Processed vehicles:', processedVehicles);
      setVehicles(processedVehicles);

      // Fetch contracts
      const contractsList = await fetchContracts(userId);
      setContracts(contractsList);

    } catch (err) {
      console.error('❌ Error fetching vehicles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    vehicles,
    contracts,
    loading,
    error,
    refetch: fetchVehicles
  };
};
