// Staff Battery Inventory Management
// Track and update battery status (in use, charging, damaged)

import React, { useState, useEffect } from 'react';
import batteryService from '../../assets/js/services/batteryService';
import DashboardLayout from '../../layouts/DashboardLayout';

// Temporary darkTheme object (darkTheme.js file not found)
const darkTheme = {
  colors: { primary: '#4f46e5', secondary: '#6b7280', text: '#1f2937' },
  components: {
    pageHeader: { marginBottom: '24px' },
    pageTitle: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937' },
    pageSubtitle: { fontSize: '14px', color: '#6b7280', marginTop: '8px' },
    statsCard: { padding: '20px', borderRadius: '8px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    card: { padding: '20px', borderRadius: '8px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
  }
};
const buttonHoverEffects = (e) => { e.target.style.opacity = '0.8'; };
const buttonLeaveEffects = (e) => { e.target.style.opacity = '1'; };

const StaffBatteryInventory = () => {
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBatteries();
  }, []);

  const fetchBatteries = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await batteryService.getAllBatteries();
      
      if (result.success) {
        setBatteries(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu pin');
    } finally {
      setLoading(false);
    }
  };

  const oldMockBatteries = [
    {
      id: 1,
      batteryId: "BAT-001",
      stationId: 1,
      stationName: "Trạm đổi pin Quận 1",
      status: "Đang sạc",
      capacity: "72V 45Ah",
      health: 92,
      cycles: 156,
      temperature: 28,
      voltage: 72.2,
      lastSwap: "2024-01-15 14:30",
      nextMaintenance: "2024-02-15"
    },
    {
      id: 2,
      batteryId: "BAT-002",
      stationId: 1,
      stationName: "Trạm đổi pin Quận 1",
      status: "Sẵn sàng",
      capacity: "60V 50Ah",
      health: 96,
      cycles: 89,
      temperature: 26,
      voltage: 60.5,
      lastSwap: "2024-01-14 16:45",
      nextMaintenance: "2024-03-14"
    },
    {
      id: 3,
      batteryId: "BAT-003",
      stationId: 2,
      stationName: "Trạm đổi pin Quận 3",
      status: "Hỏng",
      capacity: "48V 24Ah",
      health: 45,
      cycles: 203,
      temperature: 35,
      voltage: 47.8,
      lastSwap: "2024-01-10 09:15",
      nextMaintenance: "Cần sửa chữa"
    },
    {
      id: 4,
      batteryId: "BAT-004",
      stationId: 3,
      stationName: "Trạm đổi pin Quận 7",
      status: "Đang dùng",
      capacity: "72V 45Ah",
      health: 88,
      cycles: 178,
      temperature: 30,
      voltage: 71.8,
      lastSwap: "2024-01-15 10:20",
      nextMaintenance: "2024-02-20"
    },
    {
      id: 5,
      batteryId: "BAT-005",
      stationId: 3,
      stationName: "Trạm đổi pin Quận 7",
      status: "Sẵn sàng",
      capacity: "60V 50Ah",
      health: 94,
      cycles: 112,
      temperature: 27,
      voltage: 60.2,
      lastSwap: "2024-01-13 18:30",
      nextMaintenance: "2024-03-13"
    }
  ];

  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterStation, setFilterStation] = useState('Tất cả');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    health: 0,
    temperature: 0,
    voltage: 0
  });

  const stations = [...new Set(batteries.map(b => b.stationName))];
  const statusOptions = ['Sẵn sàng', 'Đang sạc', 'Đang dùng', 'Hỏng', 'Bảo trì'];

  const filteredBatteries = batteries.filter(battery => {
    const statusMatch = filterStatus === 'Tất cả' || battery.status === filterStatus;
    const stationMatch = filterStation === 'Tất cả' || battery.stationName === filterStation;
    return statusMatch && stationMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sẵn sàng': return '#19c37d';
      case 'Đang sạc': return '#6ab7ff';
      case 'Đang dùng': return '#ffa500';
      case 'Hỏng': return '#ff4757';
      case 'Bảo trì': return '#9c88ff';
      default: return '#6c757d';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 90) return '#19c37d';
    if (health >= 70) return '#ffa500';
    return '#ff4757';
  };

  const handleUpdateBattery = async () => {
    try {
      setLoading(true);
      // Note: Backend cần API PUT /api/batteries/:id để update battery info
      alert('Backend cần implement API PUT /api/batteries/:id');
      
      // Tạm thời update local state
      setBatteries(batteries.map(battery => 
        battery.id === selectedBattery.id 
          ? { ...battery, ...updateData }
          : battery
      ));
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setShowUpdateModal(false);
      setSelectedBattery(null);
      setUpdateData({ status: '', health: 0, temperature: 0, voltage: 0 });
      setLoading(false);
    }
  };

  const openUpdateModal = (battery) => {
    setSelectedBattery(battery);
    setUpdateData({
      status: battery.status,
      health: battery.health,
      temperature: battery.temperature,
      voltage: battery.voltage
    });
    setShowUpdateModal(true);
  };

  const getStatusStats = () => {
    const stats = {
      'Sẵn sàng': 0,
      'Đang sạc': 0,
      'Đang dùng': 0,
      'Hỏng': 0,
      'Bảo trì': 0
    };
    batteries.forEach(battery => {
      stats[battery.status] = (stats[battery.status] || 0) + 1;
    });
    return stats;
  };

  const stats = getStatusStats();

  return (
    <DashboardLayout role="staff">
      <div className="staff-battery-inventory" style={{ padding: '20px' }}>
        <div className="page-header" style={darkTheme.components.pageHeader}>
        <h1 style={darkTheme.components.pageTitle}>🔋 Quản lý kho pin</h1>
        <p style={darkTheme.components.pageSubtitle}>Theo dõi và cập nhật trạng thái pin trong hệ thống</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        {Object.entries(stats).map(([status, count]) => (
          <div key={status} style={darkTheme.components.statsCard}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(status) }}>
              {count}
            </div>
            <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
              {status}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters" style={{ 
        ...darkTheme.components.card,
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={darkTheme.components.label}>Lọc theo trạng thái:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                border: darkTheme.components.input.border,
                borderRadius: '6px',
                fontSize: '14px',
                background: darkTheme.components.input.background,
                color: darkTheme.colors.primary
              }}
            >
              <option value="Tất cả">Tất cả</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={darkTheme.components.label}>Lọc theo trạm:</label>
            <select 
              value={filterStation}
              onChange={(e) => setFilterStation(e.target.value)}
              style={{
                padding: '8px 12px',
                border: darkTheme.components.input.border,
                borderRadius: '6px',
                fontSize: '14px',
                background: darkTheme.components.input.background,
                color: darkTheme.colors.primary
              }}
            >
              <option value="Tất cả">Tất cả</option>
              {stations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Batteries Table */}
      <div className="batteries-table" style={darkTheme.components.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: darkTheme.colors.borderLight }}>
            <tr>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'left' }}>Mã pin</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'left' }}>Trạm</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Trạng thái</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Sức khỏe</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Nhiệt độ</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Điện áp</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Chu kỳ</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatteries.map(battery => (
              <tr key={battery.id} style={darkTheme.components.tableRow}>
                <td style={darkTheme.components.tableCell}>
                  <div style={{ fontWeight: 'bold', color: darkTheme.colors.primary }}>{battery.batteryId}</div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.muted }}>{battery.capacity}</div>
                </td>
                <td style={darkTheme.components.tableCell}>{battery.stationName}</td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    background: getStatusColor(battery.status)
                  }}>
                    {battery.status}
                  </span>
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    color: getHealthColor(battery.health) 
                  }}>
                    {battery.health}%
                  </div>
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center', color: darkTheme.colors.muted }}>
                  {battery.temperature}°C
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center', color: darkTheme.colors.muted }}>
                  {battery.voltage}V
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center', color: darkTheme.colors.muted }}>
                  {battery.cycles}
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center' }}>
                  <button 
                    onClick={() => openUpdateModal(battery)}
                    style={darkTheme.components.button.primary}
                    onMouseEnter={(e) => buttonHoverEffects.primary(e)}
                    onMouseLeave={(e) => buttonLeaveEffects.primary(e)}
                  >
                    ✏️ Cập nhật
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Battery Modal */}
      {showUpdateModal && selectedBattery && (
        <div className="modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '500px',
            maxWidth: '90vw'
          }}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>Cập nhật thông tin pin</h3>
              <p style={{ margin: '5px 0 0 0', color: '#7f8c8d', fontSize: '14px' }}>
                Pin: {selectedBattery.batteryId}
              </p>
            </div>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Trạng thái</label>
              <select 
                value={updateData.status}
                onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sức khỏe pin (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100"
                value={updateData.health}
                onChange={(e) => setUpdateData({...updateData, health: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nhiệt độ (°C)</label>
              <input 
                type="number" 
                value={updateData.temperature}
                onChange={(e) => setUpdateData({...updateData, temperature: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Điện áp (V)</label>
              <input 
                type="number" 
                step="0.1"
                value={updateData.voltage}
                onChange={(e) => setUpdateData({...updateData, voltage: parseFloat(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowUpdateModal(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button 
                onClick={handleUpdateBattery}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #19c37d, #15a85a)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default StaffBatteryInventory;
