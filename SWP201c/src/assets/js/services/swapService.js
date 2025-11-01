// src/assets/js/services/swapService.js
import { apiUtils, API_CONFIG } from '../config/api.js'; // (Ensure path is correct)

const { ENDPOINTS } = API_CONFIG;

const swapService = {
    /**
     * API 1 (Driver): Initiate a new battery swap.
     * (Uses POST /api/swaps from your BE)
     */
    initiateSwap: async (realSwapData) => {
        // realSwapData: { userId, contractId, vehicleId, oldBatteryId, stationId, staffId, newBatteryId }
        try {
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("📤 GỌI API TẠO SWAP (POST /api/swaps)");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Input data (từ useSwapBattery):", realSwapData);

            // Gửi đúng dữ liệu thật từ FE
            // Backend model Swap có field: oldBatteryId, newBatteryId, staffId, swapStatus
            const swapDataForBE = {
                userId: realSwapData.userId,
                contractId: realSwapData.contractId,
                vehicleId: realSwapData.vehicleId,
                oldBatteryId: realSwapData.oldBatteryId,  // Backend field: oldBatteryId
                newBatteryId: realSwapData.newBatteryId,
                stationId: realSwapData.stationId,
                staffId: realSwapData.staffId,  // Thêm staffId
                swapStatus: "INITIATED"  // Backend field: swapStatus
            };
            
            // KHÔNG GỬI towerId vì lấy pin từ kho (IN_STOCK)

            console.log("Payload sẽ gửi đến backend:");
            console.log(JSON.stringify(swapDataForBE, null, 2));
            console.log("Chi tiết từng field:");
            console.log("  ├─ userId:", swapDataForBE.userId, `(type: ${typeof swapDataForBE.userId})`);
            console.log("  ├─ contractId:", swapDataForBE.contractId, `(type: ${typeof swapDataForBE.contractId})`);
            console.log("  ├─ vehicleId:", swapDataForBE.vehicleId, `(type: ${typeof swapDataForBE.vehicleId})`);
            console.log("  ├─ oldBatteryId:", swapDataForBE.oldBatteryId, `(type: ${typeof swapDataForBE.oldBatteryId})`);
            console.log("  ├─ newBatteryId:", swapDataForBE.newBatteryId, `(type: ${typeof swapDataForBE.newBatteryId})`);
            console.log("  ├─ stationId:", swapDataForBE.stationId, `(type: ${typeof swapDataForBE.stationId})`);
            console.log("  ├─ staffId:", swapDataForBE.staffId, `(type: ${typeof swapDataForBE.staffId})`);
            console.log("  └─ swapStatus:", swapDataForBE.swapStatus);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            // Đúng endpoint backend: /api/swaps
            const responseData = await apiUtils.post('/api/swaps', swapDataForBE);

            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("📥 NHẬN RESPONSE TỪ POST /api/swaps");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Response:", JSON.stringify(responseData, null, 2));
            console.log("Response keys:", Object.keys(responseData || {}));
            console.log("Response.data:", responseData?.data);
            
            // Xử lý lỗi nếu backend trả về success: false
            // Lỗi này sẽ được 'catch' ở dòng 131
            if (responseData?.success === false) {
                 console.error("LỖI TỪ BACKEND:", responseData?.message);
                 // Ném lỗi với thông báo từ backend
                throw new Error(responseData?.message || "Backend could not create swap transaction");
            }
            
            // Xử lý nếu không có dữ liệu trả về (có thể là lỗi network)
            if (!responseData?.data && !responseData?.success) {
                 console.error("LỖI NETWORK HOẶC KHÔNG CÓ DATA:", responseData);
                throw new Error("No response data received from backend");
            }

            const returnedSwap = responseData.data || responseData;
            
            // Tìm swapId từ nhiều field có thể
            const normalizedSwapId = returnedSwap.swapId || 
                                     returnedSwap.id || 
                                     returnedSwap.swap_id || 
                                     returnedSwap.swapID ||
                                     returnedSwap.swap_ID ||
                                     responseData.swapId ||
                                     responseData.id;

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔍 TÌM SWAP ID:');
            console.log('  ├─ returnedSwap.swapId:', returnedSwap.swapId);
            console.log('  ├─ returnedSwap.id:', returnedSwap.id);
            console.log('  ├─ returnedSwap.swap_id:', returnedSwap.swap_id);
            console.log('  ├─ responseData.swapId:', responseData.swapId);
            console.log('  ├─ responseData.id:', responseData.id);
            console.log('  └─ FINAL normalizedSwapId:', normalizedSwapId);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            if (!normalizedSwapId) {
                console.error('❌ KHÔNG TÌM THẤY SWAP ID trong response!');
                console.error('Full response object:', responseData);
                throw new Error('Backend không trả về swapId. Kiểm tra API response structure.');
            }

            // KHÔNG TÌM EMPTY SLOT vì lấy pin từ kho (IN_STOCK)
            // Pin IN_STOCK không cần towerId/slotId

            // KHÔNG TÌM EMPTY SLOT vì lấy pin từ kho (IN_STOCK)
            // Pin IN_STOCK không cần towerId/slotId

            return {
                ...returnedSwap,
                swapId: normalizedSwapId,
                // Không trả về emptySlot vì không cần
            };
        } catch (error) {
            console.error('Error initiating swap (trong swapService.js):', error);
            // Ném lỗi để useSwapBattery.js (dòng 99) có thể bắt được
            throw new Error(error.message || "Unknown error during swap initiation");
        }
    },

    /**
     * API 2 (Driver): Confirm swap completion.
     * Backend chỉ cần swapId, tự động xử lý tất cả (đọc old/new battery từ DB)
     */
    confirmSwap: async (swapId) => {
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📤 GỌI API CONFIRM SWAP');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`SwapID: ${swapId}`);
            console.log('Backend sẽ tự động xử lý old/new battery từ database');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            // Backend chỉ cần swapId (không cần body)
            const endpoint = `/api/swaps/${swapId}/confirm`;
            const response = await apiUtils.post(endpoint, {});

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📥 NHẬN RESPONSE TỪ API CONFIRM');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Full response:', JSON.stringify(response, null, 2));
            console.log('  ├─ response.success:', response.success);
            console.log('  ├─ response.message:', response.message);
            console.log('  └─ response.data:', JSON.stringify(response.data, null, 2));
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

            if (response.success) {
                console.log('✅ Hoàn thành đổi pin thành công!');
                return response.data; // Return summary (updated swap)
            } else {
                console.error('❌ Hoàn thành đổi pin thất bại:', response.message);
                throw new Error(response.message || 'Error confirming swap');
            }
        } catch (error) {
            console.error('❌ LỖI KHI GỌI API CONFIRM:', error);
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
            console.error('❌ LỖI KHI GỌI API GET USER SWAP HISTORY:', error);
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
            console.error('❌ LỖI KHI GỌI API GET ALL SWAPS:', error);
            throw error;
        }
    },

    // (Chưa implement)
    updateSwapStatus: async (swapId, status) => { 
        console.log('updateSwapStatus not implemented yet', { swapId, status });
        return { success: false, message: 'Not implemented' };
    },

    // Lấy chi tiết 1 swap
    getSwapDetails: async (swapId) => {
        try {
            // Giả sử endpoint là /api/swaps/{swapId}
            const endpoint = `/api/swaps/${swapId}`;
            const response = await apiUtils.get(endpoint);
            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.message || 'Error fetching swap details');
            }
        } catch (error) {
            console.error('❌ LỖI KHI GỌI API GET SWAP DETAILS:', error);
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
            console.error('❌ LỖI KHI GỌI API GET BATTERIES BY STATION:', error);
            throw error;
        }
    }
};

export default swapService;