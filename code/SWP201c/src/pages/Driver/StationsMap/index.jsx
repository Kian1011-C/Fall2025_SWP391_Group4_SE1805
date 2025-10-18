// Driver/StationsMap/index.jsx
// Container component for StationsMap page - orchestrates stations display and booking

import { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useStationsData, useStationBooking, useStationSelection } from './hooks';
import { getStationsStats } from './utils';
import {
  StationsMapHeader,
  StationsList,
  StationsStats,
  StationDetail,
  MapView
} from './components';

const StationsMap = () => {
  // Data fetching
  const { stations, loading, error, refetch } = useStationsData();

  // Booking handling
  const { bookStation, booking } = useStationBooking(refetch);

  // Station selection (for future map integration)
  const { selectedStation, selectStation } = useStationSelection();

  // Station detail modal state
  const [selectedStationId, setSelectedStationId] = useState(null);
  
  // View mode state (list or map)
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  
  // Selected station for map highlighting
  const [highlightedStation, setHighlightedStation] = useState(null);

  // Calculate statistics
  const stats = getStationsStats(stations);
  
  // Debug log for stations data
  console.log('🏢 StationsMap - Stations data:', stations);
  console.log('🏢 StationsMap - Stations count:', stations?.length || 0);
  if (stations && stations.length > 0) {
    console.log('🏢 StationsMap - All stations info:', stations.map(s => ({
      id: s.id,
      name: s.name || s.stationName,
      lat: s.latitude || s.lat,
      lng: s.longitude || s.lng,
      status: s.status,
      hasCoords: !!(s.latitude || s.lat) && !!(s.longitude || s.lng)
    })));
  }

  // Handle booking
  const handleBook = async (stationId) => {
    await bookStation(stationId);
  };

  // Handle view detail
  const handleViewDetail = (stationId) => {
    setSelectedStationId(stationId);
  };

  // Handle close detail
  const handleCloseDetail = () => {
    setSelectedStationId(null);
  };

  // Handle station selection from map
  const handleMapStationSelect = (station) => {
    setSelectedStationId(station.id || station.stationId);
  };

  // Handle go to station from detail modal
  const handleGoToStation = (station) => {
    setHighlightedStation(station);
    setViewMode('map');
    setSelectedStationId(null); // Close detail modal
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

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          gap: '10px'
        }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '12px 24px',
              background: viewMode === 'list' ? '#007bff' : 'rgba(255, 255, 255, 0.1)',
              color: viewMode === 'list' ? '#fff' : '#ccc',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📋 Danh sách
          </button>
          <button
            onClick={() => setViewMode('map')}
            style={{
              padding: '12px 24px',
              background: viewMode === 'map' ? '#007bff' : 'rgba(255, 255, 255, 0.1)',
              color: viewMode === 'map' ? '#fff' : '#ccc',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🗺️ Bản đồ
          </button>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'list' ? (
          <StationsList
            stations={stations}
            onBook={handleBook}
            booking={booking}
            onSelect={selectStation}
            onViewDetail={handleViewDetail}
          />
        ) : (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: '#FFFFFF',
              marginBottom: '20px',
              fontSize: '1.2rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              🗺️ Bản đồ các trạm sạc tại Việt Nam
            </h3>
            <MapView
              stations={stations}
              onStationSelect={handleMapStationSelect}
              highlightedStation={highlightedStation}
            />
          </div>
        )}

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

        {/* Station Detail Modal */}
        {selectedStationId && (
          <StationDetail
            stationId={selectedStationId}
            onClose={handleCloseDetail}
            onGoToStation={handleGoToStation}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default StationsMap;
