import React from 'react';
// 1. IMPORT useNavigate THAY CHO LINK
import { useNavigate } from 'react-router-dom'; 
import { useStationData } from './hooks/useStationData'; 
import StationCard from './components/StationCard'; 

const StaffStationManagement = () => {
  const { stations, isLoading, error, refetch } = useStationData();
  const navigate = useNavigate(); // <-- 2. KHỞI TẠO HOOK NÀY

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Đang tải danh sách trạm...</p>;
    if (error) return (
      <div style={{ color: '#ef4444', textAlign: 'center' }}>
        <p>Lỗi: {error}</p>
        <button onClick={() => refetch()}>Thử lại</button>
      </div>
    );
    if (stations.length === 0) return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Không tìm thấy trạm nào.</p>;

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '25px',
      }}>
        {stations.map(station => (
          // 3. BỎ THẺ <Link> VÀ TRUYỀN onClick VÀO NHƯ SAU
          <StationCard 
            key={station.id} 
            station={station} 
            onClick={() => navigate(`/staff/stations/${station.id}`)} 
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Quản lý Trạm</h1>
          <p style={{ margin: '5px 0 0 0', color: '#94a3b8' }}>Tổng quan trạng thái và số lượng pin tại các trạm.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <select onChange={(e) => refetch({ status: e.target.value })} style={{ background: '#334155', color: 'white', border: '1px solid #475569', padding: '10px', borderRadius: '8px' }}>
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="maintenance">Bảo trì</option>
            <option value="offline">Ngoại tuyến</option>
          </select>
          <button onClick={() => refetch()} style={{ background: '#334155', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>
            🔄 Tải lại
          </button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default StaffStationManagement;