// Driver/SwapBattery/utils/swapConstants.js
// Constants for swap battery process

export const SWAP_STEPS = {
  SELECT_STATION: 1,
  SELECT_TOWER: 2,
  CONFIRM_LOCATION: 3,
  PLACE_OLD_BATTERY: 4,
  TAKE_NEW_BATTERY: 5,
  COMPLETE: 6
};

export const SWAP_STEP_LABELS = {
  [SWAP_STEPS.SELECT_STATION]: 'Chọn trạm',
  [SWAP_STEPS.SELECT_TOWER]: 'Chọn trụ sạc',
  [SWAP_STEPS.CONFIRM_LOCATION]: 'Đến trạm & xác nhận',
  [SWAP_STEPS.PLACE_OLD_BATTERY]: 'Bỏ pin cũ',
  [SWAP_STEPS.TAKE_NEW_BATTERY]: 'Nhận pin mới',
  [SWAP_STEPS.COMPLETE]: 'Hoàn tất'
};

export const STATION_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive'
};

export const TOWER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BUSY: 'busy'
};

export const DEFAULT_BATTERY_LEVEL = 50;

export const SWAP_MESSAGES = {
  NO_VEHICLE_SELECTED: 'Vui lòng chọn xe trước khi đổi pin. Đang chuyển về Dashboard...',
  STATION_MAINTENANCE: 'Trạm này đang bảo trì. Vui lòng chọn trạm khác.',
  TOWER_UNAVAILABLE: 'Trụ này không khả dụng. Vui lòng chọn trụ khác.',
  MISSING_INFO: 'Thiếu thông tin (trạm/trụ/xe). Vui lòng quay lại chọn trạm và trụ.',
  SWAP_INITIATE_ERROR: 'Không thể khởi tạo quy trình đổi pin',
  SWAP_REQUEST_ERROR: 'Lỗi khi gửi yêu cầu đổi pin',
  SWAP_CONFIRM_ERROR: 'Không thể xác nhận đổi pin',
  PLACE_BATTERY_ERROR: 'Lỗi khi đặt pin cũ',
  COMPLETION_ERROR: 'Lỗi khi hoàn tất đổi pin'
};

export const SWAP_INSTRUCTIONS = {
  CHECK_SIGN: 'Kiểm tra biển báo trên trụ sạc để đảm bảo đúng vị trí',
  PRESS_BUTTON: 'Nhấn nút "Đổi pin" để gửi yêu cầu đến hệ thống trạm',
  FOLLOW_GUIDANCE: 'Sau khi hệ thống xác nhận, bạn sẽ được hướng dẫn đặt pin cũ vào khoang'
};


