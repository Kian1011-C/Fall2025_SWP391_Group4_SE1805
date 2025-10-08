// Staff Battery Stock Management
// Manage battery inventory and status

import React, { useState, useEffect } from 'react';
import batteryService from '../../assets/js/services/batteryService';
import DashboardLayout from '../../layouts/DashboardLayout';

const StaffBatteryStock = () => {
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBatteryStock();
  }, []);

  const fetchBatteryStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await batteryService.getAllBatteries();
      
      if (result.success) {
        setBatteries(result.data || []);
      } else {
        setError(result.message || 'Không thể tải dữ liệu kho pin');
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu kho pin');
      console.error('Error fetching battery stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return '#19c37d';
      case 'In Use': return '#6ab7ff';
      case 'Charging': return '#ffa500';
      case 'Maintenance': return '#ff4757';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'Available': 'Sẵn sàng',
      'In Use': 'Đang dùng',
      'Charging': 'Đang sạc',
      'Maintenance': 'Bảo trì'
    };
    return labels[status] || status;
  };

  const filteredBatteries = batteries.filter(battery => {
    if (filterStatus === 'all') return true;
    return battery.status === filterStatus;
  });

  const stats = {
    total: batteries.length,
    available: batteries.filter(b => b.status === 'Available').length,
    inUse: batteries.filter(b => b.status === 'In Use').length,
    charging: batteries.filter(b => b.status === 'Charging').length,
    maintenance: batteries.filter(b => b.status === 'Maintenance').length
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>⚠️ {error}</div>
        <button 
          onClick={fetchBatteryStock}
          style={{
            marginTop: '20px',
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
    );
  }

  return (
    <DashboardLayout role="staff">
      <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>📦 Kho pin</h1>
        <p style={{ color: '#B0B0B0', margin: 0 }}>Theo dõi và quản lý tồn kho pin</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {[
          { label: 'Tổng số pin', value: stats.total, color: '#6ab7ff' },
          { label: 'Sẵn sàng', value: stats.available, color: '#19c37d' },
          { label: 'Đang dùng', value: stats.inUse, color: '#6ab7ff' },
          { label: 'Đang sạc', value: stats.charging, color: '#ffa500' },
          { label: 'Bảo trì', value: stats.maintenance, color: '#ff4757' }
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#E0E0E0', marginTop: '5px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <label style={{ color: '#E0E0E0', marginRight: '10px' }}>Lọc theo trạng thái:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            fontSize: '14px'
          }}
        >
          <option value="all">Tất cả</option>
          <option value="Available">Sẵn sàng</option>
          <option value="In Use">Đang dùng</option>
          <option value="Charging">Đang sạc</option>
          <option value="Maintenance">Bảo trì</option>
        </select>
      </div>

      {/* Battery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {filteredBatteries.map((battery) => (
          <div
            key={battery.id}
            style={{
              background: 'rgba(26, 32, 44, 0.8)',
              borderRadius: '15px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '15px' }}>
              🔋
            </div>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>
                {battery.batteryId || battery.id}
              </h3>
              <div style={{
                display: 'inline-block',
                padding: '6px 15px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                background: `${getStatusColor(battery.status)}20`,
                color: getStatusColor(battery.status),
                border: `1px solid ${getStatusColor(battery.status)}40`
              }}>
                {getStatusLabel(battery.status)}
              </div>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              color: '#E0E0E0',
              fontSize: '0.9rem'
            }}>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>SOC</div>
                <div style={{ fontWeight: '600', color: '#19c37d' }}>
                  {battery.soc || battery.chargeLevel || 0}%
                </div>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>SOH</div>
                <div style={{ fontWeight: '600', color: '#6ab7ff' }}>
                  {battery.soh || battery.health || 0}%
                </div>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>Vị trí</div>
                <div style={{ fontWeight: '600' }}>
                  {battery.stationName || battery.currentStationId || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>Chu kỳ</div>
                <div style={{ fontWeight: '600' }}>
                  {battery.cycleCount || battery.cycles || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBatteries.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#B0B0B0'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔋</div>
          <div style={{ fontSize: '1.2rem' }}>Không có pin nào</div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default StaffBatteryStock;
