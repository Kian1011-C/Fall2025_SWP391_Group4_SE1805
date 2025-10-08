// Staff Station Management - Refactored Version
import React from 'react';
import useStationStore from '../../../assets/js/store/stationSlice';

const StationManagementRefactored = () => {
  const { 
    stations, 
    stationStats, 
    isLoading,
    fetchStations,
    deleteStation
  } = useStationStore();

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedStation, setSelectedStation] = React.useState(null);

  React.useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', background: '#0f172a', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, fontSize: '28px' }}>🏢 Quản lý trạm đổi pin</h2>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '12px 24px',
            background: '#19c37d',
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

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Tổng số trạm</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {stationStats?.totalStations || stations?.length || 0}
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Đang hoạt động</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {stationStats?.activeStations || stations?.filter(s => s.status === 'Hoạt động').length || 0}
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Pin khả dụng</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {stationStats?.totalBatteries || 0}
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Tổng giao dịch</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
            {stationStats?.totalTransactions || 0}
          </div>
        </div>
      </div>

      {/* Stations Table */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px', textAlign: 'left' }}>Tên trạm</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Địa chỉ</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Trạng thái</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Pin</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Giao dịch</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {stations?.map((station) => (
              <tr key={station.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '600' }}>{station.name}</div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    {station.manager}
                  </div>
                </td>
                <td style={{ padding: '16px', color: '#ccc' }}>{station.address}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    background: station.status === 'Hoạt động' ? 'rgba(25,195,125,0.2)' : 
                                station.status === 'Bảo trì' ? 'rgba(255,165,0,0.2)' : 'rgba(255,71,87,0.2)',
                    color: station.status === 'Hoạt động' ? '#19c37d' :
                           station.status === 'Bảo trì' ? '#ffa500' : '#ff4757'
                  }}>
                    {station.status}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '600' }}>{station.availableBatteries || 0}/{station.totalSlots || 0}</div>
                </td>
                <td style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>
                  {station.totalTransactions || 0}
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => setSelectedStation(station)}
                      style={{
                        padding: '6px 12px',
                        background: '#4F8CFF',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Xóa trạm này?')) {
                          deleteStation(station.id);
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        background: '#ff4757',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!stations || stations.length === 0) && (
          <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
            Chưa có trạm nào được thêm
          </div>
        )}
      </div>

      {/* Station Detail Modal - Simplified */}
      {selectedStation && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Chi tiết trạm: {selectedStation.name}</h3>
            <div style={{ marginBottom: '15px' }}>
              <strong>Địa chỉ:</strong> {selectedStation.address}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Quản lý:</strong> {selectedStation.manager}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Số điện thoại:</strong> {selectedStation.phone}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Giờ hoạt động:</strong> {selectedStation.operatingHours || '24/7'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Số slot:</strong> {selectedStation.totalSlots}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Pin khả dụng:</strong> {selectedStation.availableBatteries || 0}
            </div>
            <button
              onClick={() => setSelectedStation(null)}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '12px',
                background: '#4F8CFF',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationManagementRefactored;

