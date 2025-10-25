//
// File: pages/staff/StationManagement/components/StationDetails.jsx
//
import React from 'react';
import { useParams, Link } from 'react-router-dom';
// 1. Import hook MỚI, bỏ hết useState, useEffect cũ
import { useStationDetailsData } from '../hooks/useStationDetailsData'; 

function StationDetails() {
  const { stationId } = useParams();
  
  // 2. Sử dụng hook mới để lấy dữ liệu API THẬT
  const { cabinets, stationName, isLoading, error, refetch } = useStationDetailsData(stationId);

  // 3. Hiển thị trạng thái tải
  if (isLoading) {
    return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Đang tải danh sách trụ...</p>;
  }
  
  // 4. Hiển thị lỗi
  if (error) {
     return (
       <div style={{ color: '#ef4444', textAlign: 'center' }}>
         <p>Lỗi: {error}</p>
         <button onClick={() => refetch()}>Thử lại</button>
       </div>
     );
  }

  // 5. Hiển thị dữ liệu khi thành công
  return (
    <div>
      <Link to="/staff/stations" style={{ color: '#94a3b8', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        &larr; Quay lại danh sách trạm
      </Link>
      
      <h1 style={{ marginTop: '0', fontSize: '28px' }}>Quản lý Trụ tại: {stationName}</h1>
      
      {cabinets.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center' }}>Trạm này chưa có trụ nào.</p>
      ) : (
        <div className="cabinet-list" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {cabinets.map(cabinet => (
            <Link 
              key={cabinet.id} 
              to={`/staff/stations/${stationId}/cabinets/${cabinet.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="cabinet-card" style={{
                background: '#1e293b', 
                padding: '20px', 
                borderRadius: '8px', 
                border: '1px solid #334155',
                cursor: 'pointer'
              }}>
                <h3>{cabinet.name || `Trụ ${cabinet.id}`}</h3>
                <p style={{ color: (cabinet.status || '').toLowerCase() === 'hoạt động' ? '#10b981' : '#f59e0b' }}>
                  Trạng thái: {cabinet.status || 'Không rõ'}
                </p>
                <p style={{ color: '#94a3b8' }}>Số lượng slot: {cabinet.slots ?? cabinet.totalSlots ?? 'N/A'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default StationDetails;