// Driver/StationsMap/components/StationsMapView.jsx
// Component hiển thị Leaflet Map với các trạm đổi pin - KHÔNG CẦN API KEY!

import React, { useMemo, useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icon
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = defaultIcon;


// 4 trạm mẫu ở Hà Nội
const MOCK_STATIONS = [
  {
    id: 1,
    name: 'Trạm Cầu Giấy',
    address: '128 Xuân Thủy, Cầu Giấy, Hà Nội',
    lat: 21.0380,
    lng: 105.7970,
    status: 'active',
    availableSlots: 8,
    totalSlots: 12
  },
  {
    id: 2,
    name: 'Trạm Hoàn Kiếm',
    address: '52 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    lat: 21.0245,
    lng: 105.8412,
    status: 'active',
    availableSlots: 5,
    totalSlots: 10
  },
  {
    id: 3,
    name: 'Trạm Hai Bà Trưng',
    address: '200 Bà Triệu, Hai Bà Trưng, Hà Nội',
    lat: 21.0100,
    lng: 105.8500,
    status: 'active',
    availableSlots: 10,
    totalSlots: 15
  },
  {
    id: 4,
    name: 'Trạm Đống Đa',
    address: '89 Láng Hạ, Đống Đa, Hà Nội',
    lat: 21.0200,
    lng: 105.8100,
    status: 'active',
    availableSlots: 3,
    totalSlots: 8
  }
];

// Custom marker icon cho trạm
const createStationIcon = (available) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${available ? '#10b981' : '#ef4444'};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      ">
        
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

const StationsMapView = ({ stations = [], onStationSelect }) => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [myLocation, setMyLocation] = useState(null);
  const [locError, setLocError] = useState(null);

  // Sử dụng stations từ backend, nếu không có thì dùng mock data
  const stationsData = useMemo(() => {
    console.log(' StationsMapView - Raw stations từ props:', stations);
    console.log(' Stations length:', stations?.length);
    
    if (stations && stations.length > 0) {
      // Log structure của station đầu tiên
      const firstStation = stations[0];
      console.log(' First station FULL object:', firstStation);
      console.log(' First station KEYS:', Object.keys(firstStation));
      console.log(' Checking lat/lng fields:', {
        latitude: firstStation.latitude,
        longitude: firstStation.longitude,
        lat: firstStation.lat,
        lng: firstStation.lng,
        location: firstStation.location,
        coordinates: firstStation.coordinates
      });
      
      const mapped = stations.map(station => {
        const result = {
          id: station.id || station.stationId,
          name: station.name || station.stationName,
          address: station.address,
          lat: station.latitude || station.lat || station.location?.lat,
          lng: station.longitude || station.lng || station.location?.lng,
          status: station.status,
          availableSlots: station.availableSlots,
          totalSlots: station.totalSlots
        };
        console.log(' Mapping station:', station.name, '→', result);
        return result;
      }).filter(s => {
        const hasCoords = !!(s.lat && s.lng);
        if (!hasCoords) {
          console.log(' Filtered out (no coords):', s.name, 'lat:', s.lat, 'lng:', s.lng);
        }
        return hasCoords;
      });
      
      console.log(' Mapped stations with coords:', mapped);
      return mapped;
    }
    
    console.log(' Không có backend data, sử dụng MOCK_STATIONS');
    return MOCK_STATIONS;
  }, [stations]);

  console.log(' Final stationsData:', stationsData);
  console.log(' Số lượng trạm sẽ render:', stationsData.length);
  
  // Log chi tiết từng trạm
  stationsData.forEach((station, index) => {
    console.log(` Station ${index + 1}/${stationsData.length}:`, {
      id: station.id,
      name: station.name,
      lat: station.lat,
      lng: station.lng,
      status: station.status,
      availableSlots: station.availableSlots,
      hasValidCoords: !!(station.lat && station.lng)
    });
  });

  // Tính center của map
  const mapCenter = useMemo(() => {
    if (myLocation) return [myLocation.lat, myLocation.lng];
    if (stationsData.length === 0) return [21.0285, 105.8542]; // Hà Nội
    const avgLat = stationsData.reduce((sum, s) => sum + s.lat, 0) / stationsData.length;
    const avgLng = stationsData.reduce((sum, s) => sum + s.lng, 0) / stationsData.length;
    return [avgLat, avgLng];
  }, [stationsData, myLocation]);

  // Lấy vị trí hiện tại của Driver (trình duyệt)
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocError('Trình duyệt không hỗ trợ định vị.');
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMyLocation({ lat: latitude, lng: longitude, accuracy: pos.coords.accuracy });
      },
      (err) => {
        console.warn(' Không thể lấy vị trí:', err);
        setLocError(err.message || 'Không thể lấy vị trí');
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(watchId);
  }, []);

  // Chuyển đến trang đổi pin
  const handleSwapBattery = (station) => {
    navigate('/driver/swap-battery', { 
      state: { 
        selectedStation: station,
        stationId: station.id,
        stationName: station.name 
      } 
    });
  };

  // Chỉ đường bằng Google Maps (mở app/web)
  const handleGetDirections = (station) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div style={styles.container}>
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={styles.mapContainer}
        scrollWheelZoom={true}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        {/* Tile Layer - Bản đồ từ OpenStreetMap (MIỄN PHÍ) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Vị trí hiện tại của Driver */}
        {myLocation && (
          <>
            <Marker position={[myLocation.lat, myLocation.lng]}>
              <Popup>Tôi đang ở đây</Popup>
            </Marker>
            <Circle center={[myLocation.lat, myLocation.lng]} radius={myLocation.accuracy || 50} pathOptions={{ color: '#3b82f6', fillColor: '#60a5fa', fillOpacity: 0.2 }}/>
          </>
        )}

        {/* Markers cho các trạm */}
        {stationsData.map((station) => {
          console.log(` Rendering marker ${station.id}:`, station.name, `[${station.lat}, ${station.lng}]`);
          
          return (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={createStationIcon(station.availableSlots > 0)}
            >
            <Popup maxWidth={300}>
              <div style={styles.popup}>
                <h3 style={styles.popupTitle}>{station.name}</h3>
                <p style={styles.popupAddress}> {station.address}</p>
                
                <div style={styles.popupStats}>
                  <span style={{
                    ...styles.slotBadge,
                    background: station.availableSlots > 5 ? '#d1fae5' : 
                               station.availableSlots > 0 ? '#fef3c7' : '#fee2e2',
                    color: station.availableSlots > 5 ? '#065f46' : 
                           station.availableSlots > 0 ? '#92400e' : '#991b1b'
                  }}>
                     Còn: <strong>{station.availableSlots}/{station.totalSlots}</strong> slot
                  </span>
                </div>

                <div style={styles.popupButtons}>
                  <button
                    onClick={() => handleGetDirections(station)}
                    style={styles.directionsBtn}
                  >
                     Chỉ đường
                  </button>
                  <button
                    onClick={() => handleSwapBattery(station)}
                    style={{
                      ...styles.swapBtn,
                      opacity: station.availableSlots === 0 ? 0.5 : 1,
                      cursor: station.availableSlots === 0 ? 'not-allowed' : 'pointer'
                    }}
                    disabled={station.availableSlots === 0}
                  >
                     Sẵn sàng Đổi Pin
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
          );
        })}
      </MapContainer>
      {/* Nút về vị trí của tôi */}
      <button
        onClick={() => {
          if (myLocation && mapRef.current) {
            mapRef.current.setView([myLocation.lat, myLocation.lng], 15, { animate: true });
          }
        }}
        style={styles.locateBtn}
        title={locError || 'Về vị trí của tôi'}
      >
         Vị trí của tôi
      </button>
      
      {/* Debug Info Overlay */}
      <div style={styles.debugOverlay}>
        <div style={styles.debugTitle}> Map Debug Info</div>
        <div style={styles.debugItem}>
           Center: [{mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)}]
        </div>
        <div style={styles.debugItem}>
           Stations: {stationsData.length}
        </div>
        <div style={styles.debugItem}>
           Data source: {stations.length > 0 ? 'Backend API' : 'MOCK_STATIONS'}
        </div>
        {stationsData.slice(0, 3).map((s, i) => (
          <div key={s.id} style={styles.debugItem}>
            {i + 1}. {s.name} [{s.lat?.toFixed(4)}, {s.lng?.toFixed(4)}]
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '600px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  mapContainer: {
    width: '100%',
    height: '100%'
  },
  popup: {
    padding: '8px',
    minWidth: '250px'
  },
  popupTitle: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  popupAddress: {
    margin: '0 0 12px 0',
    fontSize: '13px',
    color: '#64748b'
  },
  popupStats: {
    marginBottom: '12px'
  },
  slotBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500'
  },
  popupButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px'
  },
  directionsBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background 0.2s'
  },
  swapBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background 0.2s'
  },
  debugOverlay: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: '#fff',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '11px',
    maxWidth: '300px',
    zIndex: 1000,
    fontFamily: 'monospace',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
  },
  debugTitle: {
    fontWeight: 'bold',
    fontSize: '13px',
    marginBottom: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
    paddingBottom: '8px'
  },
  debugItem: {
    marginBottom: '5px',
    lineHeight: '1.6'
  },
  locateBtn: {
    position: 'absolute',
    left: '10px',
    top: '10px',
    zIndex: 1000,
    background: '#1f2937',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer'
  }
};

export default StationsMapView;
