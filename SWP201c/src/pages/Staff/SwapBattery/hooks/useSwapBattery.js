import { useState, useCallback } from 'react';
import swapService from '../../../../assets/js/services/swapService';

export const useSwapBattery = (staffId, defaultStationId) => {
    // 'form' = hiển thị form nhập liệu
    // 'in_progress' = hiển thị thông tin pin mới, chờ nhân viên xác nhận
    const [step, setStep] = useState('form');
    
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Dùng để lưu danh sách pin/tháp có sẵn tại trạm
    const [availableBatteries, setAvailableBatteries] = useState([]);
    
    // Dùng để lưu thông tin giao dịch sau khi initiate thành công
    const [swapDetails, setSwapDetails] = useState(null);

    // 1. Hàm tải danh sách pin có sẵn ở trạm
    const fetchAvailableBatteries = useCallback(async (stationId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await swapService.getBatteriesByStation(stationId);
            if (response.success) {
                // Lọc chỉ lấy các pin 'available' từ API
                const available = response.data.filter(bat => 
                    bat.status && bat.status.toUpperCase() === 'AVAILABLE'
                );
                setAvailableBatteries(available);
            } else {
                throw new Error(response.message || 'Không thể tải danh sách pin');
            }
        } catch (err) {
            setError(err.message);
            setAvailableBatteries([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. Hàm xử lý khởi tạo swap (bước 1)
    const handleInitiateSwap = async (formData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const requestBody = {
                ...formData,
                stationId: defaultStationId, // Lấy từ thông tin đăng nhập của staff
                staffId: staffId, // Lấy từ thông tin đăng nhập của staff
            };
            
            const response = await swapService.initiateSwap(requestBody);
            if (response.success) {
                setSwapDetails(response.data); // Lưu thông tin (slot, tower, newBatteryId)
                setStep('in_progress'); // Chuyển sang bước 2
            } else {
                throw new Error(response.message || 'Khởi tạo swap thất bại');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. Hàm xử lý xác nhận swap (bước 2)
    const handleConfirmSwap = async () => {
        if (!swapDetails) return;

        setIsSubmitting(true);
        setError(null);
        try {
            const response = await swapService.confirmSwap(swapDetails.swapId);
            if (response.success) {
                alert('Đổi pin thành công!');
                setStep('form'); // Quay lại form
                setSwapDetails(null);
                setAvailableBatteries([]);
            } else {
                throw new Error(response.message || 'Xác nhận swap thất bại');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // 4. Hàm để reset/hủy
    const cancelSwap = () => {
        setStep('form');
        setSwapDetails(null);
        setError(null);
        setAvailableBatteries([]);
    };

    return {
        step,
        isLoading,
        isSubmitting,
        error,
        availableBatteries,
        swapDetails,
        fetchAvailableBatteries,
        handleInitiateSwap,
        handleConfirmSwap,
        cancelSwap
    };
};