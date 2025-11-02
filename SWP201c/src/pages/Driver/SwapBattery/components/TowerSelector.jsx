// src/pages/Driver/SwapBattery/components/TowerSelector.jsx
import React, { useContext, useState, useEffect } from 'react';
import { SwapContext } from '../index'; 
import stationService from '/src/assets/js/services/stationService.js'; 

const TowerSelector = () => {
    const { selectedStation, initiateSwap, isLoading, goToStep, STEPS } = useContext(SwapContext);
    
    const [cabinets, setCabinets] = useState([]); 
    const [selectedCabinet, setSelectedCabinet] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [towerSlotInfo, setTowerSlotInfo] = useState({}); // Lưu thông tin slot và pin của từng trụ

    // LOAD LẠI TRỤ ĐÃ CHỌN TỪ SESSION STORAGE
    useEffect(() => {
        try {
            const savedCabinet = sessionStorage.getItem('selectedCabinet');
            if (savedCabinet) {
                const cabinet = JSON.parse(savedCabinet);
                setSelectedCabinet(cabinet);
                console.log('Đã load lại trụ từ sessionStorage:', cabinet);
            }
        } catch (error) {
            console.error('Lỗi khi load trụ từ sessionStorage:', error);
        }
    }, []);

    useEffect(() => {
        if (!selectedStation) {
            goToStep(STEPS.SELECT_STATION);
            return;
        }

        const fetchCabinets = async () => {
            setLoading(true);
            setError(null);
            try {
                // Gọi API thật: GET /api/driver/towers?stationId=...
                // (stationService đã được sửa để gọi API này)
                const data = await stationService.getCabinetsByStation(selectedStation.id || selectedStation.stationId);
                
                // data trả về là một mảng đã được service xử lý
                if (Array.isArray(data)) {
                    setCabinets(data); 
                    
                    // Lấy thông tin slot và pin cho từng trụ
                    const slotInfoMap = {};
                    for (const cabinet of data) {
                        const towerId = cabinet.id || cabinet.cabinetId;
                        if (towerId) {
                            try {
                                console.log('🔋 Lấy thông tin slot và pin cho trụ:', towerId);
                                const slotsResponse = await stationService.getSlotsByTower(towerId);
                                if (slotsResponse.success && Array.isArray(slotsResponse.data)) {
                                    const slots = slotsResponse.data;
                                    const availableBatteries = slots.filter(slot => 
                                        slot.batteryId && 
                                        slot.status && 
                                        slot.status.toLowerCase() !== 'charging' && 
                                        slot.status.toLowerCase() !== 'maintenance' &&
                                        slot.status.toLowerCase() !== 'empty'
                                    ).length;
                                    const emptySlots = slots.filter(slot => 
                                        !slot.batteryId || 
                                        slot.status?.toLowerCase() === 'empty'
                                    ).length;
                                    
                                    slotInfoMap[towerId] = {
                                        availableBatteries,
                                        emptySlots,
                                        totalSlots: slots.length
                                    };
                                    console.log('✅ Thông tin trụ', towerId, ':', slotInfoMap[towerId]);
                                }
                            } catch (err) {
                                console.warn('⚠️ Không thể lấy thông tin slot cho trụ', towerId, ':', err);
                                slotInfoMap[towerId] = {
                                    availableBatteries: 0,
                                    emptySlots: 0,
                                    totalSlots: 0
                                };
                            }
                        }
                    }
                    setTowerSlotInfo(slotInfoMap);
                } else {
                    console.warn("Dữ liệu trụ không phải là mảng:", data);
                    setCabinets([]);
                }
            } catch (err) {
                console.error("Lỗi khi tải danh sách trụ:", err);
                setError(err.message || "Không thể tải danh sách trụ.");
            } finally {
                setLoading(false);
            }
        };

        fetchCabinets();
    }, [selectedStation, goToStep, STEPS]); 

    const handleStartSwap = () => {
        if (selectedCabinet) {
            // ===== DEBUG LOG =====
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔘 NHẤN NÚT "BẮT ĐẦU ĐỔI PIN"');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('selectedCabinet object:', selectedCabinet);
            console.log('selectedCabinet.id:', selectedCabinet.id);
            console.log('selectedCabinet.cabinetId:', selectedCabinet.cabinetId);
            console.log('selectedCabinet.cabinetNumber:', selectedCabinet.cabinetNumber);
            console.log('selectedCabinet towerId sẽ dùng:', selectedCabinet.id || selectedCabinet.cabinetId);
            
            // VALIDATION: Kiểm tra trụ có pin sẵn có không
            const cabinetId = selectedCabinet.id || selectedCabinet.cabinetId;
            const slotInfo = towerSlotInfo[cabinetId];
            
            if (slotInfo && slotInfo.availableBatteries === 0) {
                alert('Trụ này không có pin sẵn có để đổi. Vui lòng chọn trụ khác.');
                return;
            }
            
            // LƯU TRỤ VÀO SESSION STORAGE
            try {
                sessionStorage.setItem('selectedCabinet', JSON.stringify(selectedCabinet));
                console.log('✅ Đã lưu trụ vào sessionStorage:', selectedCabinet);
            } catch (error) {
                console.error('❌ Lỗi khi lưu trụ vào sessionStorage:', error);
            }
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀 GỌI initiateSwap với cabinet:', selectedCabinet);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            initiateSwap(selectedCabinet);
        }
    };

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Đang tải danh sách trụ...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>
            Lỗi: {error}
        </div>;
    }

    return (
        <div className="station-selector-container"> 
            <h2 className="station-selector-title">2. Chọn trụ tại trạm {selectedStation?.name}</h2>
            
            <div className="station-grid"> 
                {cabinets.length > 0 ? (
                    cabinets.map(cab => {
                        const cabinetId = cab.id || cab.cabinetId;
                        const slotInfo = towerSlotInfo[cabinetId];
                        const hasAvailableBatteries = slotInfo && slotInfo.availableBatteries > 0;
                        
                        return (
                            <CabinetCard 
                                key={cabinetId}
                                cabinet={cab}
                                isSelected={selectedCabinet?.id === cab.id}
                                onSelect={() => {
                                    if (hasAvailableBatteries) {
                                        setSelectedCabinet(cab);
                                    } else {
                                        alert('Trụ này không có pin sẵn có để đổi. Vui lòng chọn trụ khác.');
                                    }
                                }}
                                slotInfo={slotInfo}
                                isDisabled={!hasAvailableBatteries}
                            />
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p style={{ color: 'gray', marginBottom: '20px' }}>Trạm này hiện không có trụ nào sẵn sàng.</p>
                        <button 
                            onClick={() => goToStep(STEPS.SELECT_STATION)}
                            style={{
                                background: 'rgba(156, 163, 175, 0.2)',
                                color: '#9ca3af',
                                border: '1px solid rgba(156, 163, 175, 0.3)',
                                borderRadius: '10px',
                                padding: '12px 24px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            ← Quay lại chọn trạm
                        </button>
                    </div>
                )}
            </div>

            {cabinets.length > 0 && (
                <div style={{ marginTop: '24px', textAlign: 'center', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button 
                        className="back-button" 
                        onClick={() => goToStep(STEPS.SELECT_STATION)}
                        style={{
                            background: 'rgba(156, 163, 175, 0.2)',
                            color: '#9ca3af',
                            border: '1px solid rgba(156, 163, 175, 0.3)',
                            borderRadius: '10px',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        ← Quay lại
                    </button>
                    <button 
                        className="start-swap-button" 
                        onClick={handleStartSwap} 
                        disabled={!selectedCabinet || isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Bắt đầu đổi pin"}
                    </button>
                </div>
            )}
        </div>
    );
};

// Component con (CabinetCard)
const CabinetCard = ({ cabinet, isSelected, onSelect, slotInfo, isDisabled = false }) => {
    
    // ==========================================================
    // SỬA LỖI "BẢO TRÌ":
    // Logic cũ: cabinet.status !== 'Hoạt động' (SAI)
    // Logic mới: Kiểm tra xem status có phải là "active" không
    // (Đây là status mà DriverController.java trả về)
    // ==========================================================
    const isMaintenance = (cabinet.status !== 'active'); 
    
    let cardClass = `station-card ${isMaintenance ? 'maintenance' : ''}`;
    if (isDisabled) {
        cardClass += ' disabled';
    }
    if (isSelected && !isMaintenance && !isDisabled) { // Chỉ 'selected' khi không bảo trì và không disabled
        cardClass += ' selected'; 
    }
    
    return (
        // Chỉ cho phép click (onSelect) khi không bảo trì và không disabled
        <div className={cardClass} onClick={isMaintenance || isDisabled ? null : onSelect}>
            <div className="station-card-header">
                <h3 className="station-name">{cabinet.name}</h3>
                <span className={`station-status ${isMaintenance ? 'maintenance' : 'active'}`}>
                    {isMaintenance ? 'Bảo trì' : 'Hoạt động'}
                </span>
            </div>
            <div className="station-address">
                {slotInfo ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ color: slotInfo.availableBatteries === 0 ? '#ef4444' : 'inherit' }}>
                            Số Pin đang sẵn có: {slotInfo.availableBatteries}
                            {slotInfo.availableBatteries === 0 && ' (Không có pin để đổi)'}
                        </span>
                        <span>Số slot trống: {slotInfo.emptySlots}</span>
                    </div>
                ) : (
                    <span>Số hộc trống: {cabinet.availableSlots || 0} / {cabinet.totalSlots || 0}</span>
                )}
            </div>
        </div>
    );
};

export default TowerSelector;