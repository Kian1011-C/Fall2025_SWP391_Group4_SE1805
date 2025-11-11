// src/hooks/useSwapBattery.js (hoặc đường dẫn của bạn)

import { useState, useCallback } from 'react';
// ✅ SỬ DỤNG staffSwapService cho Staff Manual Swap
import staffSwapService from '../../../../assets/js/services/staffSwapService'; 

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
            const response = await staffSwapService.getAllSwaps({ userId, limit });
            if (response && Array.isArray(response)) {
                setSwapHistory(response);
            } else {
                throw new Error('Không thể lấy lịch sử swap');
            }
        } catch (err) {
            setError(err.message);
            setSwapHistory([]);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // 2. Lấy tất cả swap (admin/staff)
    const getAllSwaps = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await staffSwapService.getAllSwaps();
            if (response && Array.isArray(response)) {
                setAllSwaps(response);
            } else {
                throw new Error('Không thể lấy tất cả swap');
            }
        } catch (err) {
            setError(err.message);
            setAllSwaps([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 3. Lấy danh sách pin có sẵn ở kho (in_stock)
    // ⚠️ Staff lấy pin từ KHO (status = 'in_stock'), không phải từ tower
    const fetchAvailableBatteries = useCallback(async (stationId) => {
        setIsLoading(true);
        setError(null);
        try {
            // Import batteryService để lấy pin từ kho
            const batteryService = await import('../../../../assets/js/services/batteryService.js');
            const response = await batteryService.default.getAllBatteries({ status: 'in_stock' });
            
            if (response.success) {
                setAvailableBatteries(response.data || []);
            } else {
                throw new Error(response.message || 'Không thể tải danh sách pin trong kho');
            }
        } catch (err) {
            setError(err.message);
            setAvailableBatteries([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 4. Tạo swap mới (STAFF MANUAL SWAP - SỬ DỤNG staffSwapService)
    const handleInitiateSwap = async (formData) => {
        // [LOG DEBUG 1] Kiểm tra dữ liệu thô từ Form
        console.log('[useSwapBattery - STAFF] handleInitiateSwap: Nhận được formData:', formData);
        console.log(`[useSwapBattery - STAFF] KIỂM TRA các field quan trọng:`);
        console.log(`  ├─ userId: ${formData?.userId}`);
        console.log(`  ├─ vehicleId: ${formData?.vehicleId}`);
        console.log(`  ├─ oldBatteryId: ${formData?.oldBatteryId}`);
        console.log(`  ├─ newBatteryId: ${formData?.newBatteryId}`);
        console.log(`  ├─ contractId: ${formData?.contractId}`);
        console.log(`  └─ staffId: ${formData?.staffId}`);

        setIsSubmitting(true);
        setError(null);
        try {
            // ✅ Gọi staffSwapService.createManualSwap() thay vì swapService.initiateSwap()
            const response = await staffSwapService.createManualSwap(formData);
            
            if (response && response.swapId) {
                console.log('✅ [useSwapBattery - STAFF] Tạo swap thành công:', response);
                setSwapDetails(response);
                setStep('in_progress');
            } else {
                throw new Error('Khởi tạo swap thất bại - Không nhận được swapId');
            }
        } catch (err) {
            console.error('[useSwapBattery - STAFF] Lỗi khi gọi handleInitiateSwap:', err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. Xác nhận swap (STAFF COMPLETE SWAP)
    const handleConfirmSwap = async () => {
        if (!swapDetails) return;
        setIsSubmitting(true);
        setError(null);
        try {
            console.log('[useSwapBattery - STAFF] Xác nhận hoàn thành swap:', swapDetails.swapId);
            
            // ✅ Gọi staffSwapService.completeSwap() thay vì swapService.confirmSwap()
            const response = await staffSwapService.completeSwap(swapDetails.swapId);
            
            if (response && response.success) {
                alert('Đổi pin thành công!');
                setStep('form');
                setSwapDetails(null);
                setAvailableBatteries([]);
            } else {
                throw new Error(response?.message || 'Xác nhận swap thất bại');
            }
        } catch (err) {
            console.error('[useSwapBattery - STAFF] Lỗi khi xác nhận swap:', err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 6. Hủy swap (STAFF CANCEL SWAP)
    const cancelSwap = async () => {
        if (swapDetails?.swapId) {
            try {
                console.log('[useSwapBattery - STAFF] Hủy swap:', swapDetails.swapId);
                await staffSwapService.cancelSwap(swapDetails.swapId);
            } catch (err) {
                console.error('[useSwapBattery - STAFF] Lỗi khi hủy swap:', err);
            }
        }
        
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
        cancelSwap
    };
};