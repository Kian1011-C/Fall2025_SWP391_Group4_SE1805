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
                console.log('📤 Gọi API /api/stations');
                
                // Gọi API thật (backend trả về tất cả trạm)
                const data = await stationService.getAllStations();
                
                console.log('📥 Response từ API:', data);
                
                // Backend trả về { success: true, data: [...] }
                if (data && data.success && Array.isArray(data.data)) {
                    // Lọc ở frontend: chỉ lấy trạm đang hoạt động và có pin khả dụng
                    const activeStations = data.data.filter(station => {
                        // Kiểm tra trạm đang hoạt động
                        const isActive = station.status === 'HOAT_DONG' || 
                                       station.status === 'Hoạt động' || 
                                       station.status === 'active' ||
                                       station.status === 'ACTIVE';
                        
                        // Kiểm tra có pin khả dụng (backend trả về availableBatteries)
                        const hasAvailableBatteries = station.availableBatteries && 
                                                     station.availableBatteries > 0;
                        
                        return isActive && hasAvailableBatteries;
                    });
                    
                    console.log(`✅ Đã lọc ${activeStations.length}/${data.data.length} trạm (hoạt động + có pin)`);
                    setStations(activeStations);
                } else if (Array.isArray(data)) {
                    // Nếu trả về mảng trực tiếp
                    const activeStations = data.filter(station => {
                        const isActive = station.status === 'HOAT_DONG' || 
                                       station.status === 'Hoạt động' || 
                                       station.status === 'active' ||
                                       station.status === 'ACTIVE';
                        const hasAvailableBatteries = station.availableBatteries && 
                                                     station.availableBatteries > 0;
                        return isActive && hasAvailableBatteries;
                    });
                    console.log(`✅ Đã lọc ${activeStations.length}/${data.length} trạm`);
                    setStations(activeStations);
                } else {
                    console.warn("Dữ liệu trạm không đúng định dạng:", data);
                    setStations([]); // Đặt là mảng rỗng để tránh lỗi
                }

            } catch (err) {
                console.error("❌ Lỗi khi tải danh sách trạm:", err);
                setError(err.message || "Không thể tải danh sách trạm.");
            } finally {
                setLoading(false);
            }
        };

        fetchStations();
    }, []); // Rỗng, chỉ chạy 1 lần

    const handleSelect = (station) => {
        // 3. KIỂM TRA TRẠNG THÁI THẬT TỪ API
        const isActive = station.status === 'HOAT_DONG' || 
                        station.status === 'Hoạt động' || 
                        station.status === 'active' ||
                        station.status === 'ACTIVE';
        
        if (!isActive) {
            console.warn('⚠️ Không thể chọn trạm đang bảo trì:', station.name);
            return; // Không cho chọn trạm bảo trì
        }
        
        // Kiểm tra số pin khả dụng (backend trả về availableBatteries)
        if (!station.availableBatteries || station.availableBatteries <= 0) {
            console.warn('⚠️ Trạm không có pin khả dụng:', station.name);
            alert('Trạm này hiện không có pin khả dụng. Vui lòng chọn trạm khác.');
            return;
        }
        
        // 4. LƯU TRẠM VÀO SESSION STORAGE
        try {
            sessionStorage.setItem('selectedStation', JSON.stringify(station));
            console.log('✅ Đã lưu trạm vào sessionStorage:', station);
        } catch (error) {
            console.error('❌ Lỗi khi lưu trạm vào sessionStorage:', error);
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
    // Kiểm tra trạng thái trạm (backend trả về status)
    const isActive = station.status === 'HOAT_DONG' || 
                    station.status === 'Hoạt động' || 
                    station.status === 'active' ||
                    station.status === 'ACTIVE';
    
    const isMaintenance = !isActive;
    const cardClass = `station-card ${isMaintenance ? 'maintenance' : ''}`;
    
    // Hiển thị trạng thái và số pin khả dụng (backend trả về availableBatteries)
    let statusText = 'Hoạt động';
    if (isMaintenance) {
        statusText = 'Bảo trì';
    } else if (station.availableBatteries !== undefined) {
        statusText = `${station.availableBatteries} pin khả dụng`;
    }
    
    const statusClass = `station-status ${isMaintenance ? 'maintenance' : 'active'}`;

    return (
        <div 
            className={cardClass} 
            onClick={isMaintenance ? undefined : onSelect}
            style={{ cursor: isMaintenance ? 'not-allowed' : 'pointer' }}
        >
            <div className="station-card-header">
                {/* Dùng tên thật từ API - backend trả về "name" */}
                <h3 className="station-name">{station.name || station.stationName}</h3>
                <span className={statusClass}>
                    {statusText}
                </span>
            </div>
            <div className="station-address">
                {/* <FaMapMarkerAlt style={{ marginRight: '8px' }} /> */}
                {/* Dùng địa chỉ thật từ API - backend trả về "location" và "address" */}
                <span>{station.address || station.location}</span>
            </div>
        </div>
    );
};
export default StationSelector;