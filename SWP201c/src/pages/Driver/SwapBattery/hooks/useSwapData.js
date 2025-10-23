// hooks/useSwapData.js
import { useState } from 'react';

// SỬA IMPORT: Import service của bạn, dùng default import (không có {})
// Đường dẫn này trỏ đến /src/services/swapService.js
import swapService from '/src/assets/js/services/swapService.js';

export const useSwapData = (goToStep, STEPS) => {
    // Dữ liệu chung của luồng
    const [selectedStation, setSelectedStation] = useState(null);
    const [selectedCabinet, setSelectedCabinet] = useState(null);
    
    // Dữ liệu từ API
    // transaction sẽ lưu trữ { swapId, emptySlot, newBattery }
    const [transaction, setTransaction] = useState(null); 
    const [summary, setSummary] = useState(null); // Tóm tắt cuối cùng
    
    // Trạng thái chung
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * API 1: Bắt đầu đổi pin
     * (Sử dụng hàm initiateSwap trong service,
     * hàm này gọi POST /api/swaps của BE)
     */
    const initiateSwap = async (cabinet) => {
        setSelectedCabinet(cabinet);
        setIsLoading(true);
        setError(null);

        try {
            // SỬA LẠI: Truyền thêm stationId từ 'selectedStation'
            // vì hàm createSwap (BE) của bạn cần nó.
            const response = await swapService.initiateSwap({ 
                cabinetId: cabinet.id,
                stationId: selectedStation.id || selectedStation.stationId // Truyền stationId
            });
            
            // Lưu dữ liệu trả về (đã được service giả lập)
            setTransaction(response); 
            goToStep(STEPS.PLACE_OLD_BATTERY); 
        } catch (err) {
            const apiError = err.response?.data?.message || err.message;
            setError(apiError || "Lỗi khi bắt đầu đổi pin");
            goToStep(STEPS.SELECT_TOWER); 
        }
        setIsLoading(false);
    };

    /**
     * API 2: Xác nhận hoàn tất
     * (Sử dụng hàm confirmSwap trong service,
     * hàm này gọi POST /api/swaps/{id}/confirm của BE)
     */
    const confirmSwap = async (oldBatteryData) => {
        setIsLoading(true);
        setError(null);

        try {
            // Lấy swapId từ 'transaction' (được trả về từ API 1)
            const swapId = transaction.swapId; 
            
            // Gọi API xác nhận (service sẽ không gửi body, vì BE không cần)
            const response = await swapService.confirmSwap(swapId, oldBatteryData);
            
            // Gán tóm tắt (là dữ liệu swap đã update mà BE trả về)
            setSummary(response); 
            goToStep(STEPS.SUCCESS); 
        } catch (err) {
            const apiError = err.response?.data?.message || err.message;
            setError(apiError || "Lỗi khi xác nhận hoàn tất");
            goToStep(STEPS.PLACE_OLD_BATTERY);
        }
        setIsLoading(false);
    };

    // Hàm reset
    const resetSwapData = () => {
        setSelectedStation(null);
        setSelectedCabinet(null);
        setTransaction(null);
        setSummary(null);
        setError(null);
    };

    // Trả về tất cả state và hàm để "bộ não" (index.jsx) sử dụng
    return {
        selectedStation,
        selectedCabinet,
        transaction,
        summary,
        isLoading,
        error,
        setSelectedStation,
        initiateSwap,
        confirmSwap,
        resetSwapData,
        setError,
    };
};