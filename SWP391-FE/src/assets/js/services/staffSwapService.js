// src/assets/js/services/staffSwapService.js
// Service dành riêng cho STAFF Manual Swap - KHÔNG dùng chung với Driver
import { apiUtils } from '../config/api.js';

const staffSwapService = {
    /**
     *  STAFF - Tạo giao dịch đổi pin thủ công
     * Endpoint: POST /api/swaps
     * 
     * Staff nhập đầy đủ thông tin:
     * - userId: ID tài xế
     * - vehicleId: ID xe (từ dropdown)
     * - oldBatteryId: Pin cũ (tự động lấy từ xe)
     * - newBatteryId: Pin mới (staff nhập thủ công - phải là pin IN_STOCK)
     * - contractId: Hợp đồng (tự động lấy từ xe)
     * - staffId: ID nhân viên đang thực hiện
     * - stationId: Trạm đổi pin (mặc định = 1)
     * - swapStatus: "INITIATED"
     * 
     *  LƯU Ý:
     * - KHÔNG cần towerId/slotId vì lấy pin từ kho (không qua tower)
     * - Pin mới PHẢI có status = 'in_stock'
     * - Backend sẽ tự động validate và tạo swap record
     */
    createManualSwap: async (swapData) => {
        try {
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(" [STAFF] GỌI API TẠO MANUAL SWAP (POST /api/swaps)");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Input data từ form:", swapData);

            // Validate dữ liệu đầu vào
            const requiredFields = ['userId', 'vehicleId', 'newBatteryId', 'contractId', 'staffId'];
            const missingFields = requiredFields.filter(field => !swapData[field]);
            
            if (missingFields.length > 0) {
                const errorMsg = ` Thiếu dữ liệu bắt buộc: ${missingFields.join(', ')}`;
                console.error(errorMsg);
                throw new Error(errorMsg);
            }

            // Chuẩn bị payload đúng format backend model Swap.java
            // Backend expect: userId (String), vehicleId (Integer), oldBatteryId (Integer),
            //                 newBatteryId (Integer), contractId (Integer), staffId (String),
            //                 stationId (Integer), swapStatus (String)
            const requestBody = {
                userId: String(swapData.userId),
                vehicleId: Number(swapData.vehicleId),
                oldBatteryId: swapData.oldBatteryId ? Number(swapData.oldBatteryId) : null,
                newBatteryId: Number(swapData.newBatteryId),
                contractId: Number(swapData.contractId),
                staffId: String(swapData.staffId),
                stationId: swapData.stationId ? Number(swapData.stationId) : 1, // Default station = 1
                swapStatus: "INITIATED" // Status ban đầu
            };

            console.log("Payload gửi đến backend:");
            console.log(JSON.stringify(requestBody, null, 2));
            console.log("Chi tiết từng field:");
            console.log("  ├─ userId:", requestBody.userId, `(type: ${typeof requestBody.userId})`);
            console.log("  ├─ vehicleId:", requestBody.vehicleId, `(type: ${typeof requestBody.vehicleId})`);
            console.log("  ├─ oldBatteryId:", requestBody.oldBatteryId, `(type: ${typeof requestBody.oldBatteryId})`);
            console.log("  ├─ newBatteryId:", requestBody.newBatteryId, `(type: ${typeof requestBody.newBatteryId})`);
            console.log("  ├─ contractId:", requestBody.contractId, `(type: ${typeof requestBody.contractId})`);
            console.log("  ├─ staffId:", requestBody.staffId, `(type: ${typeof requestBody.staffId})`);
            console.log("  ├─ stationId:", requestBody.stationId, `(type: ${typeof requestBody.stationId})`);
            console.log("  └─ swapStatus:", requestBody.swapStatus);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Backend sẽ:");
            console.log("  ├─ Validate userId, vehicleId, contractId tồn tại");
            console.log("  ├─ Validate newBatteryId có status = 'in_stock'");
            console.log("  ├─ Validate staffId tồn tại và có role = 'Staff'");
            console.log("  ├─ INSERT record vào bảng Swaps");
            console.log("  └─ Trả về swapId và thông tin swap");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            // Gọi API endpoint của Staff (POST /api/swaps)
            const response = await apiUtils.post('/api/swaps', requestBody);

            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(" [STAFF] NHẬN RESPONSE TỪ POST /api/swaps");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Response:", JSON.stringify(response, null, 2));

            // Xử lý lỗi nếu backend trả về success: false
            if (response?.success === false) {
                console.error(" LỖI TỪ BACKEND:", response?.message);
                throw new Error(response?.message || "Backend không thể tạo swap");
            }

            // Validate response structure
            if (!response?.success || !response?.data) {
                console.error(" LỖI: Response không hợp lệ:", response);
                throw new Error("Backend không trả về dữ liệu hợp lệ");
            }

            const swapResult = response.data;

            // Normalize data từ backend
            const normalizedData = {
                swapId: swapResult.swapId || swapResult.swap_id,
                userId: swapResult.userId || swapResult.user_id,
                vehicleId: swapResult.vehicleId || swapResult.vehicle_id,
                oldBatteryId: swapResult.oldBatteryId || swapResult.old_battery_id,
                newBatteryId: swapResult.newBatteryId || swapResult.new_battery_id,
                contractId: swapResult.contractId || swapResult.contract_id,
                staffId: swapResult.staffId || swapResult.staff_id,
                stationId: swapResult.stationId || swapResult.station_id,
                swapStatus: swapResult.swapStatus || swapResult.status || 'INITIATED',
                initiatedAt: swapResult.initiatedAt || swapResult.initiated_at || new Date().toISOString(),
                // Giữ tất cả field khác từ response
                ...swapResult
            };

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(' [STAFF] TẠO SWAP THÀNH CÔNG:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('  ├─ swapId:', normalizedData.swapId, '(QUAN TRỌNG - LƯU VÀO CONTEXT)');
            console.log('  ├─ userId:', normalizedData.userId);
            console.log('  ├─ vehicleId:', normalizedData.vehicleId);
            console.log('  ├─ oldBatteryId:', normalizedData.oldBatteryId);
            console.log('  ├─ newBatteryId:', normalizedData.newBatteryId);
            console.log('  ├─ contractId:', normalizedData.contractId);
            console.log('  ├─ staffId:', normalizedData.staffId);
            console.log('  ├─ swapStatus:', normalizedData.swapStatus);
            console.log('  └─ Full data:', normalizedData);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            if (!normalizedData.swapId) {
                console.error(' KHÔNG TÌM THẤY swapId trong response!');
                console.error('Full response:', response);
                throw new Error('Backend không trả về swapId. Kiểm tra API response.');
            }

            return normalizedData;

        } catch (error) {
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error(' [STAFF] LỖI KHI TẠO MANUAL SWAP:');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            throw error;
        }
    },

    /**
     *  STAFF - Xác nhận hoàn thành đổi pin thủ công
     * Endpoint: POST /api/swaps/{swapId}/confirm
     * 
     * Staff gọi API này sau khi đổi pin xong để:
     * - Cập nhật swapStatus = "COMPLETED"
     * - Cập nhật Vehicles.current_battery_id = newBatteryId
     * - Cập nhật old battery status = 'needs_charging' hoặc 'maintenance'
     * - Cập nhật new battery status = 'in_use'
     * - Tạo Transaction record
     */
    completeSwap: async (swapId) => {
        try {
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(` [STAFF] GỌI API HOÀN THÀNH SWAP (POST /api/swaps/${swapId}/confirm)`);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("swapId:", swapId);

            if (!swapId) {
                throw new Error(" Thiếu swapId để hoàn thành swap");
            }

            //  ĐÚNG endpoint: /confirm (không phải /complete)
            const response = await apiUtils.post(`/api/swaps/${swapId}/confirm`);

            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(" [STAFF] NHẬN RESPONSE TỪ COMPLETE SWAP");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Response:", JSON.stringify(response, null, 2));

            if (response?.success === false) {
                console.error(" LỖI TỪ BACKEND:", response?.message);
                throw new Error(response?.message || "Backend không thể hoàn thành swap");
            }

            console.log(" [STAFF] HOÀN THÀNH SWAP THÀNH CÔNG");
            return response;

        } catch (error) {
            console.error(' [STAFF] LỖI KHI HOÀN THÀNH SWAP:', error);
            throw error;
        }
    },

    /**
     *  STAFF - Hủy giao dịch đổi pin
     * Endpoint: PUT /api/swaps/{swapId}/cancel
     * 
     * Staff gọi API này nếu cần hủy giao dịch:
     * - Cập nhật swapStatus = "CANCELLED"
     * - Trả pin mới về trạng thái 'in_stock'
     */
    cancelSwap: async (swapId) => {
        try {
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(` [STAFF] GỌI API HỦY SWAP (PUT /api/swaps/${swapId}/cancel)`);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("swapId:", swapId);

            if (!swapId) {
                throw new Error(" Thiếu swapId để hủy swap");
            }

            const response = await apiUtils.put(`/api/swaps/${swapId}/cancel`);

            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(" [STAFF] NHẬN RESPONSE TỪ CANCEL SWAP");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Response:", JSON.stringify(response, null, 2));

            if (response?.success === false) {
                console.error(" LỖI TỪ BACKEND:", response?.message);
                throw new Error(response?.message || "Backend không thể hủy swap");
            }

            console.log(" [STAFF] HỦY SWAP THÀNH CÔNG");
            return response;

        } catch (error) {
            console.error(' [STAFF] LỖI KHI HỦY SWAP:', error);
            throw error;
        }
    },

    /**
     *  STAFF - Lấy thông tin chi tiết 1 giao dịch swap
     * Endpoint: GET /api/swaps/{swapId}
     */
    getSwapDetails: async (swapId) => {
        try {
            console.log(` [STAFF] GỌI API LẤY CHI TIẾT SWAP (GET /api/swaps/${swapId})`);
            
            if (!swapId) {
                throw new Error(" Thiếu swapId");
            }

            const response = await apiUtils.get(`/api/swaps/${swapId}`);

            console.log(" [STAFF] NHẬN RESPONSE:", response);

            if (response?.success === false || !response?.data) {
                throw new Error(response?.message || "Không tìm thấy thông tin swap");
            }

            return response.data;

        } catch (error) {
            console.error(' [STAFF] LỖI KHI LẤY CHI TIẾT SWAP:', error);
            throw error;
        }
    },

    /**
     *  STAFF - Lấy danh sách tất cả giao dịch swap
     * Endpoint: GET /api/swaps
     * 
     * Có thể filter theo: status, userId, staffId, stationId, ...
     */
    getAllSwaps: async (filters = {}) => {
        try {
            console.log(" [STAFF] GỌI API LẤY DANH SÁCH SWAP (GET /api/swaps)");
            console.log("Filters:", filters);

            // Build query params từ filters
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    queryParams.append(key, value);
                }
            });

            const endpoint = queryParams.toString() 
                ? `/api/swaps?${queryParams.toString()}`
                : '/api/swaps';

            const response = await apiUtils.get(endpoint);

            console.log(" [STAFF] NHẬN RESPONSE:", response);

            if (response?.success === false) {
                throw new Error(response?.message || "Không thể lấy danh sách swap");
            }

            return response?.data || [];

        } catch (error) {
            console.error(' [STAFF] LỖI KHI LẤY DANH SÁCH SWAP:', error);
            throw error;
        }
    }
};

export default staffSwapService;
