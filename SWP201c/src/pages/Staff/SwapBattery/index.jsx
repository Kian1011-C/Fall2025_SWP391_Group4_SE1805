import React from 'react';
import { useSwapBattery } from './hooks/useSwapBattery';
import InitiateSwapForm from './components/InitiateSwapForm';
import SwapInProgress from './components/SwapInProgress';

// Đây là thông tin bạn nên lấy từ Context/Redux sau khi nhân viên đăng nhập
const MOCK_STAFF_ID = "staff_001";
const MOCK_STATION_ID = 1; 

const SwapBatteryPage = () => {
    const {
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
    } = useSwapBattery(MOCK_STAFF_ID, MOCK_STATION_ID);

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ marginTop: 0, marginBottom: '30px' }}>Thực hiện Đổi Pin</h1>

            {/* * Component này sẽ render 1 trong 2 component con 
              * tùy thuộc vào trạng thái 'step' từ hook.
              */}
            
            {step === 'form' && (
                <InitiateSwapForm
                    isLoading={isLoading}
                    isSubmitting={isSubmitting}
                    error={error}
                    availableBatteries={availableBatteries}
                    fetchAvailableBatteries={() => fetchAvailableBatteries(MOCK_STATION_ID)}
                    onInitiateSwap={handleInitiateSwap}
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