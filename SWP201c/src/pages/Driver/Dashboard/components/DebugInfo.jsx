// Debug Info Component
import React from 'react';

const DebugInfo = ({ currentUser, vehicles, contracts, error }) => {
  // Only show in development mode
  if (import.meta.env.VITE_ENABLE_DEBUG !== 'true') return null;

  const handleLogout = () => {
    console.log('🚪 Debug logout clicked');
    // This would need to be passed as a prop or use context
    alert('Logout functionality needs to be connected');
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
      Data Source: {error ? 'API FAILED - No Data' : vehicles.length > 0 ? 'API SUCCESS' : 'NO DATA'}<br/>
      API Status: {error ? '❌ Error' : vehicles.length > 0 ? '✅ Connected' : '⏳ No Response'}<br/>
      Error: {error || 'None'}<br/>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button 
          onClick={() => window.open('http://localhost:8080/api/users/driver002', '_blank')} 
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
