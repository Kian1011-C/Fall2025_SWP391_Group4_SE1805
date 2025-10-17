import React, { useState } from 'react';
import { useBatteryStockData } from '../hooks/useBatteryStockData';
import BatteryDetailModal from './BatteryDetailModal'; // <-- 1. Import Modal component

// Hàm để lấy style cho trạng thái, giúp giao diện trực quan hơn
const getStatusStyle = (status = '') => {
    const s = status.toLowerCase();
    const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'available' || s === 'đầy') return { ...style, background: '#166534', color: '#86efac' };
    if (s === 'charging' || s === 'đang sạc') return { ...style, background: '#1e40af', color: '#93c5fd' };
    if (s === 'maintenance' || s === 'bảo trì') return { ...style, background: '#9a3412', color: '#fdba74' };
    if (s === 'low' || s === 'yếu') return { ...style, background: '#991b1b', color: '#fca5a5' };
    return { ...style, background: '#475569', color: '#cbd5e1' };
};

const BatteryStockView = () => {
    // Lấy dữ liệu và các hàm cần thiết từ hook
    const { batteries, isLoading, error, refetch } = useBatteryStockData();

    // --- 2. THÊM STATE ĐỂ QUẢN LÝ MODAL ---
    const [selectedBattery, setSelectedBattery] = useState(null);

    // Hàm để mở modal, nhận vào thông tin của viên pin được chọn
    const handleViewDetails = (battery) => {
        setSelectedBattery(battery);
    };

    // Hàm để đóng modal
    const handleCloseModal = () => {
        setSelectedBattery(null);
    };

    // Xử lý trạng thái đang tải
    if (isLoading) {
      return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Đang tải dữ liệu kho pin...</p>;
    }

    // Xử lý trạng thái lỗi
    if (error) {
      return (
        <div style={{ color: '#ef4444', textAlign: 'center' }}>
          <p>Lỗi: {error}</p>
          <button onClick={refetch}>Thử lại</button>
        </div>
      );
    }

    // Giao diện chính khi đã có dữ liệu
    return (
        <> {/* <-- Dùng Fragment để bọc cả bảng và modal */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{margin: 0}}>Chi tiết Kho Pin</h2>
                    <button onClick={refetch} style={{ background: '#334155', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>
                        🔄 Tải lại
                    </button>
                </div>
                <div style={{ background: '#1e293b', borderRadius: '12px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ background: '#334155' }}>
                                <th style={{ padding: '15px 20px' }}>Mã Pin</th>
                                <th style={{ padding: '15px 20px' }}>Trạng thái</th>
                                <th style={{ padding: '15px 20px' }}>Mức pin (%)</th>
                                <th style={{ padding: '15px 20px' }}>Sức khỏe (%)</th>
                                <th style={{ padding: '15px 20px' }}>Vị trí (Hộc)</th>
                                <th style={{ padding: '15px 20px' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {batteries.map((bat) => {
                                // Đọc dữ liệu linh hoạt từ API
                                const id = bat.id || bat.batteryId;
                                const status = bat.status || 'N/A';
                                const charge = bat.stateOfHealth || bat.charge || 0;
                                const health = bat.health || charge;
                                const slot = bat.slotId || bat.slot || 'N/A';

                                return (
                                    <tr key={id} style={{ borderTop: '1px solid #334155' }}>
                                        <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>BAT{id}</td>
                                        <td style={{ padding: '15px 20px' }}><span style={getStatusStyle(status)}>{status}</span></td>
                                        <td style={{ padding: '15px 20px' }}>{charge}%</td>
                                        <td style={{ padding: '15px 20px' }}>{health}%</td>
                                        <td style={{ padding: '15px 20px' }}>{slot}</td>
                                        <td style={{ padding: '15px 20px' }}>
                                            {/* --- 3. GẮN SỰ KIỆN onClick VÀO NÚT --- */}
                                            <button 
                                                onClick={() => handleViewDetails(bat)} 
                                                style={{ background: '#334155', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- 4. RENDER MODAL MỘT CÁCH CÓ ĐIỀU KIỆN --- */}
            {/* Modal chỉ hiển thị khi `selectedBattery` có giá trị */}
            <BatteryDetailModal 
                battery={selectedBattery} 
                onClose={handleCloseModal} 
            />
        </>
    );
};

export default BatteryStockView;