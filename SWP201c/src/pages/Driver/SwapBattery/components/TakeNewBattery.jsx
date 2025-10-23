import React, { useContext } from 'react';
import { SwapContext } from '../index';

const TakeNewBattery = () => {
    const { newBattery, completeSwap, isLoading } = useContext(SwapContext);

    return (
        <div>
            <h2>4. Mời lấy pin mới từ hộc:</h2>
            <h1 style={{ fontSize: '3rem', color: 'green' }}>{newBattery?.newBatterySlot}</h1>
            
            <h4>Thông tin pin mới:</h4>
            <p>Mã pin: {newBattery?.newBatteryCode}</p>
            <p>% pin: {newBattery?.newBatteryPercent}%</p>
            
            <button onClick={completeSwap} disabled={isLoading} style={{marginTop: '20px'}}>
                Tôi đã lấy pin (Hoàn tất)
            </button>
        </div>
    );
};
export default TakeNewBattery;