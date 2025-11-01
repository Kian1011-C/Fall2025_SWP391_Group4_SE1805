import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InitiateSwapForm = ({ 
    isLoading, 
    isSubmitting, 
    error, 
    availableBatteries,
    fetchAvailableBatteries, 
    onInitiateSwap,
    currentStaffId // Nhận staffId từ props
}) => {
    // Step 1: Nhập User ID
    const [step, setStep] = useState(1); // 1 = nhập userId, 2 = nhập thông tin đổi pin
    const [userId, setUserId] = useState('');
    const [userVehicles, setUserVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    
    // Step 2: Chọn xe và pin
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState(''); // Thêm state riêng cho vehicleId
    const [oldBatteryId, setOldBatteryId] = useState('');
    const [newBatteryId, setNewBatteryId] = useState('');
    const [contractId, setContractId] = useState('');
    const STAFF_STATION_ID = 1;

    useEffect(() => {
        fetchAvailableBatteries(STAFF_STATION_ID);
    }, []);

    // Load thông tin xe của user
    const handleLoadUserVehicles = async (e) => {
        e.preventDefault();
        if (!userId.trim()) {
            alert('Vui lòng nhập User ID');
            return;
        }

        setLoadingVehicles(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${userId}/vehicles`);
            console.log('📦 Dữ liệu xe nhận được:', response.data);
            
            if (response.data.success && response.data.data && response.data.data.length > 0) {
                setUserVehicles(response.data.data);
                setStep(2); // Chuyển sang bước 2
            } else {
                alert('Không tìm thấy xe nào của user này');
                setUserVehicles([]);
            }
        } catch (error) {
            console.error('Lỗi khi tải thông tin xe:', error);
            alert('Không thể tải thông tin xe. Vui lòng kiểm tra User ID.');
        } finally {
            setLoadingVehicles(false);
        }
    };

    // Xử lý khi chọn xe - SỬA LẠI
    const handleVehicleSelect = (e) => {
        const vehicleIdStr = e.target.value;
        console.log('🚗 Đã chọn vehicleId (string):', vehicleIdStr);
        
        if (!vehicleIdStr || vehicleIdStr === '') {
            // Reset nếu chọn "-- Chọn xe --"
            setSelectedVehicleId('');
            setSelectedVehicle(null);
            setOldBatteryId('');
            setContractId('');
            return;
        }
        
        // Convert sang số để so sánh
        const vehicleIdNum = parseInt(vehicleIdStr, 10);
        console.log('🚗 vehicleId (number):', vehicleIdNum);
        console.log('🚗 Danh sách xe:', userVehicles);
        
        const vehicle = userVehicles.find(v => v.vehicleId === vehicleIdNum);
        console.log('🚗 Xe tìm thấy:', vehicle);
        
        if (vehicle) {
            setSelectedVehicleId(vehicleIdStr); // Lưu string để hiển thị trong dropdown
            setSelectedVehicle(vehicle);
            setOldBatteryId(vehicle.batteryId ? String(vehicle.batteryId) : '');
            setContractId(vehicle.contractId ? String(vehicle.contractId) : '');
            
            console.log('✅ Đã set vehicle:', {
                vehicleId: vehicle.vehicleId,
                plateNumber: vehicle.plateNumber,
                batteryId: vehicle.batteryId,
                contractId: vehicle.contractId
            });
        } else {
            console.error('❌ Không tìm thấy xe với vehicleId:', vehicleIdNum);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedVehicle) {
            alert('Vui lòng chọn xe');
            return;
        }
        
        if (!newBatteryId.trim()) {
            alert('Vui lòng nhập mã pin mới');
            return;
        }

        // Chuẩn bị dữ liệu gửi đi
        const swapData = {
            userId: userId,
            vehicleId: selectedVehicle.vehicleId,
            oldBatteryId: oldBatteryId && oldBatteryId.trim() !== '' ? parseInt(oldBatteryId, 10) : null,
            newBatteryId: parseInt(newBatteryId, 10),
            contractId: contractId && contractId.trim() !== '' ? parseInt(contractId, 10) : null,
            staffId: currentStaffId || null // Gửi staffId hoặc null nếu không có
        };

        console.log('📤 [InitiateSwapForm] Dữ liệu gửi đi:', swapData);
        console.log('  ├─ userId:', swapData.userId, `(type: ${typeof swapData.userId})`);
        console.log('  ├─ vehicleId:', swapData.vehicleId, `(type: ${typeof swapData.vehicleId})`);
        console.log('  ├─ oldBatteryId:', swapData.oldBatteryId, `(type: ${typeof swapData.oldBatteryId})`);
        console.log('  ├─ newBatteryId:', swapData.newBatteryId, `(type: ${typeof swapData.newBatteryId})`);
        console.log('  ├─ contractId:', swapData.contractId, `(type: ${typeof swapData.contractId})`);
        console.log('  └─ staffId:', swapData.staffId, `(type: ${typeof swapData.staffId})`);
        
        // Cảnh báo nếu không có staffId
        if (!currentStaffId) {
            console.warn('⚠️ CẢNH BÁO: currentStaffId là NULL. Staff ID sẽ không được ghi nhận trong giao dịch.');
        }

        onInitiateSwap(swapData);
    };

    // Reset về bước 1
    const handleReset = () => {
        setStep(1);
        setUserId('');
        setUserVehicles([]);
        setSelectedVehicle(null);
        setSelectedVehicleId(''); // Reset vehicleId
        setOldBatteryId('');
        setNewBatteryId('');
        setContractId('');
    };

    return (
        <div style={styles.container}>
            {step === 1 ? (
                // BƯỚC 1: Nhập User ID
                <form onSubmit={handleLoadUserVehicles} style={styles.form}>
                    <h2 style={styles.title}>Bước 1: Nhập thông tin Tài xế</h2>
                    
                    <div style={styles.group}>
                        <label style={styles.label}>User ID (Mã Tài xế) *</label>
                        <input 
                            type="text" 
                            value={userId} 
                            onChange={e => setUserId(e.target.value)} 
                            style={styles.input}
                            placeholder="Nhập User ID (vd: U123456789ab)"
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loadingVehicles || !userId.trim()} 
                        style={styles.button}
                    >
                        {loadingVehicles ? 'Đang tải...' : 'Tiếp theo'}
                    </button>
                </form>
            ) : (
                // BƯỚC 2: Chọn xe và nhập thông tin đổi pin
                <form onSubmit={handleSubmit} style={styles.form}>
                    <h2 style={styles.title}>Bước 2: Thông tin Đổi Pin</h2>
                    
                    {/* Hiển thị User ID */}
                    <div style={styles.infoBox}>
                        <strong>Tài xế:</strong> {userId}
                        <button 
                            type="button" 
                            onClick={handleReset} 
                            style={styles.changeButton}
                        >
                            Đổi tài xế
                        </button>
                    </div>
                    
                    {/* Dropdown chọn xe */}
                    <div style={styles.group}>
                        <label style={styles.label}>Chọn Xe (Biển số) *</label>
                        <select 
                            value={selectedVehicleId} 
                            onChange={handleVehicleSelect}
                            style={styles.select}
                            required
                        >
                            <option value="">-- Chọn xe --</option>
                            {userVehicles.map(vehicle => (
                                <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                    {vehicle.plateNumber} ({vehicle.vehicleModel || vehicle.model || 'N/A'})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Hiển thị thông tin xe đã chọn */}
                    {selectedVehicle && (
                        <div style={styles.vehicleInfo}>
                            <h4 style={styles.subtitle}>Thông tin xe:</h4>
                            <p>🚗 Biển số: <strong>{selectedVehicle.plateNumber}</strong></p>
                            <p>📦 Model: <strong>{selectedVehicle.vehicleModel || selectedVehicle.model || 'N/A'}</strong></p>
                            <p>🔋 Pin hiện tại: <strong>{selectedVehicle.batteryId || 'Không có'}</strong></p>
                            <p>📄 Hợp đồng: <strong>{selectedVehicle.contractId || 'Không có'}</strong></p>
                        </div>
                    )}

                    {/* Contract ID (tự động lấy) */}
                    <div style={styles.group}>
                        <label style={styles.label}>Contract ID (Tự động) {contractId && '✅'}</label>
                        <input 
                            type="text" 
                            value={contractId || 'Chưa có dữ liệu'} 
                            readOnly
                            style={{
                                ...styles.input, 
                                backgroundColor: '#1e293b', 
                                cursor: 'not-allowed',
                                color: contractId ? '#10b981' : '#94a3b8'
                            }}
                            placeholder="Sẽ tự động lấy từ xe"
                        />
                    </div>

                    {/* Pin cũ (tự động lấy) */}
                    <div style={styles.group}>
                        <label style={styles.label}>Pin cũ ID (Tự động) {oldBatteryId && '✅'}</label>
                        <input 
                            type="text" 
                            value={oldBatteryId || 'Chưa có dữ liệu'} 
                            readOnly
                            style={{
                                ...styles.input, 
                                backgroundColor: '#1e293b', 
                                cursor: 'not-allowed',
                                color: oldBatteryId ? '#10b981' : '#94a3b8'
                            }}
                            placeholder="Sẽ tự động lấy từ xe"
                        />
                    </div>

                    {/* Pin mới */}
                    <div style={styles.group}>
                        <label style={styles.label}>Nhập ID Pin Mới (từ kho) *</label>
                        <input
                            type="text"
                            value={newBatteryId}
                            onChange={e => setNewBatteryId(e.target.value)}
                            style={styles.input}
                            required
                            placeholder="Nhập mã pin mới (vd: 101)"
                        />
                    </div>
                    
                    {error && <p style={styles.error}>{error}</p>}

                    <div style={styles.buttonGroup}>
                        <button 
                            type="button" 
                            onClick={handleReset} 
                            style={styles.buttonSecondary}
                        >
                            Quay lại
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || isLoading} 
                            style={styles.button}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Bắt đầu Đổi Pin'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

// CSS
const styles = {
    container: { maxWidth: '600px', margin: 'auto' },
    form: { background: '#1e293b', padding: '25px', borderRadius: '16px' },
    title: { marginTop: 0, color: 'white', marginBottom: '20px' },
    subtitle: { color: '#10b981', marginTop: 0, marginBottom: '10px' },
    group: { marginBottom: '15px' },
    label: { display: 'block', color: '#94a3b8', marginBottom: '5px', fontSize: '14px' },
    input: { 
        width: '100%', 
        padding: '10px', 
        background: '#334155', 
        border: '1px solid #475569', 
        color: 'white', 
        borderRadius: '8px', 
        boxSizing: 'border-box',
        fontSize: '14px'
    },
    select: {
        width: '100%', 
        padding: '10px', 
        background: '#334155', 
        border: '1px solid #475569', 
        color: 'white', 
        borderRadius: '8px', 
        boxSizing: 'border-box',
        fontSize: '14px',
        cursor: 'pointer'
    },
    button: { 
        width: '100%', 
        padding: '12px', 
        background: '#10b981', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontSize: '16px',
        fontWeight: 'bold'
    },
    buttonSecondary: {
        flex: 1,
        padding: '12px', 
        background: '#475569', 
        color: '#e2e8f0', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontSize: '16px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '20px'
    },
    error: { color: '#f87171', marginBottom: '10px' },
    infoBox: {
        background: '#0f172a',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '15px',
        color: '#94a3b8',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    changeButton: {
        padding: '6px 12px',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px'
    },
    vehicleInfo: {
        background: '#0f172a',
        border: '1px solid #10b981',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        color: '#cbd5e1'
    }
};

export default InitiateSwapForm;