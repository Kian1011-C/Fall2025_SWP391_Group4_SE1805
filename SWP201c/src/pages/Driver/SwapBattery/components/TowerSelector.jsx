// src/pages/Driver/SwapBattery/components/TowerSelector.jsx
import React, { useContext, useState, useEffect } from 'react';
import { SwapContext } from '../index'; 
// Import service để gọi API thật
import stationService from '/src/assets/js/services/stationService.js'; 

const TowerSelector = () => {
    // 1. LẤY DỮ LIỆU TỪ "BỘ NÃO" (CONTEXT)
    // - selectedStation: Trạm mà người dùng đã chọn ở bước 1.
    // - initiateSwap: Hàm API POST 1 (để bắt đầu đổi).
    // - isLoading: Trạng thái chờ của API POST (true khi đang gọi initiateSwap).
    // - goToStep, STEPS: Để điều hướng.
    const { selectedStation, initiateSwap, isLoading, goToStep, STEPS } = useContext(SwapContext);
    
    // State nội bộ của component này
    const [cabinets, setCabinets] = useState([]); // Danh sách các trụ (towers)
    const [selectedCabinet, setSelectedCabinet] = useState(null);
    const [loading, setLoading] = useState(true); // Trạng thái chờ của API GET (lấy danh sách trụ)
    const [error, setError] = useState(null);

    // 2. GỌI API GET ĐỂ LẤY DANH SÁCH TRỤ
    useEffect(() => {
        // Nếu không có trạm nào (ví dụ: người dùng F5 trang), quay lại bước 1
        if (!selectedStation) {
            goToStep(STEPS.SELECT_STATION);
            return;
        }

        const fetchCabinets = async () => {
            setLoading(true);
            setError(null);
            console.log(`Đang tải trụ cho trạm: ${selectedStation.id || selectedStation.stationId}`);
            try {
                // Gọi API thật bằng ID của trạm đã chọn
                const data = await stationService.getCabinetsByStation(selectedStation.id || selectedStation.stationId);
                
                // Xử lý dữ liệu trả về (có thể là {success, data} hoặc mảng [..])
                if (data && data.success && Array.isArray(data.data)) {
                    setCabinets(data.data);
                } else if (Array.isArray(data)) {
                    setCabinets(data); // Nếu BE trả về mảng trực tiếp
                } else {
                    console.warn("Dữ liệu trụ không đúng định dạng:", data);
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
    }, [selectedStation, goToStep, STEPS]); // Hook này chạy lại khi trạm được chọn thay đổi

    // 3. HÀM XỬ LÝ KHI NHẤN "BẮT ĐẦU"
    const handleStartSwap = () => {
        if (selectedCabinet) {
            // Gọi API POST 1 (hàm này nằm trong useSwapData.js)
            initiateSwap(selectedCabinet);
        }
    };

    // 4. HIỂN THỊ TRẠNG THÁI (LOADING, LỖI, HOẶC DỮ LIỆU)
    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Đang tải danh sách trụ...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>
            Lỗi: {error}
        </div>;
    }

    return (
        // Dùng lại class CSS từ StationSelector cho đồng bộ
        <div className="station-selector-container"> 
            <h2 className="station-selector-title">2. Chọn trụ tại trạm {selectedStation?.name}</h2>
            
            <div className="station-grid"> {/* Dùng lại class grid */}
                {cabinets.length > 0 ? (
                    cabinets.map(cab => (
                        <CabinetCard 
                            key={cab.id || cab.cabinetId} // Dùng key từ DB
                            cabinet={cab}
                            // Đánh dấu thẻ được chọn
                            isSelected={selectedCabinet?.id === cab.id || selectedCabinet?.cabinetId === cab.cabinetId}
                            onSelect={() => setSelectedCabinet(cab)}
                        />
                    ))
                ) : (
                    <p style={{ color: 'gray' }}>Trạm này hiện không có trụ nào sẵn sàng.</p>
                )}
            </div>

            {/* Nút Bắt đầu (chỉ hiện khi có trụ để chọn) */}
            {cabinets.length > 0 && (
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <button 
                        className="start-swap-button" // Class CSS bạn đã thêm
                        onClick={handleStartSwap} 
                        // Tắt nút khi chưa chọn trụ HOẶC khi API POST 1 đang chạy
                        disabled={!selectedCabinet || isLoading}
                    >
                        {isLoading ? "Đang xử lý..." : "Bắt đầu đổi pin"}
                    </button>
                </div>
            )}
        </div>
    );
};

// Component con để hiển thị thẻ Trụ
const CabinetCard = ({ cabinet, isSelected, onSelect }) => {
    // (Kiểm tra status trả về từ API, có thể là "HOAT_DONG")
    const isMaintenance = (cabinet.status !== 'HOAT_DONG' && cabinet.status !== 'Hoạt động');
    
    // Thêm class 'selected' nếu thẻ này được chọn
    let cardClass = `station-card ${isMaintenance ? 'maintenance' : ''}`;
    if (isSelected) {
        cardClass += ' selected'; // Class 'selected' từ file battery-swap.css
    }
    
    // Lấy thông tin từ API (tên có thể khác)
    const availableSlots = cabinet.availableSlots || 0;
    const totalSlots = cabinet.totalSlots || 8; // Giả sử 1 trụ có 8 hộc

    return (
        <div className={cardClass} onClick={isMaintenance ? null : onSelect}>
            <div className="station-card-header">
                <h3 className="station-name">{cabinet.name || `Trụ ${cabinet.cabinetId}`}</h3>
                <span className={`station-status ${isMaintenance ? 'maintenance' : 'active'}`}>
                    {isMaintenance ? 'Bảo trì' : 'Hoạt động'}
                </span>
            </div>
            <div className="station-address">
                <span>Số hộc trống: {availableSlots} / {totalSlots}</span>
            </div>
        </div>
    );
};

export default TowerSelector;