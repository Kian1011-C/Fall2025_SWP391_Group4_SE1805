import React, { useState, useEffect } from 'react';
import { apiUtils } from '../../../../assets/js/config/api.js';

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
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${hours}:${minutes} ${day}/${month}/${year}`;
        } catch {
            return dateString;
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'COMPLETED') {
            return <span style={{ background: '#166534', color: '#86efac', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>COMPLETED</span>;
        }
        return <span style={{ background: '#475569', color: '#cbd5e1', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>{status}</span>;
    };

    const getRoleBadge = (role) => {
        if (role === 'INSTALLED') {
            return <span style={{ background: '#166534', color: '#86efac', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>Đã gắn</span>;
        } else if (role === 'REMOVED') {
            return <span style={{ background: '#dc2626', color: '#fecaca', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>Đã tháo</span>;
        }
        return null;
    };

    return (
        <div style={{ 
            padding: '14px', 
            background: '#0f172a', 
            borderRadius: '8px', 
            marginBottom: '10px',
            border: '1px solid #334155'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontWeight: '700', color: 'white', fontSize: '15px' }}>
                    {swap.userName || 'N/A'}
                </div>
                {getRoleBadge(swap.batteryRole)}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
                Trạm: {swap.stationName || 'N/A'}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
                Thời gian: {formatDate(swap.swapTime)}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Trạng thái:</span> {getStatusBadge(swap.status)}
            </div>
        </div>
    );
};

const BatteryDetailModal = ({ isOpen, battery, onClose }) => {
    const [history, setHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [historyTotal, setHistoryTotal] = useState(0);

    useEffect(() => {
        const loadBatteryData = async () => {
            if (!isOpen || !battery) {
                // Reset data when modal closes
                setHistory([]);
                setCurrentUser(null);
                setHistoryTotal(0);
                return;
            }
            
            const batteryId = battery.id || battery.batteryId;
            
            try {
                setLoading(true);
                
                // Gọi API GET /api/batteries/{id}/history
                const response = await apiUtils.get(`/api/batteries/${batteryId}/history`);
                
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('Battery history API response:');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(JSON.stringify(response, null, 2));
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                if (response.success && response.data) {
                    console.log('Số lượng bản ghi:', response.data.length);
                    console.log('Total từ API:', response.total);
                    
                    // Log từng bản ghi để xem cấu trúc
                    response.data.forEach((swap, index) => {
                        console.log(`\n[Bản ghi ${index + 1}]:`);
                        console.log('  swapId:', swap.swapId);
                        console.log('  userName:', swap.userName);
                        console.log('  stationName:', swap.stationName);
                        console.log('  swapDate:', swap.swapDate);
                        console.log('  swapTime:', swap.swapTime);
                        console.log('  swapStatus:', swap.swapStatus);
                        console.log('  status:', swap.status);
                        console.log('  stateOfHealth:', swap.stateOfHealth);
                        console.log('  batteryRole:', swap.batteryRole);
                        console.log('  Full object:', swap);
                    });
                    
                    // Normalize data: map swapDate -> swapTime và swapStatus -> status
                    const normalizedData = response.data.map(swap => ({
                        ...swap,
                        swapTime: swap.swapTime || swap.swapDate,
                        status: swap.status || swap.swapStatus
                    }));
                    
                    // Sắp xếp theo thời gian mới nhất trước
                    const sortedHistory = normalizedData.sort((a, b) => {
                        const dateA = new Date(a.swapTime);
                        const dateB = new Date(b.swapTime);
                        return dateB - dateA; // Descending order (mới nhất trước)
                    });
                    
                    console.log('\n Normalized & sorted data:', sortedHistory);
                    
                    setHistory(sortedHistory);
                    setHistoryTotal(response.total || sortedHistory.length);

                    // Nếu pin đang IN_USE, lấy thông tin user từ lịch sử swap gần nhất
                    const batteryStatus = battery.status?.toLowerCase();
                    const isInUse = batteryStatus === 'in_use' || batteryStatus === 'in-use' || batteryStatus === 'đang dùng';
                    
                    if (isInUse && sortedHistory.length > 0) {
                        console.log('\n Pin đang IN_USE, tìm swap gần nhất...');
                        console.log('   Battery ID:', batteryId);
                        
                        // Tìm swap gần nhất mà pin này là newBatteryId và role = INSTALLED
                        const latestInstalled = sortedHistory.find(swap => {
                            const isNewBattery = (swap.newBatteryId == batteryId); // == để match cả string và number
                            const isInstalled = swap.batteryRole === 'INSTALLED';
                            const isCompleted = swap.status === 'COMPLETED' || swap.swapStatus === 'COMPLETED';
                            
                            console.log(`   Swap ${swap.swapId}:`, {
                                newBatteryId: swap.newBatteryId,
                                batteryRole: swap.batteryRole,
                                isNewBattery,
                                isInstalled,
                                isCompleted
                            });
                            
                            return isNewBattery && isInstalled && isCompleted;
                        });
                        
                        if (latestInstalled) {
                            console.log(' Tìm thấy swap INSTALLED:', latestInstalled);
                            setCurrentUser({
                                fullName: latestInstalled.userName,
                                vehicle: {
                                    plateNumber: latestInstalled.vehiclePlateNumber || 'N/A',
                                    model: latestInstalled.vehicleModel || 'N/A'
                                }
                            });
                        } else {
                            console.warn(' Không tìm thấy swap INSTALLED, thử lấy swap gần nhất bất kỳ...');
                            // Fallback: lấy swap gần nhất có userName
                            const latestSwap = sortedHistory.find(swap => swap.userName);
                            if (latestSwap) {
                                console.log('ℹ Sử dụng swap gần nhất:', latestSwap);
                                setCurrentUser({
                                    fullName: latestSwap.userName,
                                    vehicle: latestSwap.vehiclePlateNumber ? {
                                        plateNumber: latestSwap.vehiclePlateNumber,
                                        model: latestSwap.vehicleModel || 'N/A'
                                    } : null
                                });
                            } else {
                                setCurrentUser(null);
                            }
                        }
                    } else {
                        console.log('ℹ Pin không ở trạng thái IN_USE');
                        setCurrentUser(null);
                    }
                } else {
                    console.warn(' No history data or API returned success: false');
                    setHistory([]);
                    setHistoryTotal(0);
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error('Error loading battery history:', error);
                setHistory([]);
                setHistoryTotal(0);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadBatteryData();
    }, [isOpen, battery]);

    if (!isOpen || !battery) return null;

    // Chuẩn hóa dữ liệu
    const id = battery.id || battery.batteryId;
    const charge = battery.stateOfHealth || 0;  // Dung lượng = stateOfHealth
    const health = battery.capacity || 0;        // Độ chai = capacity
    
    // Tự động cập nhật trạng thái sang MAINTENANCE nếu capacity <= 85%
    const status = health <= 85 ? 'maintenance' : (battery.status || 'N/A');
    
    const slot = battery.slotId || battery.slot || 'N/A';
    const cycleCount = battery.cycleCount || 0;
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
                            Lịch sử đổi pin ({historyTotal})
                        </h3>
                        {loading ? (
                            <div style={{ color: '#94a3b8', fontSize: '14px', padding: '20px', textAlign: 'center' }}>Đang tải lịch sử...</div>
                        ) : history.length > 0 ? (
                            <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                                {history.map((swap, index) => (
                                    <HistoryItem key={index} swap={swap} />
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
