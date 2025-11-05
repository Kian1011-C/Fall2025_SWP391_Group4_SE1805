import React from 'react';

// Hàm để lấy style cho trạng thái
const getStatusStyle = (status = '') => {
    const s = status.toLowerCase();
    const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'available' || s === 'đầy') return { ...style, background: '#166534', color: '#86efac' };
    if (s === 'charging' || s === 'đang sạc') return { ...style, background: '#1e40af', color: '#93c5fd' };
    if (s === 'maintenance' || s === 'bảo trì') return { ...style, background: '#9a3412', color: '#fdba74' };
    if (s === 'low' || s === 'yếu') return { ...style, background: '#991b1b', color: '#fecaca' };
    return { ...style, background: '#475569', color: '#cbd5e1' };
};

// Component hiển thị một dòng thông tin chi tiết
const DetailRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #334155' }}>
        <span style={{ color: '#94a3b8' }}>{label}</span>
        <span style={{ color: 'white', fontWeight: '600' }}>{value}</span>
    </div>
);

const BatteryDetailModal = ({ battery, onClose }) => {
    if (!battery) return null;

    // Chuẩn hóa dữ liệu
    const id = battery.id || battery.batteryId;
    const status = battery.status || 'N/A';
    const charge = battery.stateOfHealth || battery.charge || 0;
    const health = battery.health || charge;
    const slot = battery.slotId || battery.slot || 'N/A';
    const cycleCount = battery.cycleCount || 0;
    const model = battery.model || 'Unknown';
    
    // Tính độ chai pin dựa trên chu kỳ sạc
    const getDegradationInfo = (cycles) => {
        if (cycles >= 1000) return { level: 'Chai nhiều', color: '#dc2626', icon: '🔴' };
        if (cycles >= 500) return { level: 'Chai vừa', color: '#f59e0b', icon: '🟡' };
        return { level: 'Tốt', color: '#16a34a', icon: '🟢' };
    };
    
    const degradation = getDegradationInfo(cycleCount);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                background: '#1e293b', color: 'white', borderRadius: '16px',
                padding: '0', width: '90%', maxWidth: '500px',
                border: '1px solid #334155',
            }} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>Chi tiết Pin #{id}</h2>
                    <span style={getStatusStyle(status)}>{status}</span>
                </div>

                {/* Body */}
                <div style={{ padding: '20px' }}>
                    <DetailRow label="Mẫu Pin" value={model} />
                    <DetailRow label="Vị trí (Hộc)" value={slot} />
                    <DetailRow label="Mức pin hiện tại" value={`${charge}%`} />
                    <DetailRow label="Tình trạng sức khỏe" value={`${health}%`} />
                    <DetailRow label="Số chu kỳ sạc" value={cycleCount} />
                    
                    {/* Độ chai pin */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #334155' }}>
                        <span style={{ color: '#94a3b8' }}>Độ chai pin</span>
                        <span style={{ 
                            color: degradation.color, 
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <span>{degradation.icon}</span>
                            <span>{degradation.level}</span>
                        </span>
                    </div>
                    
                    <DetailRow label="Lần bảo trì cuối" value="20/09/2025" />
                </div>
                
                {/* Footer */}
                <div style={{ padding: '20px', background: '#0f172a', borderTop: '1px solid #334155', borderRadius: '0 0 16px 16px' }}>
                    <button onClick={onClose} style={{
                        width: '100%', background: '#334155', color: 'white',
                        border: 'none', padding: '12px', borderRadius: '8px',
                        cursor: 'pointer', fontSize: '16px'
                    }}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BatteryDetailModal;