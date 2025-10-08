// Driver Stations Map
// Map + booking using API

import React, { useState, useEffect } from 'react';
import stationService from '../../assets/js/services/stationService';
import DashboardLayout from '../../layouts/DashboardLayout';

const DriverStationsMap = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const result = await stationService.getAllStations();
      
      if (result.success) {
        setStations(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu trạm');
    } finally {
      setLoading(false);
    }
  };

  const handleBookStation = async (stationId) => {
    try {
      const result = await stationService.bookStation(stationId, {
        date: new Date().toISOString(),
        timeSlot: '09:00'
      });
      
      if (result.success) {
        alert('Đặt chỗ thành công!');
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: '#FFFFFF' }}>Đang tải...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: '#ff6b6b' }}>Lỗi: {error}</div>;
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px' }}>
        <h1 style={{ color: '#FFFFFF' }}>🗺️ Bản đồ trạm</h1>
      <p style={{ color: '#E0E0E0' }}>Tìm trạm gần bạn và đặt chỗ</p>
      
      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          {stations.map(station => (
            <div key={station.id} style={{
              background: 'rgba(26, 32, 44, 0.8)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ color: '#FFFFFF' }}>{station.name}</h3>
              <p style={{ color: '#E0E0E0' }}>{station.address}</p>
              <p style={{ color: '#19c37d' }}>
                {station.availableSlots || 0} slot trống
              </p>
              <button
                onClick={() => handleBookStation(station.id)}
                style={{
                  padding: '10px 20px',
                  background: '#19c37d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                📅 Đặt chỗ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default DriverStationsMap;