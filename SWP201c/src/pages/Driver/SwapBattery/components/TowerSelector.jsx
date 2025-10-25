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
            // LƯU TRỤ VÀO SESSION STORAGE
            try {
                sessionStorage.setItem('selectedCabinet', JSON.stringify(selectedCabinet));
                console.log('Đã lưu trụ vào sessionStorage:', selectedCabinet);
            } catch (error) {
                console.error('Lỗi khi lưu trụ vào sessionStorage:', error);
            }
            
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
                    cabinets.map(cab => (
                        <CabinetCard 
                            key={cab.id || cab.cabinetId}
                            cabinet={cab}
                            isSelected={selectedCabinet?.id === cab.id}
                            onSelect={() => setSelectedCabinet(cab)}
                        />
                    ))
                ) : (
                    <p style={{ color: 'gray' }}>Trạm này hiện không có trụ nào sẵn sàng.</p>
                )}
            </div>

            {cabinets.length > 0 && (
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
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
const CabinetCard = ({ cabinet, isSelected, onSelect }) => {
    
    // ==========================================================
    // SỬA LỖI "BẢO TRÌ":
    // Logic cũ: cabinet.status !== 'Hoạt động' (SAI)
    // Logic mới: Kiểm tra xem status có phải là "active" không
    // (Đây là status mà DriverController.java trả về)
    // ==========================================================
    const isMaintenance = (cabinet.status !== 'active'); 
    
    let cardClass = `station-card ${isMaintenance ? 'maintenance' : ''}`;
    if (isSelected && !isMaintenance) { // Chỉ 'selected' khi không bảo trì
        cardClass += ' selected'; 
    }
    
    return (
        // Chỉ cho phép click (onSelect) khi không bảo trì
        <div className={cardClass} onClick={isMaintenance ? null : onSelect}>
            <div className="station-card-header">
                <h3 className="station-name">{cabinet.name}</h3>
                <span className={`station-status ${isMaintenance ? 'maintenance' : 'active'}`}>
                    {isMaintenance ? 'Bảo trì' : 'Hoạt động'}
                </span>
            </div>
            <div className="station-address">
                <span>Số hộc trống: {cabinet.availableSlots} / {cabinet.totalSlots}</span>
            </div>
        </div>
    );
};

export default TowerSelector;