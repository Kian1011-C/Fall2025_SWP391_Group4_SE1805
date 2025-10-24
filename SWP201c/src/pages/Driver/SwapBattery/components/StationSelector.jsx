// components/StationSelector.jsx
import React, { useContext, useState, useEffect } from 'react';
import { SwapContext } from '../index'; 

// 1. IMPORT SERVICE API THẬT
// (Đảm bảo đường dẫn này đúng, dựa trên các lỗi trước đó của bạn)
import stationService from '/src/assets/js/services/stationService.js'; 
// import { FaMapMarkerAlt } from 'react-icons/fa';

const StationSelector = () => {
    const { setSelectedStation, goToStep, STEPS } = useContext(SwapContext);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. LOAD LẠI TRẠM ĐÃ CHỌN TỪ SESSION STORAGE
    useEffect(() => {
        try {
            const savedStation = sessionStorage.getItem('selectedStation');
            if (savedStation) {
                const station = JSON.parse(savedStation);
                setSelectedStation(station);
                console.log('Đã load lại trạm từ sessionStorage:', station);
            }
        } catch (error) {
            console.error('Lỗi khi load trạm từ sessionStorage:', error);
        }
    }, [setSelectedStation]);

    // 3. GỌI API THẬT KHI COMPONENT ĐƯỢC TẢI
    useEffect(() => {
        const fetchStations = async () => {
            setLoading(true);
            setError(null);
            try {
                // Gọi API thật
                const data = await stationService.getAllStations();
                
                // Backend của bạn có thể trả về { success: true, data: [...] }
                // hoặc chỉ là mảng [..]
                // (Dựa trên file swapService bạn gửi, nó có thể trả về object { success, data })
                if (data && data.success && Array.isArray(data.data)) {
                    setStations(data.data); // Lấy từ object
                } else if (Array.isArray(data)) {
                    setStations(data); // Nếu trả về mảng trực tiếp
                } else {
                    console.warn("Dữ liệu trạm không đúng định dạng:", data);
                    setStations([]); // Đặt là mảng rỗng để tránh lỗi
                }

            } catch (err) {
                console.error("Lỗi khi tải danh sách trạm:", err);
                setError(err.message || "Không thể tải danh sách trạm.");
            } finally {
                setLoading(false);
            }
        };

        fetchStations();
    }, []); // Rỗng, chỉ chạy 1 lần

    const handleSelect = (station) => {
        // 3. KIỂM TRA TRẠNG THÁI THẬT TỪ API
        // (Bạn cần xem API trả về "Hoạt động" hay "HOAT_DONG")
        if (station.status !== 'HOAT_DONG' && station.status !== 'Hoạt động') {
             return; // Không cho chọn trạm bảo trì
        }
        
        // 4. LƯU TRẠM VÀO SESSION STORAGE
        try {
            sessionStorage.setItem('selectedStation', JSON.stringify(station));
            console.log('Đã lưu trạm vào sessionStorage:', station);
        } catch (error) {
            console.error('Lỗi khi lưu trạm vào sessionStorage:', error);
        }
        
        setSelectedStation(station);    
        goToStep(STEPS.SELECT_TOWER); 
    };

    // 4. HIỂN THỊ TRẠNG THÁI LOADING / LỖI
    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Đang tải danh sách trạm...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>
            Lỗi: {error}
        </div>;
    }

    return (
        <div className="station-selector-container">
            <h2 className="station-selector-title">1. Chọn trạm đổi pin</h2>
            <div className="station-grid">
                {stations.length > 0 ? (
                    stations.map(st => (
                        <StationCard 
                            key={st.id || st.stationId} // Dùng key chính từ DB
                            station={st} 
                            onSelect={() => handleSelect(st)} 
                        />
                    ))
                ) : (
                    <p style={{ color: 'gray' }}>Không tìm thấy trạm nào đang hoạt động.</p>
                )}
            </div>
        </div>
    );
};

// Component con (StationCard)
const StationCard = ({ station, onSelect }) => {
    // (Giả sử API trả về 'status' là "HOAT_DONG" hoặc "BAO_TRI")
    const isMaintenance = (station.status !== 'HOAT_DONG' && station.status !== 'Hoạt động');
    const cardClass = `station-card ${isMaintenance ? 'maintenance' : ''}`;
    
    // Hiển thị chữ cho đẹp
    const statusText = isMaintenance ? 'Bảo trì' : 'Hoạt động';
    const statusClass = `station-status ${isMaintenance ? 'maintenance' : 'active'}`;

    return (
        <div className={cardClass} onClick={onSelect}>
            <div className="station-card-header">
                {/* Dùng tên thật từ API */}
                <h3 className="station-name">{station.name || station.stationName}</h3>
                <span className={statusClass}>
                    {statusText}
                </span>
            </div>
            <div className="station-address">
                {/* <FaMapMarkerAlt style={{ marginRight: '8px' }} /> */}
                {/* Dùng địa chỉ thật từ API */}
                <span>{station.address}</span>
            </div>
        </div>
    );
};
export default StationSelector;