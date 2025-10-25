// src/assets/js/services/swapService.js
import { apiUtils, API_CONFIG } from '../config/api.js'; // (Ensure path is correct)

const { ENDPOINTS } = API_CONFIG;

const swapService = {
    /**
     * API 1 (Driver): Initiate a new battery swap.
     * (Uses POST /api/swaps from your BE)
     */
    initiateSwap: async (realSwapData) => {
        // realSwapData: { userId, contractId, vehicleId, oldBatteryId, stationId, towerId, newBatteryId }
        try {
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("📤 GỌI API TẠO SWAP (POST /api/swaps)");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Input data:", realSwapData);

            // Gửi đúng dữ liệu thật từ FE
            const swapDataForBE = {
                userId: realSwapData.userId,
                contractId: realSwapData.contractId,
                vehicleId: realSwapData.vehicleId,
                batteryId: realSwapData.oldBatteryId,  // ← SỬA: Backend đọc key "batteryId"
                newBatteryId: realSwapData.newBatteryId,
                stationId: realSwapData.stationId,
                towerId: realSwapData.towerId,
                status: "INITIATED"
            };

            console.log("Payload sẽ gửi đến backend:");
            console.log(JSON.stringify(swapDataForBE, null, 2));
            console.log("Chi tiết từng field:");
            console.log("  ├─ userId:", swapDataForBE.userId, `(type: ${typeof swapDataForBE.userId})`);
            console.log("  ├─ contractId:", swapDataForBE.contractId, `(type: ${typeof swapDataForBE.contractId})`);
            console.log("  ├─ vehicleId:", swapDataForBE.vehicleId, `(type: ${typeof swapDataForBE.vehicleId})`);
            console.log("  ├─ batteryId (old battery):", swapDataForBE.batteryId, `(type: ${typeof swapDataForBE.batteryId})`);
            console.log("  ├─ newBatteryId:", swapDataForBE.newBatteryId, `(type: ${typeof swapDataForBE.newBatteryId})`);
            console.log("  ├─ stationId:", swapDataForBE.stationId, `(type: ${typeof swapDataForBE.stationId})`);
            console.log("  ├─ towerId:", swapDataForBE.towerId, `(type: ${typeof swapDataForBE.towerId})`);
            console.log("  └─ status:", swapDataForBE.status);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            // SỬA: Đổi lại endpoint (kiểm tra backend đang dùng endpoint nào)
            // Thử endpoint: /api/batteries/swap/initiate
            const responseData = await apiUtils.post('/api/batteries/swap/initiate', swapDataForBE);

            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("📥 NHẬN RESPONSE TỪ POST /api/swaps");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("Response:", JSON.stringify(responseData, null, 2));
            console.log("Response keys:", Object.keys(responseData || {}));
            console.log("Response.data:", responseData?.data);
            console.log("Response.data keys:", Object.keys(responseData?.data || {}));
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            // Check if response indicates an error
            if (responseData?.success === false) {
                throw new Error(responseData?.message || "Backend could not create swap transaction");
            }

            // If no data returned, it might be a network error
            if (!responseData?.data && !responseData?.success) {
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

            // 3. FIND EMPTY SLOT (optional helper, nếu BE đã trả thì bỏ qua)
            let emptySlotNumber = returnedSwap.emptySlot || returnedSwap.emptySlotNumber;
            if (!emptySlotNumber) {
                try {
                    const emptySlotResponse = await apiUtils.get(ENDPOINTS.DRIVER.GET_EMPTY_SLOT, {
                        towerId: realSwapData.towerId
                    });
                    if (emptySlotResponse?.success && emptySlotResponse?.data) {
                        emptySlotNumber = emptySlotResponse.data.slotNumber;
                    }
                } catch (e) {
                    console.warn('Could not fetch empty slot:', e);
                }
            }


            return {
                ...returnedSwap,
                swapId: normalizedSwapId,
                emptySlot: emptySlotNumber ?? null,
                emptySlotNumber: emptySlotNumber ?? null,
            };
        } catch (error) {
            console.error('Error initiating swap:', error);
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
            console.log('� NHẬN RESPONSE TỪ API');
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

    // Other functions (getAllSwaps, updateSwapStatus) remain the same
    getAllSwaps: async () => { 
        console.log('getAllSwaps not implemented yet');
        return { success: false, message: 'Not implemented' };
    },
    updateSwapStatus: async (swapId, status) => { 
        console.log('updateSwapStatus not implemented yet', { swapId, status });
        return { success: false, message: 'Not implemented' };
    },
};

export default swapService;