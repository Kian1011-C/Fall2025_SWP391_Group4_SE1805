import React, { useContext, useState } from 'react';
import { SwapContext } from '../index';

const PlaceOldBattery = () => {
    const { transaction, confirmOldBattery, isLoading } = useContext(SwapContext);
    
    // Form mô phỏng
    const [code, setCode] = useState('P99'); // Dữ liệu giả
    const [percent, setPercent] = useState(20); // Dữ liệu giả

    const handleSubmit = (e) => {
        e.preventDefault();
        confirmOldBattery({
            batteryCode: code,
            batteryPercent: parseInt(percent, 10)
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>3. Mời đặt pin cũ vào hộc:</h2>
            <h1 style={{ fontSize: '3rem', color: 'blue' }}>{transaction?.emptySlotNumber}</h1>
            
            <h4>Form mô phỏng (nhập thông tin pin cũ):</h4>
            <div>
                <label>Mã pin cũ:</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)} required />
            </div>
            <div style={{marginTop: '10px'}}>
                <label>% pin cũ:</label>
                <input type="number" value={percent} onChange={e => setPercent(e.target.value)} required />
            </div>
            
            <button type="submit" disabled={isLoading} style={{marginTop: '20px'}}>
                Tôi đã đặt pin
            </button>
        </form>
    );
};
export default PlaceOldBattery;