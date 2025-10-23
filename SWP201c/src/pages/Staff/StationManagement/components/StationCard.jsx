import React from 'react';

const getStatusStyle = (status = '') => {
    const s = status.toLowerCase();
    const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'active' || s === 'hoạt động') return { ...style, background: '#166534', color: '#86efac' };
    if (s === 'maintenance' || s === 'bảo trì') return { ...style, background: '#9a3412', color: '#fdba74' };
    if (s === 'offline' || s === 'ngoại tuyến') return { ...style, background: '#991b1b', color: '#fca5a5' };
    return { ...style, background: '#475569', color: '#cbd5e1' }; // Trạng thái không xác định
};

const StationCard = ({ station }) => {
    // Đọc dữ liệu linh hoạt từ API, sử dụng '??' để cung cấp giá trị mặc định là 0
    const name = station.name || 'Trạm không tên';
    const address = station.address || station.location || 'Chưa có địa chỉ';
    const status = station.status || 'Unknown';
    const available = station.availableBatteries ?? 0;
    const charging = station.chargingBatteries ?? 0;
    const maintenance = station.maintenanceBatteries ?? 0;

    return (
        <div style={{ background: '#1e293b', padding: '25px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>{name}</h3>
                <span style={getStatusStyle(status)}>{status}</span>
            </div>
            <p style={{ color: '#94a3b8', margin: '0 0 20px 0', fontSize: '14px', flexGrow: 1 }}>📍 {address}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '20px' }}>
                <div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#86efac' }}>{available}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Sẵn sàng</div>
                </div>
                <div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#93c5fd' }}>{charging}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Đang sạc</div>
                </div>
                <div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fdba74' }}>{maintenance}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Bảo trì</div>
                </div>
            </div>
        </div>
    );
};

export default StationCard;