// Driver/StationsMap/components/MapView.jsx
// Interactive map component showing stations in Vietnam

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different station statuses
const createCustomIcon = (status, isHighlighted = false) => {
  const color = status === 'Hoạt động' || status === 'active' ? '#19c37d' : 
                status === 'Bảo trì' || status === 'maintenance' ? '#ffa500' : '#ff6b6b';
  
  const size = isHighlighted ? 30 : 20;
  const borderWidth = isHighlighted ? 4 : 2;
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: ${borderWidth}px solid ${isHighlighted ? '#007bff' : 'white'};
        box-shadow: ${isHighlighted ? '0 4px 12px rgba(0, 123, 255, 0.6)' : '0 2px 4px rgba(0,0,0,0.3)'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${isHighlighted ? '16px' : '12px'};
        font-weight: bold;
        animation: ${isHighlighted ? 'pulse 2s infinite' : 'none'};
      ">
        ${isHighlighted ? '🔋' : '⚡'}
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

// Component to fit map bounds to show all stations
const FitBounds = ({ stations }) => {
  const map = useMap();
  
  useEffect(() => {
    if (stations && stations.length > 0) {
      const bounds = L.latLngBounds(
        stations.map((station, index) => {
          const baseLat = 21.0285;
          const baseLng = 105.8542;
          const offset = 0.01; // ~1km offset
          
          const lat = station.latitude || station.lat || (baseLat + (index * offset));
          const lng = station.longitude || station.lng || (baseLng + (index * offset));
          
          return [lat, lng];
        })
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [stations, map]);
  
  return null;
};

const MapView = ({ stations, onStationSelect, highlightedStation }) => {
  const [mapCenter, setMapCenter] = useState([21.0285, 105.8542]); // Hanoi coordinates

  // Debug log for stations data
  useEffect(() => {
    console.log('🗺️ MapView received stations:', stations);
    console.log('🗺️ Stations count:', stations?.length || 0);
    if (stations && stations.length > 0) {
      console.log('🗺️ First station data:', stations[0]);
      console.log('🗺️ All stations coordinates:', stations.map(s => ({
        name: s.name || s.stationName,
        lat: s.latitude || s.lat,
        lng: s.longitude || s.lng,
        hasCoords: !!(s.latitude || s.lat) && !!(s.longitude || s.lng)
      })));
    }
  }, [stations]);

  // Update map center when stations change
  useEffect(() => {
    if (stations && stations.length > 0) {
      // Calculate center point of all stations
      const validStations = stations.filter(s => (s.latitude || s.lat) && (s.longitude || s.lng));
      console.log('🗺️ Valid stations with coordinates:', validStations.length);
      if (validStations.length > 0) {
        const avgLat = validStations.reduce((sum, s) => sum + (s.latitude || s.lat), 0) / validStations.length;
        const avgLng = validStations.reduce((sum, s) => sum + (s.longitude || s.lng), 0) / validStations.length;
        setMapCenter([avgLat, avgLng]);
        console.log('🗺️ Map center set to:', [avgLat, avgLng]);
      }
    }
  }, [stations]);

  const handleMarkerClick = (station) => {
    if (onStationSelect) {
      onStationSelect(station);
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '500px', 
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }}>
      <MapContainer
        center={mapCenter}
        zoom={10}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Fit bounds to show all stations */}
        <FitBounds stations={stations} />
        
        {/* Render station markers */}
        {stations && stations.map((station, index) => {
          // Create different coordinates for each station to avoid overlapping
          const baseLat = 21.0285;
          const baseLng = 105.8542;
          const offset = 0.01; // ~1km offset
          
          const lat = station.latitude || station.lat || (baseLat + (index * offset));
          const lng = station.longitude || station.lng || (baseLng + (index * offset));
          const isHighlighted = highlightedStation && 
            (highlightedStation.id === station.id || 
             highlightedStation.stationId === station.stationId ||
             highlightedStation.name === station.name);
          
          // Debug log for each station
          console.log(`🗺️ Rendering station ${index + 1}:`, {
            id: station.id,
            name: station.name || station.stationName,
            lat: lat,
            lng: lng,
            status: station.status,
            isHighlighted: isHighlighted,
            hasOriginalCoords: !!(station.latitude || station.lat)
          });
          
          return (
            <Marker
              key={station.id || index}
              position={[lat, lng]}
              icon={createCustomIcon(station.status, isHighlighted)}
              eventHandlers={{
                click: () => handleMarkerClick(station)
              }}
            >
              <Popup>
                <div style={{ 
                  minWidth: '200px',
                  padding: '10px',
                  fontFamily: 'Arial, sans-serif'
                }}>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    {station.stationName || station.name}
                  </h3>
                  
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    📍 {station.address}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: station.status === 'Hoạt động' || station.status === 'active' ? '#e8f5e8' : 
                                     station.status === 'Bảo trì' || station.status === 'maintenance' ? '#fff3cd' : '#f8d7da',
                      color: station.status === 'Hoạt động' || station.status === 'active' ? '#19c37d' : 
                             station.status === 'Bảo trì' || station.status === 'maintenance' ? '#ffa500' : '#ff6b6b'
                    }}>
                      {station.status === 'Hoạt động' || station.status === 'active' ? 'Đang hoạt động' :
                       station.status === 'Bảo trì' || station.status === 'maintenance' ? 'Bảo trì' : 'Ngưng hoạt động'}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '8px',
                    fontSize: '12px',
                    color: '#555'
                  }}>
                    <div>
                      <strong>Slots:</strong> {station.availableSlots || 0}/{station.totalSlots || 0}
                    </div>
                    <div>
                      <strong>Giờ:</strong> {station.operatingHours || '24/7'}
                    </div>
                  </div>
                  
                  {onStationSelect && (
                    <button
                      onClick={() => handleMarkerClick(station)}
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        padding: '8px 12px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#0056b3'}
                      onMouseLeave={(e) => e.target.style.background = '#007bff'}
                    >
                      🔍 Xem chi tiết
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

MapView.propTypes = {
  stations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    stationName: PropTypes.string,
    address: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    lat: PropTypes.number,
    lng: PropTypes.number,
    status: PropTypes.string,
    availableSlots: PropTypes.number,
    totalSlots: PropTypes.number,
    operatingHours: PropTypes.string
  })).isRequired,
  onStationSelect: PropTypes.func,
  highlightedStation: PropTypes.object
};

export default MapView;
