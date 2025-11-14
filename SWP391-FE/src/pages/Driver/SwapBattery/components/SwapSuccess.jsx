import React, { useContext, useState, useEffect } from 'react';
import { SwapContext } from '../index';
import { formatPercentage } from '../utils/swapHelpers'; 
import batteryService from '/src/assets/js/services/batteryService.js';
import '../../../../assets/css/swap-success.css'; 

const SwapSuccess = ({ onFinish }) => {
    const context = useContext(SwapContext);
    const { summary } = context || {}; // Add fallback for undefined context
    const [oldBatteryLevel, setOldBatteryLevel] = useState(null);
    const [newBatteryLevel, setNewBatteryLevel] = useState(null);
    const [loading, setLoading] = useState(true);

    // LẤY DUNG LƯỢNG PIN CŨ VÀ PIN MỚI THẬT TỪ API
    useEffect(() => {
        const fetchBatteryLevels = async () => {
            try {
                setLoading(true);
                
                // Lấy ID pin cũ từ sessionStorage hoặc summary
                const oldBatteryId = summary?.oldBatteryId || 
                                   summary?.oldBatteryCode ||
                                   sessionStorage.getItem('batteryId') || 
                                   sessionStorage.getItem('old_battery_id') || 
                                   sessionStorage.getItem('oldBatteryId');
                
                // Lấy ID pin mới từ summary hoặc sessionStorage
                const newBatteryId = summary?.newBatteryId || 
                                    summary?.newBatteryCode ||
                                    sessionStorage.getItem('new_battery_id') || 
                                    sessionStorage.getItem('newBatteryId');
                
                // Fetch cả 2 pin song song
                const promises = [];
                
                // Fetch pin cũ
                if (oldBatteryId && oldBatteryId !== 'undefined' && oldBatteryId !== 'null') {
                    console.log(' Lấy dung lượng pin cũ thật từ API cho batteryId:', oldBatteryId);
                    promises.push(
                        batteryService.getBatteryById(oldBatteryId)
                            .then(batteryResponse => {
                                if (batteryResponse.success && batteryResponse.data) {
                                    const batteryData = batteryResponse.data;
                                    const batteryLevel = batteryData.stateOfHealth || batteryData.state_of_health || 
                                                       batteryData.batteryLevel || batteryData.battery_level || null;
                                    
                                    console.log(' Dung lượng pin cũ thật từ API:', batteryLevel);
                                    setOldBatteryLevel(batteryLevel);
                                } else {
                                    console.warn(' Không lấy được dung lượng pin cũ từ API');
                                    // Fallback từ sessionStorage
                                    const savedLevel = sessionStorage.getItem('oldBatteryLevel');
                                    if (savedLevel) {
                                        setOldBatteryLevel(parseFloat(savedLevel));
                                    }
                                }
                            })
                            .catch(error => {
                                console.error(' Lỗi khi lấy dung lượng pin cũ:', error);
                                // Fallback từ sessionStorage
                                const savedLevel = sessionStorage.getItem('oldBatteryLevel');
                                if (savedLevel) {
                                    setOldBatteryLevel(parseFloat(savedLevel));
                                }
                            })
                    );
                } else {
                    console.warn(' Không tìm thấy oldBatteryId');
                    // Fallback từ sessionStorage
                    const savedLevel = sessionStorage.getItem('oldBatteryLevel');
                    if (savedLevel) {
                        setOldBatteryLevel(parseFloat(savedLevel));
                    }
                }
                
                // Fetch pin mới
                if (newBatteryId && newBatteryId !== 'undefined' && newBatteryId !== 'null') {
                    console.log(' Lấy dung lượng pin mới thật từ API cho batteryId:', newBatteryId);
                    promises.push(
                        batteryService.getBatteryById(newBatteryId)
                            .then(batteryResponse => {
                                if (batteryResponse.success && batteryResponse.data) {
                                    const batteryData = batteryResponse.data;
                                    const batteryLevel = batteryData.stateOfHealth || batteryData.state_of_health || 
                                                       batteryData.batteryLevel || batteryData.battery_level || null;
                                    
                                    console.log(' Dung lượng pin mới thật từ API:', batteryLevel);
                                    setNewBatteryLevel(batteryLevel);
                                    // Cập nhật sessionStorage với dữ liệu từ API
                                    if (batteryLevel !== null) {
                                        sessionStorage.setItem('newBatteryLevel', String(batteryLevel));
                                    }
                                } else {
                                    console.warn(' Không lấy được dung lượng pin mới từ API');
                                    // Fallback từ sessionStorage hoặc summary
                                    const savedLevel = sessionStorage.getItem('newBatteryLevel');
                                    const summaryLevel = summary?.newBatteryPercent || summary?.newBatteryLevel;
                                    if (savedLevel) {
                                        setNewBatteryLevel(parseFloat(savedLevel));
                                    } else if (summaryLevel) {
                                        setNewBatteryLevel(parseFloat(summaryLevel));
                                    }
                                }
                            })
                            .catch(error => {
                                console.error(' Lỗi khi lấy dung lượng pin mới:', error);
                                // Fallback từ sessionStorage hoặc summary
                                const savedLevel = sessionStorage.getItem('newBatteryLevel');
                                const summaryLevel = summary?.newBatteryPercent || summary?.newBatteryLevel;
                                if (savedLevel) {
                                    setNewBatteryLevel(parseFloat(savedLevel));
                                } else if (summaryLevel) {
                                    setNewBatteryLevel(parseFloat(summaryLevel));
                                }
                            })
                    );
                } else {
                    console.warn(' Không tìm thấy newBatteryId');
                    // Fallback từ sessionStorage hoặc summary
                    const savedLevel = sessionStorage.getItem('newBatteryLevel');
                    const summaryLevel = summary?.newBatteryPercent || summary?.newBatteryLevel;
                    if (savedLevel) {
                        setNewBatteryLevel(parseFloat(savedLevel));
                    } else if (summaryLevel) {
                        setNewBatteryLevel(parseFloat(summaryLevel));
                    }
                }
                
                // Đợi tất cả các promise hoàn thành
                await Promise.all(promises);
                
            } catch (error) {
                console.error(' Lỗi khi lấy dung lượng pin:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchBatteryLevels();
    }, [summary]);

    // Debug log để kiểm tra dữ liệu
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(' SwapSuccess - DEBUG DỮ LIỆU TỪ API');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Summary object:', summary);
    console.log('Summary keys:', summary ? Object.keys(summary) : 'summary is null');
    console.log('');
    console.log(' THÔNG TIN PIN:');
    console.log('  ├─ summary?.oldBatteryId:', summary?.oldBatteryId);
    console.log('  ├─ summary?.newBatteryId:', summary?.newBatteryId);
    console.log('  ├─ sessionStorage old_battery_id:', sessionStorage.getItem('old_battery_id'));
    console.log('  └─ sessionStorage new_battery_id:', sessionStorage.getItem('new_battery_id'));
    console.log('');
    console.log(' THÔNG TIN SLOT:');
    console.log('  ├─ summary?.oldSlotNumber:', summary?.oldSlotNumber, '(slot trống nơi đặt pin cũ)');
    console.log('  ├─ summary?.newSlotNumber:', summary?.newSlotNumber, '(slot của pin mới)');
    console.log('  ├─ summary?.slotNumber:', summary?.slotNumber);
    console.log('  ├─ sessionStorage emptySlotNumber:', sessionStorage.getItem('emptySlotNumber'), '(slot trống)');
    console.log('  └─ sessionStorage newBatterySlot:', sessionStorage.getItem('newBatterySlot'), '(slot pin mới)');
    console.log('');
    console.log(' SessionStorage keys:', Object.keys(sessionStorage).filter(k => k.includes('Slot') || k.includes('slot') || k.includes('Battery')));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Tạo fallback data từ sessionStorage nếu summary không có dữ liệu
    const getOldBatteryCode = () => {
        if (summary?.oldBatteryCode) return summary.oldBatteryCode;
        
        const batteryId = sessionStorage.getItem('batteryId');
        const oldBatteryId = sessionStorage.getItem('old_battery_id');
        
        // Kiểm tra nếu giá trị là "undefined" hoặc null
        if (batteryId && batteryId !== 'undefined' && batteryId !== 'null') {
            return batteryId;
        }
        if (oldBatteryId && oldBatteryId !== 'undefined' && oldBatteryId !== 'null') {
            return oldBatteryId;
        }
        
        return 'N/A';
    };
    
    // Lấy newBatteryCode từ API response (nguồn chính xác nhất sau khi confirm)
    const getNewBatteryCode = () => {
        console.log(' Debug newBatteryId:');
        console.log(' summary?.newBatteryId:', summary?.newBatteryId);
        console.log(' summary?.newBatteryCode:', summary?.newBatteryCode);
        console.log(' sessionStorage new_battery_id:', sessionStorage.getItem('new_battery_id'));
        console.log(' sessionStorage newBatteryId:', sessionStorage.getItem('newBatteryId'));
        
        // Ưu tiên lấy từ API response - DỮ LIỆU CHÍNH XÁC NHẤT SAU KHI CONFIRM
        if (summary?.newBatteryId || summary?.newBatteryCode) {
            const apiNewBatteryId = summary.newBatteryId || summary.newBatteryCode;
            console.log(' SỬ DỤNG DỮ LIỆU TỪ API RESPONSE - newBatteryId:', apiNewBatteryId);
            return apiNewBatteryId;
        }
        
        // Fallback từ sessionStorage (đã được cập nhật trong completeSwap)
        const newBatteryId = sessionStorage.getItem('new_battery_id');
        if (newBatteryId && newBatteryId !== 'undefined' && newBatteryId !== 'null') {
            console.log(' Sử dụng newBatteryId từ sessionStorage (fallback):', newBatteryId);
            return newBatteryId;
        }
        
        console.warn(' Không tìm thấy newBatteryId từ API response hoặc sessionStorage');
        return 'N/A';
    };
    
    // Lấy oldSlotNumber từ summary hoặc sessionStorage (slot trống nơi đặt pin cũ)
    const getOldSlotNumber = () => {
        console.log(' DEBUG getOldSlotNumber:');
        console.log('  ├─ summary?.oldSlotNumber:', summary?.oldSlotNumber);
        console.log('  ├─ summary keys:', summary ? Object.keys(summary) : 'summary is null');
        console.log('  ├─ sessionStorage emptySlotNumber:', sessionStorage.getItem('emptySlotNumber'));
        console.log('  └─ context?.transaction?.emptySlot:', context?.transaction?.emptySlot);
        
        // Ưu tiên lấy từ API response (summary) sau khi confirm
        if (summary?.oldSlotNumber) {
            console.log(' Sử dụng oldSlotNumber từ API response (summary):', summary.oldSlotNumber);
            return String(summary.oldSlotNumber);
        }
        
        // Fallback từ sessionStorage (đã lưu ở PlaceOldBattery)
        const emptySlotFromStorage = sessionStorage.getItem('emptySlotNumber');
        if (emptySlotFromStorage && 
            emptySlotFromStorage !== 'undefined' && 
            emptySlotFromStorage !== 'null' && 
            emptySlotFromStorage.trim() !== '' &&
            emptySlotFromStorage !== 'N/A') {
            console.log(' Sử dụng emptySlotNumber từ sessionStorage:', emptySlotFromStorage);
            return emptySlotFromStorage;
        }
        
        // Kiểm tra transaction nếu có
        if (context?.transaction?.emptySlot || context?.transaction?.emptySlotNumber) {
            const txEmptySlot = context.transaction.emptySlot || context.transaction.emptySlotNumber;
            if (txEmptySlot && txEmptySlot !== '1' && txEmptySlot !== 1) {
                console.log(' Sử dụng emptySlot từ transaction:', txEmptySlot);
                return String(txEmptySlot);
            }
        }
        
        console.warn(' Không tìm thấy oldSlotNumber từ summary, sessionStorage, hoặc transaction');
        console.warn(' CẢNH BÁO: oldSlotNumber có thể đang dùng giá trị mặc định "1"');
        return 'N/A';
    };
    
    // Lấy newSlotNumber từ summary hoặc sessionStorage (slot của pin mới đã lấy)
    const getNewSlotNumber = () => {
        console.log(' DEBUG getNewSlotNumber:');
        console.log('  ├─ summary?.newSlotNumber:', summary?.newSlotNumber);
        console.log('  ├─ summary?.newSlot:', summary?.newSlot);
        console.log('  ├─ summary?.slotNumber:', summary?.slotNumber);
        console.log('  ├─ sessionStorage newBatterySlot:', sessionStorage.getItem('newBatterySlot'));
        console.log('  └─ summary keys:', summary ? Object.keys(summary) : 'summary is null');
        
        // Ưu tiên lấy từ API response (summary) sau khi confirm
        if (summary?.newSlotNumber) {
            console.log(' Sử dụng newSlotNumber từ API response (summary):', summary.newSlotNumber);
            return String(summary.newSlotNumber);
        }
        
        // Thử các field khác từ summary
        if (summary?.newSlot) {
            console.log(' Sử dụng newSlot từ API response (summary):', summary.newSlot);
            return String(summary.newSlot);
        }
        
        // Thử slotNumber từ summary (có thể là slot của pin mới)
        if (summary?.slotNumber && summary.slotNumber !== '1') {
            console.log(' Sử dụng slotNumber từ API response (summary):', summary.slotNumber);
            return String(summary.slotNumber);
        }
        
        // Fallback từ sessionStorage (đã lưu ở initiateSwap)
        const newSlotFromStorage = sessionStorage.getItem('newBatterySlot');
        if (newSlotFromStorage && newSlotFromStorage !== 'undefined' && newSlotFromStorage !== 'null') {
            console.log(' Sử dụng newBatterySlot từ sessionStorage:', newSlotFromStorage);
            return newSlotFromStorage;
        }
        
        console.warn(' Không tìm thấy newSlotNumber từ summary hoặc sessionStorage');
        console.warn(' CẢNH BÁO: newSlotNumber có thể đang dùng giá trị mặc định');
        return 'N/A';
    };
    
    // Lấy dung lượng pin cũ (ưu tiên từ API, không dùng mock data)
    const getOldBatteryPercent = () => {
        // Ưu tiên: oldBatteryLevel từ API > summary > sessionStorage > null
        if (oldBatteryLevel !== null && oldBatteryLevel !== undefined) {
            return oldBatteryLevel;
        }
        if (summary?.oldBatteryPercent !== null && summary?.oldBatteryPercent !== undefined) {
            return summary.oldBatteryPercent;
        }
        const savedLevel = sessionStorage.getItem('oldBatteryLevel');
        if (savedLevel && savedLevel !== 'null' && savedLevel !== 'undefined') {
            return parseFloat(savedLevel);
        }
        return null; // Không dùng mock data
    };
    
    // Lấy dung lượng pin mới (ưu tiên từ API, không dùng mock data)
    const getNewBatteryPercent = () => {
        // Ưu tiên: newBatteryLevel từ API > summary > sessionStorage > null
        if (newBatteryLevel !== null && newBatteryLevel !== undefined) {
            return newBatteryLevel;
        }
        if (summary?.newBatteryPercent !== null && summary?.newBatteryPercent !== undefined) {
            return summary.newBatteryPercent;
        }
        if (summary?.newBatteryLevel !== null && summary?.newBatteryLevel !== undefined) {
            return summary.newBatteryLevel;
        }
        const savedLevel = sessionStorage.getItem('newBatteryLevel');
        if (savedLevel && savedLevel !== 'null' && savedLevel !== 'undefined') {
            return parseFloat(savedLevel);
        }
        return null; // Không dùng mock data
    };
    
    const fallbackSummary = {
        oldBatteryCode: getOldBatteryCode(),
        oldSlotNumber: getOldSlotNumber(),
        oldBatteryPercent: getOldBatteryPercent(),
        newBatteryCode: getNewBatteryCode(),
        newSlotNumber: getNewSlotNumber(),
        newBatteryPercent: getNewBatteryPercent(),
        transactionId: summary?.transactionId || summary?.swapId || 'SWP-' + Date.now()
    };
    
    console.log('SwapSuccess - fallbackSummary:', fallbackSummary);

    // Hàm điều hướng về trang chủ
    const handleGoHome = () => {
        // Gọi hàm onFinish để điều hướng về dashboard
        if (onFinish) {
            onFinish();
        }
    };

    if (loading) {
        return (
            <div className="swap-success-container">
                <div className="success-card">
                    <div className="success-header">
                        <div className="loading-spinner"></div>
                        <h1 className="success-title">Đang tải thông tin pin...</h1>
                    </div>
                </div>
            </div>
        );
    }

    if (!summary && !fallbackSummary) {
        return (
            <div className="swap-success-container">
                <div className="success-card">
                    <div className="success-header">
                        <div className="loading-spinner"></div>
                        <h1 className="success-title">Đang tải tóm tắt giao dịch...</h1>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="swap-success-container">
            <div className="success-card">
                <div className="success-header">
                    <div className="success-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4"/>
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                    </div>
                    <h1 className="success-title">Đổi pin thành công!</h1>
                    <p className="success-subtitle">Giao dịch đã được hoàn tất thành công</p>
                </div>

                <div className="progress-section">
                    <h3 className="progress-title">Tiến trình đổi pin</h3>
                    <div className="progress-bar">
                        <div className="progress-step">
                            <div className="step-circle completed"></div>
                            <div className="step-label">Chọn trạm</div>
                            <div className="step-line completed"></div>
                        </div>
                        <div className="progress-step">
                            <div className="step-circle completed"></div>
                            <div className="step-label">Chọn trụ</div>
                            <div className="step-line completed"></div>
                        </div>
                        <div className="progress-step">
                            <div className="step-circle completed"></div>
                            <div className="step-label">Trả pin cũ</div>
                            <div className="step-line completed"></div>
                        </div>
                        <div className="progress-step">
                            <div className="step-circle completed"></div>
                            <div className="step-label">Lấy pin mới</div>
                            <div className="step-line completed"></div>
                        </div>
                        <div className="progress-step">
                            <div className="step-circle current">5</div>
                            <div className="step-label">Hoàn thành</div>
                        </div>
                    </div>
                </div>

                <div className="transaction-summary">
                    <h3 className="summary-title">Tóm tắt giao dịch</h3>
                    <div className="battery-info">
                        <div className="battery-card old-battery">
                            <div className="battery-title">
                                <div className="battery-icon old"></div>
                                Pin cũ (Đã trả)
                            </div>
                            <div className="battery-details">
                                <div className="detail-row">
                                    <span className="detail-label">Mã pin:</span>
                                    <span className="detail-value">{fallbackSummary.oldBatteryCode}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Slot trống:</span>
                                    <span className="detail-value">{fallbackSummary.oldSlotNumber}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Dung lượng:</span>
                                    <span className="detail-value">{formatPercentage(fallbackSummary.oldBatteryPercent)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="battery-card new-battery">
                            <div className="battery-title">
                                <div className="battery-icon new"></div>
                                Pin mới (Đã nhận)
                            </div>
                            <div className="battery-details">
                                <div className="detail-row">
                                    <span className="detail-label">Mã pin:</span>
                                    <span className="detail-value">{fallbackSummary.newBatteryCode}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Slot trống:</span>
                                    <span className="detail-value">{fallbackSummary.newSlotNumber}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Dung lượng:</span>
                                    <span className="detail-value">{formatPercentage(fallbackSummary.newBatteryPercent)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="btn-primary" onClick={handleGoHome}>
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};
export default SwapSuccess;