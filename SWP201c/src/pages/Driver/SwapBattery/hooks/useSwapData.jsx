// Custom Hook for managing swap data fetching
import { useState } from 'react';
import { stationService, batteryService, contractService } from '../../../../assets/js/services';
import { filterSlotsByStatus } from '../utils/swapHelpers';

export const useSwapData = (currentUser) => {
  const [stations, setStations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [userContract, setUserContract] = useState(null);
  const [towers, setTowers] = useState([]);
  const [fullSlots, setFullSlots] = useState([]);
  const [emptySlots, setEmptySlots] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingTowers, setLoadingTowers] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data
  const fetchInitialData = async (vehicleFromNavigation = null) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔋 Fetching swap data for user:', currentUser);
      
      // Fetch stations
      const stationsResponse = await stationService.getAllStations();
      console.log('📍 Stations response:', stationsResponse);
      
      if (stationsResponse.success && stationsResponse.data) {
        const stationsList = Array.isArray(stationsResponse.data) 
          ? stationsResponse.data 
          : stationsResponse.data.stations || [];
        setStations(stationsList);
        console.log('📍 Loaded stations:', stationsList.length);
      }
      
      // Fetch user vehicles if needed
      if (currentUser && !vehicleFromNavigation) {
        try {
          const vehiclesResponse = await batteryService.getUserVehicles(currentUser.id || currentUser.user_id);
          console.log('🚗 Vehicles response:', vehiclesResponse);
          
          if (vehiclesResponse.success && vehiclesResponse.data) {
            const vehiclesList = Array.isArray(vehiclesResponse.data)
              ? vehiclesResponse.data
              : vehiclesResponse.data.vehicles || [];
            setVehicles(vehiclesList);
            console.log('🚗 Loaded vehicles:', vehiclesList.length);
          }
        } catch (vehicleError) {
          console.warn('⚠️ Could not fetch vehicles:', vehicleError);
        }
      }
      
      // Fetch user contract
      if (currentUser) {
        try {
          const contractResponse = await contractService.getContracts(currentUser.id || currentUser.user_id);
          console.log('📄 Contract response:', contractResponse);
          
          if (contractResponse.success && contractResponse.data) {
            // Get the first active contract or the first contract in the list
            const contracts = Array.isArray(contractResponse.data) 
              ? contractResponse.data 
              : contractResponse.data.contracts || [];
            const activeContract = contracts.find(c => c.status === 'active') || contracts[0];
            setUserContract(activeContract);
            console.log('📄 Loaded contract:', activeContract);
            console.log('📋 Contract IDs:', {
              contract_id: activeContract?.contract_id,
              contractId: activeContract?.id,
              subscriptionId: activeContract?.subscription_id
            });
            console.log('🔑 All contract keys:', activeContract ? Object.keys(activeContract) : 'No contract');
            console.log('📦 Full contract object:', JSON.stringify(activeContract, null, 2));
          } else {
            console.warn('⚠️ No contracts found in response');
          }
        } catch (contractError) {
          console.warn('⚠️ Could not fetch contract:', contractError);
        }
      }
      
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch towers by station
  const fetchTowersByStation = async (stationId) => {
    try {
      setLoadingTowers(true);
      console.log('🔌 Fetching towers for station:', stationId);
      
      const response = await stationService.getTowersByStation(stationId);
      console.log('🔌 Towers response:', response);
      
      if (response.success && response.data) {
        const towersList = Array.isArray(response.data)
          ? response.data
          : response.data.towers || [];
        setTowers(towersList);
        console.log('🔌 Loaded towers:', towersList.length);
      } else {
        setTowers([]);
      }
    } catch (err) {
      console.error('❌ Error fetching towers:', err);
      setTowers([]);
    } finally {
      setLoadingTowers(false);
    }
  };

  // Fetch slots by tower
  const fetchSlotsByTower = async (towerId) => {
    try {
      setLoadingSlots(true);
      console.log('🔋 Fetching slots for tower:', towerId);
      
      const response = await stationService.getSlotsByTower(towerId);
      console.log('🔋 Slots response:', response);
      
      if (response.success && response.data) {
        const slotsList = Array.isArray(response.data)
          ? response.data
          : response.data.slots || [];
        
        const { fullSlots: full, emptySlots: empty } = filterSlotsByStatus(slotsList);
        
        setFullSlots(full);
        setEmptySlots(empty);
        
        console.log('🔋 Full slots:', full.length);
        console.log('🔋 Empty slots:', empty.length);
      } else {
        setFullSlots([]);
        setEmptySlots([]);
      }
    } catch (err) {
      console.error('❌ Error fetching slots:', err);
      setFullSlots([]);
      setEmptySlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  return {
    // Data
    stations,
    vehicles,
    userContract,
    towers,
    fullSlots,
    emptySlots,
    
    // Loading states
    loading,
    loadingTowers,
    loadingSlots,
    error,
    
    // Actions
    fetchInitialData,
    fetchTowersByStation,
    fetchSlotsByTower,
    setError
  };
};
