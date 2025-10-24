// src/assets/js/services/swapService.js
import { apiUtils, API_CONFIG } from '../config/api.js'; // (Ensure path is correct)

const { ENDPOINTS } = API_CONFIG;

const swapService = {
    /**
     * API 1 (Driver): Initiate a new battery swap.
     * (Uses POST /api/batteries/swap/initiate from your BE)
     */
    initiateSwap: async (realSwapData) => {
        // realSwapData: { userId, contractId, vehicleId, oldBatteryId, stationId, towerId, newBatteryId }
        try {
            console.log("SwapService: Initiating swap (using POST /api/batteries/swap/initiate)...", realSwapData);

            // Gửi đúng dữ liệu thật từ FE
            const swapDataForBE = {
                userId: realSwapData.userId,
                contractId: realSwapData.contractId,
                vehicleId: realSwapData.vehicleId,
                oldBatteryId: realSwapData.oldBatteryId,
                newBatteryId: realSwapData.newBatteryId,
                stationId: realSwapData.stationId,
                towerId: realSwapData.towerId,
                status: "INITIATED"
            };

            console.log("Sending data to BE:", swapDataForBE);

            // 2. CALL API POST /api/batteries/swap/initiate
            const responseData = await apiUtils.post(ENDPOINTS.BATTERIES.SWAP_INITIATE, swapDataForBE);

            if (!responseData?.success || !responseData?.data) {
                throw new Error(responseData?.message || "Backend could not create swap transaction");
            }

            const returnedSwap = responseData.data;
            const normalizedSwapId = returnedSwap.swapId || returnedSwap.id || returnedSwap.swap_id;

            console.log('Backend response data:', returnedSwap);
            console.log('Normalized swapId:', normalizedSwapId);

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
     * (Uses POST /api/batteries/swap/{id}/confirm from your BE)
     */
    confirmSwap: async (swapId, confirmData) => {
        try {
            console.log(`SwapService: Confirming swap ${swapId} with data:`, confirmData);
            const endpoint = ENDPOINTS.BATTERIES.SWAP_CONFIRM(swapId);
            const response = await apiUtils.post(endpoint, confirmData);

            if (response.success) {
                return response.data; // Return summary (updated swap)
            } else {
                throw new Error(response.message || 'Error confirming swap');
            }
        } catch (error) {
            console.error('Error confirming swap:', error);
            throw error;
        }
    },

    // Other functions (getAllSwaps, updateSwapStatus) remain the same
    getAllSwaps: async () => { /* ... */ },
    updateSwapStatus: async (swapId, status) => { /* ... */ },
};

export default swapService;