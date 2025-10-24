import React, { useContext, useEffect } from 'react';
import { SwapContext } from '../index';
import { formatPercentage } from '../utils/swapHelpers'; 
import '../../../../assets/css/swap-success.css'; 

const SwapSuccess = ({ onFinish }) => {
    const { summary } = useContext(SwapContext);

    // Debug log để kiểm tra dữ liệu
    console.log('SwapSuccess - summary:', summary);
    console.log('SwapSuccess - sessionStorage keys:', Object.keys(sessionStorage));
    console.log('SwapSuccess - oldBatteryId:', sessionStorage.getItem('old_battery_id'));
    console.log('SwapSuccess - newBatteryId:', sessionStorage.getItem('new_battery_id'));
    
    // Tạo fallback data từ sessionStorage nếu summary không có dữ liệu
    const fallbackSummary = {
        oldBatteryCode: summary?.oldBatteryCode || sessionStorage.getItem('old_battery_id') || 'N/A',
        oldSlotNumber: summary?.oldSlotNumber || sessionStorage.getItem('emptySlotNumber') || 'N/A',
        oldBatteryPercent: summary?.oldBatteryPercent || 85, // Giá trị mặc định
        newBatteryCode: summary?.newBatteryCode || sessionStorage.getItem('new_battery_id') || 'N/A',
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