//
// File: pages/staff/StationManagement/components/CabinetDetails.jsx
//
import React from 'react';
import { useParams, Link } from 'react-router-dom';
// 1. Import hook MỚI
import { useCabinetDetailsData } from '../hooks/useCabinetDetailsData'; 

// Hàm helper để tạo style cho % pin
const getPercentageStyle = (percentage) => {
  if (percentage == null) return { color: '#94a3b8' };
  if (percentage > 80) return { color: '#10b981', fontWeight: 'bold' }; // Xanh lá
  if (percentage > 20) return { color: '#f59e0b', fontWeight: 'bold' }; // Vàng
  return { color: '#ef4444', fontWeight: 'bold' }; // Đỏ
};

function CabinetDetails() {
  const { stationId, cabinetId } = useParams();
  
  // 2. Sử dụng hook mới để lấy dữ liệu API THẬT
  const { slots, cabinetName, isLoading, error, refetch } = useCabinetDetailsData(cabinetId);

  // 3. Hiển thị trạng thái tải
  if (isLoading) {
    return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Đang tải chi tiết slot...</p>;
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
      <Link 
        to={`/staff/stations/${stationId}`} 
        style={{ color: '#94a3b8', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}
      >
        &larr; Quay lại danh sách trụ
      </Link>
      
      <h1 style={{ marginTop: '0', fontSize: '28px' }}>
        Chi tiết Slot: {cabinetName}
      </h1>
      <p style={{ marginTop: '-20px', color: '#94a3b8' }}>Trạm: {stationId}</p>
      
      {slots.length === 0 ? (
         <p style={{ color: '#94a3b8', textAlign: 'center' }}>Trụ này không có slot hoặc không thể tải dữ liệu.</p>
      ) : (
        <div className="slot-list" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}>
          {slots.map(slot => (
            <div key={slot.slotNumber} className="slot-card" style={{
              background: slot.battery ? '#1e293b' : '#131c2b',
              padding: '20px', 
              borderRadius: '8px', 
              border: '1px solid #334155',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#cbd5e1' }}>
                Slot {slot.slotNumber}
              </h3>
              {slot.battery ? (
                <div>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#94a3b8' }}>
                    {slot.battery.id}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '24px', ...getPercentageStyle(slot.battery.percentage) }}>
                    {slot.battery.percentage != null ? `${slot.battery.percentage}%` : 'N/A'}
                  </p>
                </div>
              ) : (
                <p style={{ margin: '5px 0', fontSize: '20px', color: '#475569', fontWeight: 'bold' }}>
                  Trống
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CabinetDetails;