// Driver/StationsMap/index.jsx
// Container component for StationsMap page - orchestrates stations display and booking

import DashboardLayout from '../../../layouts/DashboardLayout';
import { useStationsData, useStationBooking, useStationSelection } from './hooks';
import { getStationsStats } from './utils';
import {
  StationsMapHeader,
  StationsList,
  StationsStats
} from './components';

const StationsMap = () => {
  // Data fetching
  const { stations, loading, error, refetch } = useStationsData();

  // Booking handling
  const { bookStation, booking } = useStationBooking(refetch);

  // Station selection (for future map integration)
  const { selectedStation, selectStation } = useStationSelection();

  // Calculate statistics
  const stats = getStationsStats(stations);

  // Handle booking
  const handleBook = async (stationId) => {
    await bookStation(stationId);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="driver">
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          color: '#FFFFFF' 
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '15px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            🗺️
          </div>
          <p style={{ fontSize: '1.125rem' }}>Đang tải bản đồ trạm...</p>
          <style>
            {`
              @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
              }
            `}
          </style>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout role="driver">
        <div style={{ 
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
            <h3 style={{ color: '#ff6b6b', marginBottom: '10px' }}>
              Lỗi tải dữ liệu
            </h3>
            <p style={{ color: '#ff6b6b', marginBottom: '20px' }}>
              {error}
            </p>
            <button
              onClick={refetch}
              style={{
                padding: '10px 20px',
                background: '#19c37d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Thử lại
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <StationsMapHeader />

        {/* Statistics */}
        {stations.length > 0 && (
          <StationsStats stats={stats} />
        )}

        {/* Stations List */}
        <StationsList
          stations={stations}
          onBook={handleBook}
          booking={booking}
          onSelect={selectStation}
        />

        {/* Debug info for selected station */}
        {selectedStation && import.meta.env.VITE_ENABLE_DEBUG === 'true' && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(255, 165, 0, 0.1)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '10px',
            color: '#ffa500',
            fontSize: '0.875rem'
          }}>
            <strong>🔧 Selected Station:</strong> {selectedStation.name}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StationsMap;
