// Debug Info Component
import React, { useState, useEffect } from 'react';

const DebugInfo = ({ currentUser, vehicles, contracts, error, onRefresh }) => {
  const [apiStatus, setApiStatus] = useState({
    swaps: 'unknown',
    stations: 'unknown',
    overall: 'unknown'
  });

  // Test API endpoints when component mounts
  useEffect(() => {
    const testAPIs = async () => {
      const userId = currentUser?.id || currentUser?.user_id || currentUser?.userId;
      if (!userId) return;

      const status = { swaps: 'unknown', stations: 'unknown', overall: 'unknown' };

      // Test swaps API - use service instead of direct fetch
      try {
        const { swapService } = await import('../../../../assets/js/services');
        const swapsResponse = await swapService.getSwapCountSummary(userId);
        status.swaps = swapsResponse.success ? 'success' : 'error';
      } catch (e) {
        status.swaps = 'error';
      }

      // Test stations API - use service instead of direct fetch
      try {
        const { stationService } = await import('../../../../assets/js/services');
        const stationsResponse = await stationService.getAvailableStations();
        status.stations = stationsResponse.success ? 'success' : 'error';
      } catch (e) {
        status.stations = 'error';
      }

      // Overall status
      if (status.swaps === 'success' && status.stations === 'success') {
        status.overall = 'success';
      } else if (status.swaps === 'error' || status.stations === 'error') {
        status.overall = 'partial';
      }

      setApiStatus(status);
    };

    testAPIs();
  }, [currentUser]);

  const handleLogout = () => {
    console.log('🚪 Debug logout clicked');
    alert('Logout functionality needs to be connected');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'partial': return '⚠️';
      default: return '⏳';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success': return 'Connected';
      case 'error': return 'Failed';
      case 'partial': return 'Partial';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 165, 0, 0.1)',
      border: '1px solid rgba(255, 165, 0, 0.3)',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '20px',
      fontSize: '0.9rem',
      color: '#ffa500'
    }}>
      <strong>🔧 Debug Info:</strong><br/>
      API Base URL: {import.meta.env.VITE_API_BASE_URL}<br/>
      Current User ID: {currentUser?.id || currentUser?.user_id || currentUser?.userId}<br/>
      Vehicles Count: {vehicles.length}<br/>
      Contracts Count: {contracts.length}<br/>
      <br/>
      <strong>API Status:</strong><br/>
      Swaps API: {getStatusIcon(apiStatus.swaps)} {getStatusText(apiStatus.swaps)}<br/>
      Stations API: {getStatusIcon(apiStatus.stations)} {getStatusText(apiStatus.stations)}<br/>
      Overall: {getStatusIcon(apiStatus.overall)} {getStatusText(apiStatus.overall)}<br/>
      <br/>
      Data Source: {error ? 'API FAILED - Using Mock Data' : vehicles.length > 0 ? 'API SUCCESS' : 'NO DATA'}<br/>
      Error: {error || 'None'}<br/>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button 
          onClick={() => {
            const userId = currentUser?.id || currentUser?.user_id || currentUser?.userId || 'driver002';
            window.open(`http://localhost:8080/api/users/${userId}`, '_blank');
          }} 
          style={{
            padding: '5px 10px',
            background: 'rgba(25, 195, 125, 0.2)',
            border: '1px solid rgba(25, 195, 125, 0.3)',
            borderRadius: '5px',
            color: '#19c37d',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          Test API Direct
        </button>
        <button 
          onClick={onRefresh}
          style={{
            padding: '5px 10px',
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '5px',
            color: '#3b82f6',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          🔄 Force Refresh
        </button>
        <button 
          onClick={handleLogout}
          style={{
            padding: '5px 10px',
            background: 'rgba(255, 107, 107, 0.2)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '5px',
            color: '#ff6b6b',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          🚪 Debug Logout
        </button>
      </div>
    </div>
  );
};

export default DebugInfo;
