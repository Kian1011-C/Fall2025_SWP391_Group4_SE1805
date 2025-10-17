import { useState, useEffect, useCallback } from 'react';
import batteryService from '../../../../assets/js/services/batteryService';

export const useBatteryStockData = () => {
    const [batteries, setBatteries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBatteries = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true); // Bắt đầu tải
            
            // --- THAY DỮ LIỆU GIẢ BẰNG API THẬT ---
            const response = await batteryService.getAllBatteries();

            if (response.success && Array.isArray(response.data)) {
                setBatteries(response.data);
            } else {
                throw new Error(response.message || "Lỗi khi tải dữ liệu kho pin");
            }
        } catch(err) {
            setError(err.message || "Không thể kết nối đến server.");
        } finally {
            setIsLoading(false); // Kết thúc tải
        }
    }, []);

    useEffect(() => {
        fetchBatteries();
    }, [fetchBatteries]);

    return { batteries, isLoading, error, refetch: fetchBatteries }; // Thêm hàm refetch
};