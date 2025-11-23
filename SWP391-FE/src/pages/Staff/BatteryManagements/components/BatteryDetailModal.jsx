import React, { useState, useEffect } from 'react';

// Hàm để lấy style cho trạng thái
const getStatusStyle = (status = '') => {
    const s = status.toLowerCase();
    const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'available' || s === 'đầy') return { ...style, background: '#166534', color: '#86efac' };
    if (s === 'charging' || s === 'đang sạc') return { ...style, background: '#1e40af', color: '#93c5fd' };
    if (s === 'maintenance' || s === 'bảo trì') return { ...style, background: '#9a3412', color: '#fdba74' };
    if (s === 'in_use' || s === 'đang dùng' || s === 'in-use') return { ...style, background: '#7c3aed', color: '#c4b5fd' };
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

// Component hiển thị lịch sử swap
const HistoryItem = ({ swap }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    const getRoleBadge = (role) => {
        if (role === 'INSTALLED') {
            return <span style={{ background: '#166534', color: '#86efac', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>Đã gắn</span>;
        } else if (role === 'REMOVED') {
            return <span style={{ background: '#dc2626', color: '#fecaca', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>Đã tháo</span>;
        }
        return null;
    };

    return (
        <div style={{ 
            padding: '12px', 
            background: '#0f172a', 
            borderRadius: '8px', 
            marginBottom: '8px',
            border: '1px solid #334155'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', color: 'white' }}>
                    {swap.userName || 'N/A'}
                </div>
                {getRoleBadge(swap.batteryRole)}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                Trạm: {swap.stationName || 'N/A'}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                Thời gian: {formatDate(swap.swapDate)}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Trạng thái: {swap.swapStatus || 'N/A'}
            </div>
        </div>
    );
};

const BatteryDetailModal = ({ isOpen, battery, onClose }) => {
    const [history, setHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && battery) {
            setLoading(true);
            // Simulate API call delay với mock data
            setTimeout(() => {
                loadMockData();
                setLoading(false);
            }, 500);
        } else {
            // Reset data when modal closes
            setHistory([]);
            setCurrentUser(null);
        }
    }, [isOpen, battery]);

    const loadMockData = () => {
        if (!battery) return;
        
        const batteryId = battery.id || battery.batteryId;
        const status = battery.status?.toLowerCase();

        // Mock lịch sử swap
        const mockHistory = [
            {
                swapId: 101,
                stationId: 1,
                stationName: 'Trạm Sạc Quận 1',
                userName: 'Nguyễn Văn A',
                vehicleId: 5,
                oldBatteryId: batteryId === 1 ? 2 : batteryId - 1,
                newBatteryId: batteryId,
                swapDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 ngày trước
                swapStatus: 'COMPLETED',
                batteryRole: 'INSTALLED'
            },
            {
                swapId: 98,
                stationId: 2,
                stationName: 'Trạm Sạc Quận 3',
                userName: 'Trần Thị B',
                vehicleId: 8,
                oldBatteryId: batteryId,
                newBatteryId: batteryId === 1 ? 2 : batteryId - 1,
                swapDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 ngày trước
                swapStatus: 'COMPLETED',
                batteryRole: 'REMOVED'
            },
            {
                swapId: 95,
                stationId: 1,
                stationName: 'Trạm Sạc Quận 1',
                userName: 'Lê Văn C',
                vehicleId: 3,
                oldBatteryId: batteryId === 1 ? 5 : batteryId - 3,
                newBatteryId: batteryId,
                swapDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 ngày trước
                swapStatus: 'COMPLETED',
                batteryRole: 'INSTALLED'
            },
            {
                swapId: 92,
                stationId: 3,
                stationName: 'Trạm Sạc Quận 7',
                userName: 'Phạm Thị D',
                vehicleId: 12,
                oldBatteryId: batteryId,
                newBatteryId: batteryId === 1 ? 3 : batteryId - 2,
                swapDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 ngày trước
                swapStatus: 'COMPLETED',
                batteryRole: 'REMOVED'
            },
            {
                swapId: 88,
                stationId: 1,
                stationName: 'Trạm Sạc Quận 1',
                userName: 'Hoàng Văn E',
                vehicleId: 7,
                oldBatteryId: batteryId === 1 ? 8 : batteryId - 4,
                newBatteryId: batteryId,
                swapDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 ngày trước
                swapStatus: 'COMPLETED',
                batteryRole: 'INSTALLED'
            }
        ];

        // Mock thông tin user đang sử dụng (chỉ khi status là IN_USE)
        const mockCurrentUser = (status === 'in_use' || status === 'in-use') ? {
            userId: 'USER' + (batteryId * 10),
            firstName: 'Nguyễn',
            lastName: 'Văn A',
            fullName: 'Nguyễn Văn A',
            email: `user${batteryId}@example.com`,
            phone: '090' + String(batteryId).padStart(7, '0'),
            vehicle: {
                vehicleId: batteryId * 2,
                plateNumber: `51A-${String(batteryId * 100).padStart(5, '0')}`,
                model: 'VinFast VF8'
            },
            contractId: batteryId * 10
        } : null;

        setHistory(mockHistory);
        setCurrentUser(mockCurrentUser);
    };

    if (!isOpen || !battery) return null;

    // Chuẩn hóa dữ liệu
    const id = battery.id || battery.batteryId;
    const status = battery.status || 'N/A';
    const charge = battery.stateOfHealth || battery.charge || 0;
    const health = battery.health || charge;
    const slot = battery.slotId || battery.slot || 'N/A';
    const cycleCount = battery.cycleCount || 'N/A';
    const model = battery.model || 'Unknown';

    const isInUse = status?.toLowerCase() === 'in_use' || status?.toLowerCase() === 'in-use';

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            padding: '20px'
        }} onClick={onClose}>
            <div style={{
                background: '#1e293b', color: 'white', borderRadius: '16px',
                padding: '0', width: '90%', maxWidth: '700px', maxHeight: '90vh',
                border: '1px solid #334155', display: 'flex', flexDirection: 'column'
            }} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>Chi tiết Pin #{id}</h2>
                    <span style={getStatusStyle(status)}>{status}</span>
                </div>

                {/* Body - Scrollable */}
                <div style={{ 
                    padding: '20px', 
                    overflowY: 'auto', 
                    flex: 1,
                    maxHeight: 'calc(90vh - 200px)'
                }}>
                    {/* Thông tin cơ bản */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#cbd5e1' }}>Thông tin cơ bản</h3>
                        <DetailRow label="Mẫu Pin" value={model} />
                        <DetailRow label="Vị trí (Hộc)" value={slot} />
                        <DetailRow label="Mức pin hiện tại" value={`${typeof charge === 'number' ? charge.toFixed(1) : charge}%`} />
                        <DetailRow label="Tình trạng sức khỏe" value={`${typeof health === 'number' ? health.toFixed(1) : health}%`} />
                        <DetailRow label="Số chu kỳ sạc" value={cycleCount} />
                    </div>

                    {/* Thông tin người dùng đang sử dụng */}
                    {isInUse && (
                        <div style={{ marginBottom: '24px', padding: '16px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#cbd5e1' }}>Người dùng đang sử dụng</h3>
                            {loading ? (
                                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Đang tải...</div>
                            ) : currentUser ? (
                                <div>
                                    <DetailRow label="Tên người dùng" value={currentUser.fullName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()} />
                                    <DetailRow label="Email" value={currentUser.email || 'N/A'} />
                                    <DetailRow label="Số điện thoại" value={currentUser.phone || 'N/A'} />
                                    {currentUser.vehicle && (
                                        <>
                                            <DetailRow label="Biển số xe" value={currentUser.vehicle.plateNumber || 'N/A'} />
                                            <DetailRow label="Mẫu xe" value={currentUser.vehicle.model || 'N/A'} />
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Không tìm thấy thông tin người dùng</div>
                            )}
                        </div>
                    )}

                    {/* Lịch sử swap */}
                    <div>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#cbd5e1' }}>
                            Lịch sử đổi pin ({history.length})
                        </h3>
                        {loading ? (
                            <div style={{ color: '#94a3b8', fontSize: '14px', padding: '20px', textAlign: 'center' }}>Đang tải lịch sử...</div>
                        ) : history.length > 0 ? (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {history.map((swap, index) => (
                                    <HistoryItem key={swap.swapId || index} swap={swap} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ 
                                padding: '20px', 
                                textAlign: 'center', 
                                color: '#94a3b8', 
                                fontSize: '14px',
                                background: '#0f172a',
                                borderRadius: '8px',
                                border: '1px solid #334155'
                            }}>
                                Chưa có lịch sử đổi pin
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer */}
                <div style={{ padding: '20px', background: '#0f172a', borderTop: '1px solid #334155', borderRadius: '0 0 16px 16px' }}>
                    <button onClick={onClose} style={{
                        width: '100%', background: '#334155', color: 'white',
                        border: 'none', padding: '12px', borderRadius: '8px',
                        cursor: 'pointer', fontSize: '16px', transition: 'background 0.2s'
                    }} onMouseOver={(e) => e.target.style.background = '#475569'}
                       onMouseOut={(e) => e.target.style.background = '#334155'}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BatteryDetailModal;
