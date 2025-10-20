import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import stationService from '../../../assets/js/services/stationService';

const StaffStationManagement = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await stationService.getAllStations();
      
      if (result.success) {
        setStations(result.data || []);
      } else {
        setError(result.message || 'Không thể tải danh sách trạm');
        setStations([]);
      }
    } catch (err) {
      console.error('Error fetching stations:', err);
      setError('Lỗi khi tải dữ liệu trạm');
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  // Đã loại bỏ mock data; khi lỗi sẽ hiển thị danh sách trống và thông báo lỗi

  const calculateStats = () => {
    return {
      totalStations: stations.length,
      activeStations: stations.filter(s => s.status === 'Hoạt động').length,
      totalBatteries: stations.reduce((sum, s) => sum + (s.availableBatteries || 0), 0),
      totalTransactions: stations.reduce((sum, s) => sum + (s.totalTransactions || 0), 0)
    };
  };

  if (loading) {
    return (
      <DashboardLayout role="staff">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ color: '#19c37d', fontSize: '1.2rem' }}>Đang tải dữ liệu...</div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = calculateStats();

  return (
    <DashboardLayout role="staff">
      <div style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#FFFFFF' }}>🏢 Quản lý trạm đổi pin</h2>
            <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '14px' }}>
              Theo dõi và cập nhật trạng thái các trạm đổi pin
            </p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)} 
            style={{
              padding: '12px 24px', 
              background: 'linear-gradient(135deg, #19c37d, #15a36a)',
              border: 'none', 
              borderRadius: '8px', 
              color: '#fff', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '600'
            }}
          >
            + Thêm trạm mới
          </button>
        </div>

        {error && (
          <div style={{ 
            padding: '12px 20px', 
            background: 'rgba(255, 165, 0, 0.1)', 
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '8px', 
            color: '#ffa500', 
            marginBottom: '20px' 
          }}>
            ⚠️ {error} - Đang hiển thị dữ liệu mẫu
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Tổng số trạm</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>{stats.totalStations}</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #19c37d 0%, #15a36a 100%)', padding: '24px', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Đang hoạt động</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>{stats.activeStations}</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '24px', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Pin khả dụng</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>{stats.totalBatteries}</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '24px', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Tổng giao dịch</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>{stats.totalTransactions}</div>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(26, 32, 44, 0.8)', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          border: '1px solid rgba(255, 255, 255, 0.1)' 
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontWeight: '600' }}>Tên trạm</th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontWeight: '600' }}>Địa chỉ</th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontWeight: '600' }}>Trạng thái</th>
                <th style={{ padding: '16px', textAlign: 'center', color: '#fff', fontWeight: '600' }}>Pin</th>
                <th style={{ padding: '16px', textAlign: 'center', color: '#fff', fontWeight: '600' }}>Giao dịch</th>
                <th style={{ padding: '16px', textAlign: 'center', color: '#fff', fontWeight: '600' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr key={station.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#fff' }}>{station.name}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>👤 {station.manager}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#ccc', fontSize: '14px' }}>{station.address}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '6px 12px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      background: station.status === 'Hoạt động' ? 'rgba(25,195,125,0.2)' : 'rgba(255,165,0,0.2)',
                      color: station.status === 'Hoạt động' ? '#19c37d' : '#ffa500'
                    }}>
                      {station.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', color: '#fff' }}>
                      {station.availableBatteries || 0}/{station.totalSlots || 0}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#fff' }}>
                    {station.totalTransactions || 0}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button 
                      onClick={() => setSelectedStation(station)} 
                      style={{
                        padding: '8px 16px', 
                        background: 'linear-gradient(135deg, #4F8CFF, #3b74db)',
                        border: 'none', 
                        borderRadius: '6px', 
                        color: '#fff', 
                        cursor: 'pointer', 
                        fontSize: '12px', 
                        fontWeight: '600'
                      }}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stations.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <div>Chưa có trạm nào</div>
            </div>
          )}
        </div>

        {selectedStation && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000 
          }}>
            <div style={{ 
              background: 'rgba(26, 32, 44, 0.98)', 
              borderRadius: '16px', 
              padding: '30px',
              width: '600px', 
              maxWidth: '90vw', 
              maxHeight: '90vh', 
              overflow: 'auto', 
              border: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              <h3 style={{ 
                margin: '0 0 24px 0', 
                fontSize: '24px', 
                color: '#fff', 
                borderBottom: '2px solid rgba(255,255,255,0.1)', 
                paddingBottom: '16px' 
              }}>
                🏢 {selectedStation.name}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255,255,255,0.05)' 
                }}>
                  <span style={{ color: '#999', fontSize: '14px' }}>📍 Địa chỉ</span>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{selectedStation.address}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255,255,255,0.05)' 
                }}>
                  <span style={{ color: '#999', fontSize: '14px' }}>👤 Quản lý</span>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{selectedStation.manager}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255,255,255,0.05)' 
                }}>
                  <span style={{ color: '#999', fontSize: '14px' }}>📞 Số điện thoại</span>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{selectedStation.phone}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255,255,255,0.05)' 
                }}>
                  <span style={{ color: '#999', fontSize: '14px' }}>🕐 Giờ hoạt động</span>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                    {selectedStation.operatingHours || '24/7'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStation(null)} 
                style={{
                  width: '100%', 
                  marginTop: '24px', 
                  padding: '14px', 
                  background: 'linear-gradient(135deg, #4F8CFF, #3b74db)',
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  fontSize: '14px', 
                  fontWeight: '600'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {showAddModal && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000 
          }}>
            <div style={{ 
              background: 'rgba(26, 32, 44, 0.98)', 
              borderRadius: '16px', 
              padding: '30px',
              width: '500px', 
              maxWidth: '90vw', 
              border: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>➕ Thêm trạm mới</h3>
              <p style={{ color: '#999', marginBottom: '20px' }}>Tính năng đang được phát triển...</p>
              <button 
                onClick={() => setShowAddModal(false)} 
                style={{
                  width: '100%', 
                  padding: '14px', 
                  background: 'linear-gradient(135deg, #4F8CFF, #3b74db)',
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  fontSize: '14px', 
                  fontWeight: '600'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StaffStationManagement;
