// src/hooks/useSwapBattery.js (hoặc đường dẫn của bạn)

import { useState, useCallback } from 'react';
// Đảm bảo đường dẫn này chính xác
import swapService from '../../../../assets/js/services/swapService'; 

export const useSwapBattery = (userId, staffId, defaultStationId) => {
    // 'form' = hiển thị form nhập liệu
    // 'in_progress' = hiển thị thông tin pin mới, chờ nhân viên xác nhận
    const [step, setStep] = useState('form');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [availableBatteries, setAvailableBatteries] = useState([]);
    const [swapDetails, setSwapDetails] = useState(null);
    const [swapHistory, setSwapHistory] = useState([]);
    const [allSwaps, setAllSwaps] = useState([]);

    // 1. Lấy lịch sử swap của user
    const getUserSwapHistory = useCallback(async (limit = 10) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await swapService.getUserSwapHistory(userId, limit);
            if (response.success) {
                setSwapHistory(response.data);
            } else {
                throw new Error(response.message || 'Không thể lấy lịch sử swap');
            }
        } catch (err) {
            setError(err.message);
            setSwapHistory([]);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // 2. Lấy tất cả swap (admin)
    const getAllSwaps = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await swapService.getAllSwaps();
            if (response.success) {
                setAllSwaps(response.data);
            } else {
                throw new Error(response.message || 'Không thể lấy tất cả swap');
            }
        } catch (err) {
            setError(err.message);
            setAllSwaps([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 3. Lấy danh sách pin có sẵn ở trạm
    const fetchAvailableBatteries = useCallback(async (stationId) => {
        setIsLoading(true);
        setError(null);
        try {
            // Sử dụng stationId được truyền vào, hoặc defaultStationId nếu không có
            const id = stationId || defaultStationId;
            if (!id) {
                throw new Error("Missing stationId to fetch batteries.");
            }
            const response = await swapService.getBatteriesByStation(id);
            if (response.success) {
                const available = response.data.filter(bat => bat.status && bat.status.toUpperCase() === 'AVAILABLE');
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
    }, [defaultStationId]);

    // 4. Tạo swap mới (ĐÃ THÊM LOG DEBUG + TRUYỀN ĐẦY ĐỦ DỮ LIỆU)
    const handleInitiateSwap = async (formData) => {
        // [LOG DEBUG 1] Kiểm tra dữ liệu thô từ Form
        console.log('[useSwapBattery] handleInitiateSwap: Nhận được formData sau:', formData);
        console.log(`[useSwapBattery] KIỂM TRA các field quan trọng:`);
        console.log(`  ├─ userId: ${formData?.userId}`);
        console.log(`  ├─ vehicleId: ${formData?.vehicleId}`);
        console.log(`  ├─ oldBatteryId: ${formData?.oldBatteryId}`);
        console.log(`  ├─ newBatteryId: ${formData?.newBatteryId}`);
        console.log(`  ├─ contractId: ${formData?.contractId}`);
        console.log(`  └─ staffId: ${formData?.staffId}`);

        setIsSubmitting(true);
        setError(null);
        try {
            const requestBody = {
                userId: formData.userId,
                vehicleId: formData.vehicleId,
                oldBatteryId: formData.oldBatteryId || null,
                newBatteryId: formData.newBatteryId,
                contractId: formData.contractId || null, // Truyền contractId
                stationId: defaultStationId,
                staffId: formData.staffId || staffId, // Ưu tiên staffId từ form
            };

            // [LOG DEBUG 2] Kiểm tra đối tượng đầy đủ TRƯỚC KHI gửi
            console.log('[useSwapBattery] Chuẩn bị gửi requestBody này đến swapService:', requestBody);

            const response = await swapService.initiateSwap(requestBody);
            
            if (response.swapId) {
                setSwapDetails(response);
                setStep('in_progress');
            } else {
                throw new Error(response.message || 'Khởi tạo swap thất bại');
            }
        } catch (err) {
            // Lỗi này là lỗi từ swapService (đã throw)
            console.error('[useSwapBattery] Lỗi khi gọi handleInitiateSwap:', err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. Xác nhận swap
    const handleConfirmSwap = async () => {
        if (!swapDetails) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await swapService.confirmSwap(swapDetails.swapId);
            if (response) {
                alert('Đổi pin thành công!');
                setStep('form');
                setSwapDetails(null);
                setAvailableBatteries([]);
            } else {
                throw new Error('Xác nhận swap thất bại');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 6. Tạo auto swap (nếu cần)
    const handleAutoSwap = async (formData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await swapService.createAutoSwap(formData);
            if (response.success) {
                setSwapDetails(response.data);
                setStep('in_progress');
            } else {
                throw new Error(response.message || 'Tạo auto swap thất bại');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 7. Reset/hủy swap
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
        swapHistory,
        allSwaps,
        getUserSwapHistory,
        getAllSwaps,
        fetchAvailableBatteries,
        handleInitiateSwap,
        handleConfirmSwap,
        handleAutoSwap,
        cancelSwap
    };
};