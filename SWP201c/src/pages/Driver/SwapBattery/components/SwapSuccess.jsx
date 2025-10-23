import React, { useContext, useEffect } from 'react';
import { SwapContext } from '../index';
import { formatPercentage } from '../utils/swapHelpers'; 

const SwapSuccess = ({ onFinish }) => {
    const { summary } = useContext(SwapContext);

    // XÓA SESSION STORAGE KHI HOÀN THÀNH ĐỔI PIN
    useEffect(() => {
        try {
            sessionStorage.removeItem('selectedStation');
            sessionStorage.removeItem('selectedCabinet');
            sessionStorage.removeItem('oldBatteryId');
            sessionStorage.removeItem('newBatteryId');
            console.log('Đã xóa sessionStorage sau khi hoàn thành đổi pin');
        } catch (error) {
            console.error('Lỗi khi xóa sessionStorage:', error);
        }
    }, []);

    if (!summary) {
        return <div>Đang tải tóm tắt giao dịch...</div>;
    }

    return (
        <div>
            <h2>Đổi pin thành công!</h2>
            <h3>Tóm tắt giao dịch: {summary.transactionId}</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'left' }}>
                <div>
                    <h4>Pin cũ (Đã trả)</h4>
                    <p>Mã pin: {summary.oldBatteryCode}</p>
                    <p>Hộc số: {summary.oldSlotNumber}</p>
                    <p>Dung lượng: {formatPercentage(summary.oldBatteryPercent)}</p>
                </div>
                <div>
                    <h4>Pin mới (Đã nhận)</h4>
                    <p>Mã pin: {summary.newBatteryCode}</p>
                    <p>Hộc số: {summary.newSlotNumber}</p>
                    <p>Dung lượng: {formatPercentage(summary.newBatteryPercent)}</p>
                </div>
            </div>
            
            <button onClick={onFinish} style={{marginTop: '20px'}}>
                Về trang chủ
            </button>
        </div>
    );
};
export default SwapSuccess;