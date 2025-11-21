import React from 'react';
import { FiBattery, FiRepeat, FiUser, FiMapPin, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { useSwapBattery } from './hooks/useSwapBattery';
import InitiateSwapForm from './components/InitiateSwapForm';
import SwapInProgress from './components/SwapInProgress';

// Thông tin mẫu cho trạm
const MOCK_STATION_ID = 1;

const SwapBatteryPage = () => {
    // Lấy thông tin staff đang đăng nhập từ AuthContext
    const { currentUser } = useAuth();
    
    // Lấy staffId từ currentUser, nếu không có thì dùng 'staff001' (để test)
    // Trong production, PHẢI đăng nhập và có userId hợp lệ
    const currentStaffId = currentUser?.userId || 'staff001';
    
    console.log(' Staff đang đăng nhập:', {
        currentUser,
        currentStaffId,
        userId: currentUser?.userId,
        email: currentUser?.email,
        role: currentUser?.role
    });
    
    const {
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
    } = useSwapBattery(null, currentStaffId, MOCK_STATION_ID); // userId = null ban đầu

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ marginTop: 0, marginBottom: '30px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiRepeat size={32} /> Thực hiện Đổi Pin
            </h1>
            
            {/* Hiển thị thông tin nhân viên */}
            <div style={{ marginBottom: '20px', background: '#1e293b', borderRadius: '12px', padding: '16px' }}>
                <p style={{ margin: 0, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiUser size={18} /> Nhân viên: <strong style={{ color: 'white' }}>
                        {currentUser?.name || currentUser?.email || currentUser?.userId || 'Chưa đăng nhập'}
                    </strong>
                </p>
               
                {!currentStaffId && (
                    <p style={{ margin: '5px 0 0 0', color: '#ef4444', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiAlertTriangle size={16} /> Cảnh báo: Không tìm thấy Staff ID. Staff ID sẽ để NULL trong giao dịch.
                    </p>
                )}
            </div>

            {step === 'form' && (
                <InitiateSwapForm
                    isLoading={isLoading}
                    isSubmitting={isSubmitting}
                    error={error}
                    availableBatteries={availableBatteries}
                    fetchAvailableBatteries={() => fetchAvailableBatteries(MOCK_STATION_ID)}
                    onInitiateSwap={handleInitiateSwap}
                    currentStaffId={currentStaffId} // Truyền staffId
                />
            )}

            {step === 'in_progress' && (
                <SwapInProgress
                    swapDetails={swapDetails}
                    isSubmitting={isSubmitting}
                    onConfirmSwap={handleConfirmSwap}
                    onCancel={cancelSwap}
                />
            )}
        </div>
    );
};

export default SwapBatteryPage;