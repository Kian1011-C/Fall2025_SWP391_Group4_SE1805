import React, { useState, useEffect } from 'react';

// Giả sử bạn có 1 component <Input> và <Button> tùy chỉnh
// Nếu không, hãy thay thế bằng <input> và <button> HTML
// import { Input, Button, Select } from 'your-ui-library'; 

const InitiateSwapForm = ({ 
    isLoading, 
    isSubmitting, 
    error, 
    availableBatteries,
    fetchAvailableBatteries, 
    onInitiateSwap 
}) => {
    const [userId, setUserId] = useState('');
    const [vehicleId, setVehicleId] = useState('');
    const [towerId, setTowerId] = useState('');
    const [oldBatteryId, setOldBatteryId] = useState('');
    
    // Hardcode stationId, bạn nên lấy từ context đăng nhập của nhân viên
    const STaff_STATION_ID = 1; 

    // Tự động tải danh sách pin khi component mount
    useEffect(() => {
        fetchAvailableBatteries(STaff_STATION_ID);
    }, []); // <-- SỬA THÀNH MẢNG RỖNG

    const handleSubmit = (e) => {
        e.preventDefault();
        onInitiateSwap({
            userId,
            vehicleId: vehicleId || null,
            towerId: parseInt(towerId, 10),
            batteryId: oldBatteryId || null // API dùng 'batteryId' cho pin cũ
        });
    };
    
    // Nhóm các pin theo towerId để tạo <optgroup> cho dễ chọn
    const towers = availableBatteries.reduce((acc, bat) => {
        const towerKey = `tower-${bat.towerNumber}`;
        if (!acc[towerKey]) {
            acc[towerKey] = {
                towerId: bat.towerId, // Giả sử API trả về towerId
                towerNumber: bat.towerNumber,
                batteries: []
            };
        }
        acc[towerKey].batteries.push(bat);
        return acc;
    }, {});

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.title}>Khởi tạo Đổi Pin (Trạm #{STaff_STATION_ID})</h2>
            
            <div style={styles.group}>
                <label style={styles.label}>User ID (Tài xế)</label>
                <input 
                    type="text" 
                    value={userId} 
                    onChange={e => setUserId(e.target.value)} 
                    style={styles.input}
                    required 
                />
            </div>
            
            <div style={styles.group}>
                <label style={styles.label}>Vehicle ID (Biển số xe)</label>
                <input 
                    type="text" 
                    value={vehicleId} 
                    onChange={e => setVehicleId(e.target.value)} 
                    style={styles.input}
                />
            </div>

            <div style={styles.group}>
                <label style={styles.label}>Pin cũ ID (nếu có)</label>
                <input 
                    type="text" 
                    value={oldBatteryId} 
                    onChange={e => setOldBatteryId(e.target.value)} 
                    style={styles.input}
                />
            </div>

            <div style={styles.group}>
                <label style={styles.label}>Chọn Pin Mới (Theo Tháp)</label>
                <select
                    value={towerId}
                    onChange={e => setTowerId(e.target.value)}
                    style={styles.input}
                    required
                >
                    <option value="">-- {isLoading ? "Đang tải tháp..." : "Chọn tháp có pin"} --</option>
                    {Object.values(towers).map(tower => (
                        <option key={tower.towerId} value={tower.towerId}>
                            Tháp #{tower.towerNumber} (Có {tower.batteries.length} pin sẵn sàng)
                        </option>
                    ))}
                </select>
            </div>
            
            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" disabled={isSubmitting || isLoading} style={styles.button}>
                {isSubmitting ? 'Đang xử lý...' : 'Bắt đầu Đổi Pin'}
            </button>
        </form>
    );
};

// CSS (bạn nên chuyển ra file riêng)
const styles = {
    form: { background: '#1e293b', padding: '25px', borderRadius: '16px', maxWidth: '500px', margin: 'auto' },
    title: { marginTop: 0, color: 'white' },
    group: { marginBottom: '15px' },
    label: { display: 'block', color: '#94a3b8', marginBottom: '5px' },
    input: { width: '100%', padding: '10px', background: '#334155', border: '1px solid #475569', color: 'white', borderRadius: '8px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' },
    error: { color: '#f87171' }
};

export default InitiateSwapForm;