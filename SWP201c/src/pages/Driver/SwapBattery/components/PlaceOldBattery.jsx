// src/pages/Driver/SwapBattery/components/PlaceOldBattery.jsx
import React, { useContext, useState, useEffect } from 'react'; // Add useEffect
import { SwapContext } from '../index'; 

const PlaceOldBattery = () => {
    // 1. GET DATA FROM CONTEXT
    const { transaction, confirmSwap, isLoading, oldBatteryId } = useContext(SwapContext);

    // 2. STATE FOR THE FORM
    const [code, setCode] = useState(oldBatteryId ? String(oldBatteryId) : ''); // Real ID
    const [percent, setPercent] = useState(0); // Initialize percentage state
    const [isPercentGenerated, setIsPercentGenerated] = useState(false); // Flag to ensure random generation happens only once

    // 3. GENERATE RANDOM PERCENTAGE ON MOUNT
    useEffect(() => {
        if (!isPercentGenerated) {
            // Generate a random integer between 5 and 60 (simulating a used battery)
            const randomPercent = Math.floor(Math.random() * 56) + 5; // Generates 5 to 60
            setPercent(randomPercent);
            setIsPercentGenerated(true); // Mark as generated
            console.log(`Simulated old battery percentage: ${randomPercent}%`);
        }
    }, [isPercentGenerated]); // Run only when isPercentGenerated changes

    // 4. HANDLE SUBMIT
    const handleSubmit = (e) => {
        e.preventDefault();
        // Send the real ID and the *randomly generated* percentage
        confirmSwap({
            batteryCode: code,
            batteryPercent: percent // Send the random percentage
        });
    };

    // Get the empty slot number
    const emptySlotNumber = transaction?.emptySlot || '...';

    return (
        <div className="station-selector-container">
            <h2 className="station-selector-title">3. Trả pin cũ</h2>

            <div className="place-battery-card">
                <p className="place-battery-label">Mời bạn đặt pin cũ vào hộc số:</p>
                <h1 className="place-battery-slot-number">{emptySlotNumber}</h1>

                {/* Simulation Form */}
                <form onSubmit={handleSubmit} className="simulation-form">
                    <p className="simulation-label">Thông tin pin cũ (Mô phỏng):</p>
                    <div className="form-group">
                        <label htmlFor="batCode">Mã/ID pin cũ:</label>
                        <input
                            type="text"
                            id="batCode"
                            value={code} // Display real ID
                            readOnly // Make ID read-only
                            className="readonly-input" // Add a class for styling
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="batPercent">% pin cũ (Đã quét - Random):</label>
                        <input
                            type="number"
                            id="batPercent"
                            value={percent} // Display random percentage
                            readOnly // Make percentage read-only
                            className="readonly-input" // Add a class for styling
                        />
                    </div>

                    <button
                        type="submit"
                        className="place-battery-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang xác nhận..." : "Tôi đã đặt pin"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PlaceOldBattery;