// Driver/Vehicles/hooks/useVehiclesData.js
import { useState, useEffect } from 'react';
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
      // Debug session storage
      console.log('🔍 Session storage keys:', Object.keys(sessionStorage));
      console.log('🔍 Session storage user:', sessionStorage.getItem('user'));
      
      let user, userId;
      
      // Try to get user from session storage
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        user = JSON.parse(userStr);
        console.log('🔍 Parsed user object:', user);
        userId = getUserId(user);
        console.log('🔍 Extracted userId:', userId);
      }
      
      // Fallback to mock user for development
      if (!userId) {
        console.warn('⚠️ No user in session storage, using mock user for development');
        user = {
          id: 1,
          userId: 1,
          name: 'Trần Văn Minh',
          email: 'minh.driver@gmail.com',
          role: 'driver'
        };
        userId = 1;
        console.log('🔍 Using mock user:', user);
      }

      console.log('🚗 Fetching vehicles for user:', userId);

      // Fetch vehicles using real API
      const response = await vehicleService.getVehiclesByUserId(userId);
      console.log('🚗 Vehicles API response:', response);

      if (response.success) {
        const vehiclesList = response.data || [];
        console.log('🚗 Raw vehicles from API:', vehiclesList);

        // Process vehicles (normalize + session updates)
        const processedVehicles = processVehiclesList(vehiclesList);
        console.log('✅ Processed vehicles:', processedVehicles);
        setVehicles(processedVehicles);
      } else {
        console.warn('⚠️ API failed:', response.message);
        setVehicles([]);
      }

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
