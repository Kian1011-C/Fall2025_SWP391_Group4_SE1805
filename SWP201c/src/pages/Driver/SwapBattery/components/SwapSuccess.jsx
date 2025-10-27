import React, { useContext, useState, useEffect } from 'react';
import { SwapContext } from '../index';
import { formatPercentage } from '../utils/swapHelpers'; 
import batteryService from '/src/assets/js/services/batteryService.js';
import '../../../../assets/css/swap-success.css'; 

const SwapSuccess = ({ onFinish }) => {
    const context = useContext(SwapContext);
    const { summary } = context || {}; // Add fallback for undefined context
    const [oldBatteryLevel, setOldBatteryLevel] = useState(null);
    const [loading, setLoading] = useState(true);

    // LẤY DUNG LƯỢNG PIN CŨ THẬT TỪ API
    useEffect(() => {
        const fetchOldBatteryLevel = async () => {
            try {
                setLoading(true);
                
                // Lấy ID pin cũ từ sessionStorage
                const oldBatteryId = sessionStorage.getItem('batteryId') || 
                                   sessionStorage.getItem('old_battery_id') || 
                                   sessionStorage.getItem('oldBatteryId');
                
                if (oldBatteryId && oldBatteryId !== 'undefined' && oldBatteryId !== 'null') {
                    console.log('🔋 Lấy dung lượng pin cũ thật từ API cho batteryId:', oldBatteryId);
                    
                    const batteryResponse = await batteryService.getBatteryById(oldBatteryId);
                    
                    if (batteryResponse.success && batteryResponse.data) {
                        const batteryData = batteryResponse.data;
                        const batteryLevel = batteryData.stateOfHealth || batteryData.state_of_health || 
                                           batteryData.batteryLevel || batteryData.battery_level || 0;
                        
                        console.log('✅ Dung lượng pin cũ thật từ API:', batteryLevel);
                        setOldBatteryLevel(batteryLevel);
                    } else {
                        console.warn('⚠️ Không lấy được dung lượng pin cũ từ API');
                        // Fallback từ sessionStorage
                        const savedLevel = sessionStorage.getItem('oldBatteryLevel');
                        if (savedLevel) {
                            setOldBatteryLevel(parseFloat(savedLevel));
                        }
                    }
                } else {
                    console.warn('⚠️ Không tìm thấy oldBatteryId');
                    // Fallback từ sessionStorage
                    const savedLevel = sessionStorage.getItem('oldBatteryLevel');
                    if (savedLevel) {
                        setOldBatteryLevel(parseFloat(savedLevel));
                    }
                }
            } catch (error) {
                console.error('❌ Lỗi khi lấy dung lượng pin cũ:', error);
                // Fallback từ sessionStorage
                const savedLevel = sessionStorage.getItem('oldBatteryLevel');
                if (savedLevel) {
                    setOldBatteryLevel(parseFloat(savedLevel));
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchOldBatteryLevel();
    }, []);

    // Debug log để kiểm tra dữ liệu
    console.log('SwapSuccess - context:', context);
    console.log('SwapSuccess - summary:', summary);
    console.log('SwapSuccess - summary.newBatteryId:', summary?.newBatteryId);
    console.log('SwapSuccess - sessionStorage keys:', Object.keys(sessionStorage));
    console.log('✅ Pin cũ:', sessionStorage.getItem('old_battery_id'));
    console.log('✅ Pin mới:', sessionStorage.getItem('new_battery_id'));
    console.log('✅ Dung lượng pin cũ:', oldBatteryLevel);
    
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
    
    // Lấy newBatteryCode từ sessionStorage (nguồn chính xác nhất)
    const getNewBatteryCode = () => {
        console.log('🔍 Debug newBatteryId:');
        console.log('🔍 summary?.newBatteryId:', summary?.newBatteryId);
        console.log('🔍 sessionStorage new_battery_id:', sessionStorage.getItem('new_battery_id'));
        console.log('🔍 sessionStorage newBatteryId:', sessionStorage.getItem('newBatteryId'));
        
        // Ưu tiên lấy từ sessionStorage - DỮ LIỆU THẬT TỪ BƯỚC INITIATE
        const newBatteryId = sessionStorage.getItem('new_battery_id');
        if (newBatteryId && newBatteryId !== 'undefined' && newBatteryId !== 'null') {
            console.log('✅ SỬ DỤNG DỮ LIỆU TỪ SESSION STORAGE - newBatteryId:', newBatteryId);
            return newBatteryId;
        }
        
        // Fallback từ API response
        if (summary?.newBatteryId) {
            console.log('⚠️ Sử dụng newBatteryId từ API response (fallback):', summary.newBatteryId);
            return summary.newBatteryId;
        }
        
        console.warn('❌ Không tìm thấy newBatteryId từ sessionStorage hoặc API response');
        return 'N/A';
    };
    
    const fallbackSummary = {
        oldBatteryCode: getOldBatteryCode(),
        oldSlotNumber: summary?.oldSlotNumber || sessionStorage.getItem('emptySlotNumber') || 'N/A',
        oldBatteryPercent: oldBatteryLevel || summary?.oldBatteryPercent || 85, // Sử dụng dữ liệu thật từ API
        newBatteryCode: getNewBatteryCode(),
        newSlotNumber: summary?.newSlotNumber || sessionStorage.getItem('newBatterySlot') || 'N/A',
        newBatteryPercent: summary?.newBatteryPercent || 100, // Giá trị mặc định
        transactionId: summary?.transactionId || 'SWP-' + Date.now()
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
                        <h1 className="success-title">Đang tải thông tin pin cũ...</h1>
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
                            <div className="step-circle completed">✓</div>
                            <div className="step-label">Chọn trạm</div>
                            <div className="step-line completed"></div>
                        </div>
                        <div className="progress-step">
                            <div className="step-circle completed">✓</div>
                            <div className="step-label">Chọn trụ</div>
                            <div className="step-line completed"></div>
                        </div>
                        <div className="progress-step">
                            <div className="step-circle completed">✓</div>
                            <div className="step-label">Trả pin cũ</div>
                            <div className="step-line completed"></div>
                        </div>
                        <div className="progress-step">
                            <div className="step-circle completed">✓</div>
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
                                <div className="battery-icon old">🔋</div>
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
                                <div className="battery-icon new">🔋</div>
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