// Admin Battery Management
// Manage battery fleet and lifecycle

import React, { useState, useEffect } from 'react';
import batteryService from '../../assets/js/services/batteryService';
import DashboardLayout from '../../layouts/DashboardLayout';

const AdminBatteries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch batteries from API
  const [batteries, setBatteries] = useState([]);

  useEffect(() => {
    fetchBatteries();
  }, []);

  const fetchBatteries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await batteryService.getAllBatteries();
      
      if (result.success) {
        setBatteries(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu pin');
    } finally {
      setLoading(false);
    }
  };

  // Old mock data removed - Now using API from fetchBatteries()

  const getStatusLabel = (status) => {
    const statusMap = {
      'available': 'Sẵn sàng',
      'charging': 'Đang sạc',
      'in-use': 'Đang sử dụng',
      'maintenance': 'Bảo trì',
      'low-battery': 'Pin yếu',
      'faulty': 'Hỏng hóc'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'available': '#27ae60',
      'charging': '#f39c12',
      'in-use': '#3498db',
      'maintenance': '#9b59b6',
      'low-battery': '#e67e22',
      'faulty': '#e74c3c'
    };
    return colorMap[status] || '#95a5a6';
  };

  const getHealthColor = (health) => {
    if (health >= 80) return '#27ae60';
    if (health >= 60) return '#f39c12';
    return '#e74c3c';
  };

  const getChargeColor = (charge) => {
    if (charge >= 60) return '#27ae60';
    if (charge >= 30) return '#f39c12';
    return '#e74c3c';
  };

  const filteredBatteries = batteries.filter(battery => {
    const matchesSearch = battery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         battery.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         battery.station.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || battery.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: batteries.length,
    available: batteries.filter(b => b.status === 'available').length,
    charging: batteries.filter(b => b.status === 'charging').length,
    inUse: batteries.filter(b => b.status === 'in-use').length,
    maintenance: batteries.filter(b => b.status === 'maintenance').length,
    avgHealth: Math.round(batteries.reduce((sum, b) => sum + b.health, 0) / batteries.length)
  };

  const handleDeleteBattery = async (batteryId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa pin này?')) {
      try {
        // Note: Cần implement DELETE API endpoint
        alert('Chức năng xóa pin cần backend implement endpoint DELETE /api/batteries/{id}');
        // const result = await batteryService.deleteBattery(batteryId);
        // if (result.success) {
        //   fetchBatteries();
        // }
      } catch (error) {
        alert('Có lỗi xảy ra!');
      }
    }
  };

  const handleMaintenanceBattery = async (batteryId) => {
    try {
      const result = await batteryService.scheduleBatteryMaintenance(batteryId, new Date().toISOString());
      
      if (result.success) {
        alert('Đã lên lịch bảo trì pin!');
        fetchBatteries();
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#FFFFFF' }}>
        <h2>Đang tải dữ liệu pin...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
        <h2>Lỗi: {error}</h2>
        <button onClick={fetchBatteries} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '10px' }}>🔋 Quản lý kho pin</h1>
        <p style={{ color: '#E0E0E0' }}>Quản lý toàn bộ hệ thống pin và chu kỳ sống của pin</p>
      </div>

      {/* Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px' 
      }}>
        {[
          { label: 'Tổng số pin', value: stats.total, color: '#6ab7ff' },
          { label: 'Sẵn sàng', value: stats.available, color: '#27ae60' },
          { label: 'Đang sạc', value: stats.charging, color: '#f39c12' },
          { label: 'Đang dùng', value: stats.inUse, color: '#3498db' },
          { label: 'Bảo trì', value: stats.maintenance, color: '#9b59b6' },
          { label: 'Sức khỏe TB', value: `${stats.avgHealth}%`, color: '#19c37d' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo mã pin, số seri hoặc trạm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '300px',
            padding: '12px 16px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            fontSize: '14px'
          }}
        />

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            fontSize: '14px'
          }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="available">Sẵn sàng</option>
          <option value="charging">Đang sạc</option>
          <option value="in-use">Đang sử dụng</option>
          <option value="maintenance">Bảo trì</option>
          <option value="low-battery">Pin yếu</option>
          <option value="faulty">Hỏng hóc</option>
        </select>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ➕ Thêm pin
        </button>
      </div>

      {/* Battery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {filteredBatteries.map(battery => (
          <div key={battery.id} style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {/* Battery Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#FFFFFF' }}>{battery.id}</div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                backgroundColor: getStatusColor(battery.status),
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                {getStatusLabel(battery.status)}
              </span>
            </div>

            {/* Battery Info */}
            <div style={{ marginBottom: '15px' }}>
              {[
                { label: 'Số seri:', value: battery.serialNumber },
                { label: 'Trạm:', value: battery.station },
                { label: 'Dung lượng:', value: `${battery.capacity} kWh` }
              ].map((info, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>{info.label}</span>
                  <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{info.value}</span>
                </div>
              ))}
            </div>

            {/* Battery Metrics */}
            <div style={{ marginBottom: '15px' }}>
              {/* Current Charge */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '0.85rem', color: '#B0B0B0', marginBottom: '5px' }}>Pin hiện tại</div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '4px', 
                  overflow: 'hidden',
                  marginBottom: '5px'
                }}>
                  <div style={{
                    width: `${battery.currentCharge}%`,
                    height: '100%',
                    backgroundColor: getChargeColor(battery.currentCharge),
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#FFFFFF', textAlign: 'right' }}>
                  {battery.currentCharge}%
                </div>
              </div>

              {/* Health */}
              <div>
                <div style={{ fontSize: '0.85rem', color: '#B0B0B0', marginBottom: '5px' }}>Sức khỏe pin</div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '4px', 
                  overflow: 'hidden',
                  marginBottom: '5px'
                }}>
                  <div style={{
                    width: `${battery.health}%`,
                    height: '100%',
                    backgroundColor: getHealthColor(battery.health),
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#FFFFFF', textAlign: 'right' }}>
                  {battery.health}%
                </div>
              </div>
            </div>

            {/* Battery Details */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px'
            }}>
              {[
                { icon: '🔄', value: battery.cycleCount, label: 'chu kỳ' },
                { icon: '🌡️', value: `${battery.temperature}°C`, label: '' },
                { icon: '📅', value: battery.manufactureDate.split('-')[0], label: '' }
              ].map((detail, index) => (
                <div key={index} style={{ textAlign: 'center', fontSize: '0.85rem', color: '#FFFFFF' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{detail.icon}</div>
                  <div>{detail.value} {detail.label}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={() => handleMaintenanceBattery(battery.id)}
                style={{
                  padding: '8px 16px',
                  background: '#9b59b6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                🔧 Bảo trì
              </button>
              <button
                onClick={() => handleDeleteBattery(battery.id)}
                style={{
                  padding: '8px 16px',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                🗑️ Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Battery Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '500px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: '#FFFFFF', marginBottom: '20px' }}>Thêm pin mới</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text"
                placeholder="Mã pin (BAT-001)"
                style={{
                  padding: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF'
                }}
              />
              <input
                type="text"
                placeholder="Số seri (LI2024001)"
                style={{
                  padding: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF'
                }}
              />
              <input
                type="number"
                placeholder="Dung lượng (kWh)"
                style={{
                  padding: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF'
                }}
              />
              <select
                style={{
                  padding: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF'
                }}
              >
                <option value="Trạm Quận 1">Trạm Quận 1</option>
                <option value="Trạm Quận 3">Trạm Quận 3</option>
                <option value="Trạm Bình Thạnh">Trạm Bình Thạnh</option>
                <option value="Trạm Phú Nhuận">Trạm Phú Nhuận</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default AdminBatteries;