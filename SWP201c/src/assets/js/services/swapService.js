// src/assets/js/services/swapService.js
import { apiUtils, API_CONFIG } from '../config/api.js'; // (Ensure path is correct)

const { ENDPOINTS } = API_CONFIG;

const swapService = {
    /**
     * API 1 (Driver): Initiate a new battery swap.
     * (Uses POST /api/swaps from your BE)
     */
    initiateSwap: async (realSwapData) => {
        // realSwapData: { cabinetId, stationId, towerId } (towerId = cabinetId)
        try {
            console.log("SwapService: Initiating swap (using POST /api/swaps)...", realSwapData);

            // ==========================================================
            // PREPARE REAL DATA FOR BE (USING CORRECT IDs FROM SQL)
            // ==========================================================
            const swapDataForBE = {
                userId: 'driver001',         // Real ID
                contractId: 1,               // Real ID
                vehicleId: 1,                // Real ID
                // ------------------------------------------
                // CORRECTED ID: Based on SQL UPDATE statement
                // ------------------------------------------
                oldBatteryId: 20,              // <<<<<<<<<< CORRECT ID
                // ------------------------------------------
                newBatteryId: 1,               // Real ID (Any available battery except 20)

                // IDs FE already has
                stationId: realSwapData.stationId,
                towerId: realSwapData.towerId,

                // Other fields (nullable or default)
                staffId: null,
                odometerBefore: 10000, // (Get real odometer?)
                odometerAfter: null,
                status: "INITIATED"
            };

            console.log("Sending data to BE:", swapDataForBE);

            // 2. CALL API POST /api/swaps
            const responseData = await apiUtils.post(ENDPOINTS.SWAPS.BASE, swapDataForBE);

            if (!responseData.success || !responseData.data) {
                throw new Error(responseData.message || "Backend could not create swap transaction");
            }

            const returnedSwap = responseData.data;

            // 3. FIND EMPTY SLOT
            const emptySlotResponse = await apiUtils.get(ENDPOINTS.DRIVER.GET_EMPTY_SLOT, {
                 towerId: realSwapData.towerId
            });

            if (!emptySlotResponse.success || !emptySlotResponse.data) {
                console.warn(emptySlotResponse.message || "Could not find an empty slot in this tower");
            }

            // 4. SIMULATE RESPONSE FOR FE (STEP 3)
            const simulatedResponse = {
                ...returnedSwap,
                swapId: returnedSwap.swapId || 999, // (Temporary ID if BE doesn't return)
                emptySlot: emptySlotResponse?.data?.slotNumber || 'N/A', // Real empty slot
                newBattery: {
                    code: `BAT-${swapDataForBE.newBatteryId}`, // Use real new battery ID
                    slot: "N/A", // (Need another API call to find)
                    percent: 100 // Simulate
                }
            };

            return simulatedResponse;
        } catch (error) {
            console.error('Error initiating swap:', error);
            throw new Error(error.message || "Unknown error during swap initiation");
        }
    },

    /**
     * API 2 (Driver): Confirm swap completion.
     * (Uses POST /api/swaps/{id}/confirm from your BE)
     */
    confirmSwap: async (swapId, oldBatteryData) => {
        // oldBatteryData is not used by BE, but keep for FE logic
        try {
            console.log(`SwapService: Confirming swap ${swapId}...`);
            const endpoint = ENDPOINTS.SWAPS.CONFIRM(swapId);
            const response = await apiUtils.post(endpoint); // No body needed for BE

            if (response.success) {
                return response.data; // Return summary (updated swap)
            } else {
                throw new Error(response.message || "Error confirming swap");
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