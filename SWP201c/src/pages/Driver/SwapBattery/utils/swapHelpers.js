// C:/.../SwapBattery/utils/swapHelpers.js
// FILE NÀY CHỈ CHỨA HÀM JAVASCRIPT THUẦN TÚY, KHÔNG CÓ JSX

/**
 * Định dạng % pin để hiển thị
 * @param {number} percent - Ví dụ: 80
 * @returns {string} - Ví dụ: "80%"
 */
export const formatPercentage = (percent) => {
    if (percent === null || percent === undefined) {
        return "N/A";
    }
    return `${Math.round(percent)}%`;
};

/**
 * Trả về mô tả trạng thái pin
 * @param {number} percent 
 * @returns {string}
 */
export const getBatteryStatusText = (percent) => {
    if (percent >= 95) return "Pin đầy";
    if (percent >= 30) return "Pin tốt";
    return "Pin yếu";
};