// src/assets/js/services/swapService.js
import { apiUtils, API_CONFIG } from '../config/api.js'; // (Ensure path is correct)

const { ENDPOINTS } = API_CONFIG;

const swapService = {
    /**
     * API 1 (Driver): Initiate a new battery swap.
     * Endpoint: POST /api/batteries/swap/initiate
     * Backend sẽ tìm pin sẵn có trong trụ và tạo swap record với status INITIATED
     */
    initiateSwap: async (realSwapData) => {
        // realSwapData: { userId, stationId, towerId, vehicleId }
        try {
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(" GỌI API INITIATE SWAP (POST /api/batteries/swap/initiate)");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Input data:", realSwapData);

            // Chuẩn bị data gửi lên BE theo đúng format BE yêu cầu
            // Required: userId (string), stationId (number), towerId (number)
            // Optional: vehicleId (number), batteryId (number - old battery id), staffId (string)
            const swapDataForBE = {
                userId: String(realSwapData.userId), // BE expect string
                stationId: Number(realSwapData.stationId), // BE expect Long
                towerId: Number(realSwapData.towerId), // BE expect Long (REQUIRED - nếu thiếu sẽ 400)
                vehicleId: realSwapData.vehicleId ? Number(realSwapData.vehicleId) : undefined, // BE expect Integer (optional)
                // Có thể gửi thêm old battery id nếu có
                batteryId: realSwapData.batteryId ? Number(realSwapData.batteryId) : undefined, // BE expect Long (optional)
                // staffId: null khi auto swap (không cần gửi)
            };
            
            // Xóa các field undefined để không gửi lên BE
            Object.keys(swapDataForBE).forEach(key => {
                if (swapDataForBE[key] === undefined) {
                    delete swapDataForBE[key];
                }
            });

            console.log("Payload sẽ gửi đến backend:");
            console.log(JSON.stringify(swapDataForBE, null, 2));
            console.log("Chi tiết từng field:");
            console.log("  ├─ userId:", swapDataForBE.userId, `(type: ${typeof swapDataForBE.userId})`);
            console.log("  ├─ stationId:", swapDataForBE.stationId, `(type: ${typeof swapDataForBE.stationId})`);
            console.log("  ├─ towerId:", swapDataForBE.towerId, `(type: ${typeof swapDataForBE.towerId})`);
            console.log("  └─ vehicleId:", swapDataForBE.vehicleId, `(type: ${typeof swapDataForBE.vehicleId})`);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Backend sẽ tự động:");
            console.log("  ├─ Tìm pin sẵn có (newBatteryId) trong trụ");
            console.log("  ├─ Tạo swap record với status INITIATED");
            console.log("  ├─ Khóa pin mới cho giao dịch này");
            console.log("  └─ Trả về swapId, newBatteryId, slotNumber, ...");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            // Đúng endpoint backend: /api/batteries/swap/initiate
            const responseData = await apiUtils.post('/api/batteries/swap/initiate', swapDataForBE);

            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(" NHẬN RESPONSE TỪ POST /api/batteries/swap/initiate");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Response:", JSON.stringify(responseData, null, 2));
            console.log("Response keys:", Object.keys(responseData || {}));
            console.log("Response.data:", responseData?.data);
            
            // Xử lý lỗi nếu backend trả về success: false
            if (responseData?.success === false) {
                console.error(" LỖI TỪ BACKEND:", responseData?.message);
                // Ném lỗi với thông báo từ backend (ví dụ: "No available batteries at this tower")
                throw new Error(responseData?.message || "Backend could not initiate swap");
            }
            
            // Kiểm tra response structure
            if (!responseData?.success || !responseData?.data) {
                console.error(" LỖI: Response không hợp lệ:", responseData);
                throw new Error("No valid response data received from backend");
            }

            // Response structure từ BE:
            // { success: true, message: "...", data: { swapId, userId, contractId, vehicleId, 
            //   stationId, oldBatteryId, newBatteryId, staffId, status, slotNumber, slotId,
            //   towerNumber, towerId, estimatedTime, initiatedAt } }
            const swapData = responseData.data;
            
            // Normalize các field quan trọng từ response.data
            const normalizedData = {
                // Quan trọng nhất - FE phải lưu
                swapId: swapData.swapId || swapData.swap_id,
                
                // Thông tin user và contract
                userId: swapData.userId || swapData.user_id,
                contractId: swapData.contractId || swapData.contract_id,
                vehicleId: swapData.vehicleId || swapData.vehicle_id,
                
                // Thông tin station và tower
                stationId: swapData.stationId || swapData.station_id,
                towerId: swapData.towerId || swapData.tower_id,
                towerNumber: swapData.towerNumber || swapData.tower_number,
                
                // Thông tin pin
                oldBatteryId: swapData.oldBatteryId || swapData.old_battery_id,
                newBatteryId: swapData.newBatteryId || swapData.new_battery_id,
                
                // Thông tin slot
                slotNumber: swapData.slotNumber || swapData.slot_number,
                slotId: swapData.slotId || swapData.slot_id,
                
                // Thông tin khác
                status: swapData.status || swapData.swapStatus || 'INITIATED',
                staffId: swapData.staffId || swapData.staff_id,
                estimatedTime: swapData.estimatedTime || swapData.estimated_time || 300,
                initiatedAt: swapData.initiatedAt || swapData.initiated_at,
                
                // Giữ nguyên tất cả field khác từ response
                ...swapData,
            };

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(' THÔNG TIN TỪ RESPONSE:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('  ├─ swapId:', normalizedData.swapId, '(QUAN TRỌNG - PHẢI LƯU)');
            console.log('  ├─ contractId:', normalizedData.contractId);
            console.log('  ├─ vehicleId:', normalizedData.vehicleId);
            console.log('  ├─ newBatteryId:', normalizedData.newBatteryId);
            console.log('  ├─ slotNumber:', normalizedData.slotNumber);
            console.log('  ├─ towerNumber:', normalizedData.towerNumber);
            console.log('  ├─ status:', normalizedData.status);
            console.log('  └─ Full normalized data:', normalizedData);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            if (!normalizedData.swapId) {
                console.error(' KHÔNG TÌM THẤY SWAP ID trong response.data!');
                console.error('Full response object:', responseData);
                throw new Error('Backend không trả về swapId. Kiểm tra API response structure.');
            }

            // Trả về data đã normalize
            return normalizedData;
        } catch (error) {
            console.error('Error initiating swap (trong swapService.js):', error);
            // Ném lỗi để useSwapBattery.js (dòng 99) có thể bắt được
            throw new Error(error.message || "Unknown error during swap initiation");
        }
    },

    /**
     * API 2 (Driver): Confirm swap completion.
     * Endpoint: POST /api/batteries/swap/{swapId}/confirm
     * Backend sẽ tự động cập nhật trạng thái pin cũ, pin mới, slot, và xe
     */
    confirmSwap: async (swapId) => {
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(' BƯỚC 2: CONFIRM BATTERY SWAP');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`Endpoint: POST /api/batteries/swap/${swapId}/confirm`);
            console.log(`SwapID: ${swapId}`);
            console.log('Backend sẽ tự động:');
            console.log('  ├─ Cập nhật trạng thái pin cũ');
            console.log('  ├─ Cập nhật trạng thái pin mới');
            console.log('  ├─ Cập nhật slot trống');
            console.log('  └─ Cập nhật xe của người dùng');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            // Backend chỉ cần swapId trong URL, không cần body
            const endpoint = `/api/batteries/swap/${swapId}/confirm`;
            const response = await apiUtils.post(endpoint, {});

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(' NHẬN RESPONSE TỪ POST /api/batteries/swap/{swapId}/confirm');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Full response:', JSON.stringify(response, null, 2));
            console.log('  ├─ response.success:', response.success);
            console.log('  ├─ response.message:', response.message);
            console.log('  └─ response.data:', JSON.stringify(response.data, null, 2));
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            // Xử lý lỗi nếu backend trả về success: false
            if (response.success === false) {
                console.error(' Lỗi từ backend:', response.message);
                throw new Error(response.message || 'Error confirming swap');
            }

            // Kiểm tra response structure
            if (!response.success || !response.data) {
                console.error(' Response không hợp lệ:', response);
                throw new Error('Invalid response from backend');
            }

            // Response structure từ BE: 
            // { success: true, message: "Battery swap completed successfully", 
            //   data: { swapId, userId, stationId, oldBatteryId, newBatteryId, status: "COMPLETED", swapDate, completedAt } }
            const swapData = response.data;
            
            // Normalize các field quan trọng từ response.data theo đúng structure của BE
            // BE trả về: swapId, userId, stationId, oldBatteryId, newBatteryId, status, swapDate, completedAt
            const normalizedSwapData = {
                ...swapData,
                // Thông tin swap (theo BE)
                swapId: swapData.swapId || swapData.swap_id || swapData.id,
                status: swapData.status || 'COMPLETED',
                swapDate: swapData.swapDate || swapData.swap_date,
                completedAt: swapData.completedAt || swapData.completed_at || new Date(),
                
                // Thông tin user và station (theo BE)
                userId: swapData.userId || swapData.user_id,
                stationId: swapData.stationId || swapData.station_id,
                
                // Thông tin pin (theo BE)
                oldBatteryId: swapData.oldBatteryId || swapData.old_battery_id,
                newBatteryId: swapData.newBatteryId || swapData.new_battery_id,
                
                // Thông tin slot (có thể không có trong response nhưng sẽ được lấy từ swap details)
                // Slot của pin mới (đã lấy)
                newSlotNumber: swapData.newSlotNumber || swapData.new_slot_number || swapData.slotNumber || swapData.slot_number,
                // Slot của pin cũ (nơi đặt pin cũ - có thể được BE trả về sau khi confirm)
                oldSlotNumber: swapData.oldSlotNumber || swapData.old_slot_number || swapData.emptySlotNumber || swapData.empty_slot_number,
                
                // Thông tin khác (nếu có)
                vehicleId: swapData.vehicleId || swapData.vehicle_id,
                towerId: swapData.towerId || swapData.tower_id,
                contractId: swapData.contractId || swapData.contract_id,
            };
            
            console.log(' Đổi pin hoàn tất thành công!');
            console.log('  ├─ swapId:', normalizedSwapData.swapId);
            console.log('  ├─ status:', normalizedSwapData.status);
            console.log('  ├─ oldBatteryId:', normalizedSwapData.oldBatteryId);
            console.log('  ├─ newBatteryId:', normalizedSwapData.newBatteryId);
            console.log('  ├─ oldSlotNumber:', normalizedSwapData.oldSlotNumber, '(slot trống nơi đặt pin cũ)');
            console.log('  ├─ newSlotNumber:', normalizedSwapData.newSlotNumber, '(slot của pin mới)');
            console.log('  └─ Full normalized data:', normalizedSwapData);

            // Trả về data đã normalize (bao gồm oldSlotNumber nếu có từ BE)
            return normalizedSwapData;
        } catch (error) {
            console.error(' LỖI KHI GỌI API CONFIRM:', error);
            throw error;
        }
    },

    // Lấy lịch sử swap của user
    getUserSwapHistory: async (userId, limit = 10) => {
        try {
            const endpoint = `/api/users/${userId}/swaps?limit=${limit}`;
            const response = await apiUtils.get(endpoint);
            return response;
        } catch (error) {
            console.error(' LỖI KHI GỌI API GET USER SWAP HISTORY:', error);
            throw error;
        }
    },

    // Lấy tất cả swap (admin)
    getAllSwaps: async () => { 
        try {
            const endpoint = `/api/swaps`;
            const response = await apiUtils.get(endpoint);
            return response;
        } catch (error) {
            console.error(' LỖI KHI GỌI API GET ALL SWAPS:', error);
            throw error;
        }
    },

    // (Chưa implement)
    updateSwapStatus: async (swapId, status) => { 
        console.log('updateSwapStatus not implemented yet', { swapId, status });
        return { success: false, message: 'Not implemented' };
    },

    // Lấy chi tiết 1 swap (sau khi confirm để lấy thông tin slot numbers)
    getSwapDetails: async (swapId) => {
        try {
            console.log(' Gọi API GET swap details:', swapId);
            // Endpoint: GET /api/swaps/{swapId}
            const endpoint = `/api/swaps/${swapId}`;
            const response = await apiUtils.get(endpoint);
            
            console.log(' Response từ GET swap details:', response);
            
            if (response.success && response.data) {
                const swapData = response.data;
                
                // Normalize các field quan trọng (có thể có snake_case hoặc camelCase)
                const normalizedSwapData = {
                    ...swapData,
                    // Thông tin swap
                    swapId: swapData.swapId || swapData.swap_id || swapData.id,
                    status: swapData.status || swapData.swapStatus,
                    
                    // Thông tin pin
                    oldBatteryId: swapData.oldBatteryId || swapData.old_battery_id,
                    newBatteryId: swapData.newBatteryId || swapData.new_battery_id,
                    
                    // Thông tin slot - QUAN TRỌNG
                    // Slot của pin mới (slot mà pin mới được lấy từ đó)
                    newSlotNumber: swapData.newSlotNumber || 
                                  swapData.new_slot_number ||
                                  swapData.slotNumber || 
                                  swapData.slot_number,
                    // Slot của pin cũ (slot trống nơi đặt pin cũ)
                    oldSlotNumber: swapData.oldSlotNumber || 
                                  swapData.old_slot_number ||
                                  swapData.emptySlotNumber || 
                                  swapData.empty_slot_number,
                    
                    // Thông tin khác
                    vehicleId: swapData.vehicleId || swapData.vehicle_id,
                    stationId: swapData.stationId || swapData.station_id,
                    towerId: swapData.towerId || swapData.tower_id,
                };
                
                console.log(' Normalized swap details:');
                console.log('  ├─ oldSlotNumber:', normalizedSwapData.oldSlotNumber);
                console.log('  ├─ newSlotNumber:', normalizedSwapData.newSlotNumber);
                console.log('  └─ Full data:', normalizedSwapData);
                
                return normalizedSwapData;
            } else {
                throw new Error(response.message || 'Error fetching swap details');
            }
        } catch (error) {
            console.error(' LỖI KHI GỌI API GET SWAP DETAILS:', error);
            throw error;
        }
    },

    // Lấy pin theo trạm
    getBatteriesByStation: (stationId) => {
        try {
            // Dùng ENDPOINTS và apiUtils.get
            const url = ENDPOINTS.BATTERIES.BY_STATION(stationId);
            return apiUtils.get(url);
        } catch (error) {
            console.error(' LỖI KHI GỌI API GET BATTERIES BY STATION:', error);
            throw error;
        }
    }
};

export default swapService;