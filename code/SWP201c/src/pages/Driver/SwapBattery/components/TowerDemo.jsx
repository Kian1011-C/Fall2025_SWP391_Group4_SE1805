// Tower Demo Component - Hiển thị dữ liệu thật từ API
import React, { useState, useEffect } from 'react';
import { stationService } from '../../../../assets/js/services/index.js';

const TowerDemo = () => {
  const [towers, setTowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStationId, setSelectedStationId] = useState(1); // Default station ID

  // Fetch towers from API
  useEffect(() => {
    const fetchTowers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await stationService.getTowersByStation(selectedStationId);
        
        if (response.success && response.data) {
          setTowers(Array.isArray(response.data) ? response.data : []);
        } else {
          setError(response.message || 'Không thể tải dữ liệu trụ');
          setTowers([]);
        }
      } catch (err) {
        console.error('Error fetching towers:', err);
        setError('Lỗi khi tải dữ liệu trụ');
        setTowers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTowers();
  }, [selectedStationId]);

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          🔌 Demo Tower API Response Format
        </h3>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#666' }}>Đang tải dữ liệu trụ từ API...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          🔌 Demo Tower API Response Format
        </h3>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
          <p style={{ color: '#f44336', marginBottom: '16px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              background: '#19c37d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>
        🔌 Demo Tower API Response Format (Dữ liệu thật từ API)
      </h3>
      
      <div style={{ marginBottom: '20px', padding: '12px', background: '#e3f2fd', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#1976d2' }}>
            📍 Trạm ID: {selectedStationId}
          </p>
          <select 
            value={selectedStationId} 
            onChange={(e) => setSelectedStationId(parseInt(e.target.value))}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '12px'
            }}
          >
            <option value={1}>Trạm 1</option>
            <option value={2}>Trạm 2</option>
            <option value={3}>Trạm 3</option>
            <option value={4}>Trạm 4</option>
            <option value={5}>Trạm 5</option>
          </select>
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          🔌 {towers.length} trụ sạc • 
          🔋 {towers.reduce((sum, t) => sum + (t.availableBatteries || 0), 0)} pin khả dụng • 
          📊 SOH TB: {towers.length > 0 ? Math.round(towers.reduce((sum, t) => sum + (t.averageSOH || 0), 0) / towers.length) : 0}%
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px'
        }}
      >
        {towers.map((tower) => (
          <div
            key={tower.id}
            style={{
              padding: '24px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              background: '#fff',
              cursor: tower.status === 'active' ? 'pointer' : 'not-allowed',
              opacity: tower.status === 'maintenance' ? 0.5 : 1,
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {tower.status === 'active' ? '🔌' : '⚠️'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
              Trụ {tower.towerNumber}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: tower.status === 'active' ? '#19c37d' : '#ffa500',
                fontWeight: '500'
              }}
            >
              {tower.status === 'active' ? '✓ Sẵn sàng' : '⏳ Bảo trì'}
            </div>
            {tower.status === 'active' && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                <div>🔋 {tower.availableBatteries}/{tower.totalSlots} pin</div>
                <div>📊 SOH TB: {tower.averageSOH}%</div>
                <div>⭐ SOH tốt nhất: {tower.bestBatterySOH}%</div>
                {tower.recommendedSlots && tower.recommendedSlots.length > 0 && (
                  <div style={{ marginTop: '4px', padding: '4px', background: '#e8f5e8', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#2e7d32', fontWeight: '600' }}>
                      💡 Khuyến nghị: {tower.recommendedSlots.length} slot
                    </div>
                    {tower.recommendedSlots.slice(0, 2).map((slot, idx) => (
                      <div key={idx} style={{ fontSize: '10px', color: '#4caf50' }}>
                        Slot {slot.slotId}: SOH {slot.batterySOH}%
                      </div>
                    ))}
                    {tower.recommendedSlots.length > 2 && (
                      <div style={{ fontSize: '10px', color: '#666' }}>
                        +{tower.recommendedSlots.length - 2} khác
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f0f8ff', borderRadius: '8px' }}>
        <h4 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>📋 Raw API Response (Dữ liệu thật)</h4>
        <pre style={{ 
          fontSize: '12px', 
          color: '#333', 
          background: '#fff', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '300px'
        }}>
{JSON.stringify(towers, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f0f8ff', borderRadius: '8px' }}>
        <h4 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>📋 API Endpoint</h4>
        <div style={{ fontSize: '12px', color: '#333', background: '#fff', padding: '10px', borderRadius: '4px' }}>
          <strong>GET</strong> /api/driver/towers?stationId={selectedStationId}
        </div>
      </div>
    </div>
  );
};

export default TowerDemo;
