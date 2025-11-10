package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dao.BatteryDao;
import hsf302.fa25.s3.dao.SwapDao;
import hsf302.fa25.s3.dao.ContractDao;
import hsf302.fa25.s3.model.Battery;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/batteries")
public class BatteryController {

    private final BatteryDao batteryDao = new BatteryDao();
    private final SwapDao swapDao = new SwapDao();
    private final ContractDao contractDao = new ContractDao();

    @GetMapping("/{id}/status")
    public ResponseEntity<?> getBatteryStatus(@PathVariable Long id) {
        try {
            Battery battery = batteryDao.getBatteryById(id.intValue());
            
            Map<String, Object> response = new HashMap<>();
            if (battery != null) {
                Map<String, Object> batteryStatus = new HashMap<>();
                batteryStatus.put("id", battery.getBatteryId());
                batteryStatus.put("serialNumber", "BAT-" + battery.getBatteryId() + "-2024");
                batteryStatus.put("model", battery.getModel());
                batteryStatus.put("capacity", battery.getCapacity());
                batteryStatus.put("stateOfHealth", battery.getStateOfHealth());
                batteryStatus.put("status", battery.getStatus().toUpperCase());
                batteryStatus.put("cycleCount", battery.getCycleCount()); // From database
                batteryStatus.put("slotId", battery.getSlotId());
                
                response.put("success", true);
                response.put("data", batteryStatus);
            } else {
                response.put("success", false);
                response.put("message", "Battery not found");
                return ResponseEntity.status(404).body(response);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching battery: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<?> getBatteryHistory(@PathVariable Long id) {
        try {
            List<Map<String, Object>> history = swapDao.getBatterySwapHistory(id.intValue());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", history);
            response.put("total", history.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching battery history: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/swap/initiate")
    public ResponseEntity<?> initiateBatterySwap(@RequestBody Map<String, Object> swapRequest) {
        try {
            String userId = swapRequest.get("userId").toString();
            Long stationId = Long.valueOf(swapRequest.get("stationId").toString());
            // Optional staffId: null when auto swap, or string id when staff performs the swap
            String staffId = swapRequest.containsKey("staffId") && swapRequest.get("staffId") != null
                    ? swapRequest.get("staffId").toString() : null;
        // NOTE: We now require a towerId and will only search for batteries inside that tower
        Long towerIdReq = swapRequest.containsKey("towerId") && swapRequest.get("towerId") != null
            ? Long.valueOf(swapRequest.get("towerId").toString()) : null;

        if (towerIdReq == null) {
        Map<String, Object> bad = new HashMap<>();
        bad.put("success", false);
        bad.put("message", "towerId is required. This endpoint searches batteries inside a specific tower only.");
        return ResponseEntity.status(400).body(bad);
        }
            Long oldBatteryId = swapRequest.containsKey("batteryId") ? 
                Long.valueOf(swapRequest.get("batteryId").toString()) : null;
            // Optional: vehicleId selected by user (so we update the correct vehicle)
            Integer vehicleId = swapRequest.containsKey("vehicleId") && swapRequest.get("vehicleId") != null
                    ? Integer.valueOf(swapRequest.get("vehicleId").toString()) : null;
            
            // Find available battery: prefer searching inside the provided tower (if any),
            // otherwise fall back to searching the whole station
            String findBatterySql;
            // Only search by tower (towerIdReq guaranteed non-null above)
            findBatterySql = """
                SELECT TOP 1 b.battery_id, sl.slot_id, sl.slot_number, t.tower_id, t.tower_number
                FROM Batteries b
                INNER JOIN Slots sl ON b.slot_id = sl.slot_id
                INNER JOIN Towers t ON sl.tower_id = t.tower_id
                WHERE t.tower_id = ? AND UPPER(b.status) = 'available'
                ORDER BY b.state_of_health DESC
            """;

            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection();
                 java.sql.PreparedStatement ps = conn.prepareStatement(findBatterySql)) {
                // bind towerId (required)
                ps.setLong(1, towerIdReq);
                
                java.sql.ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    Long newBatteryId = rs.getLong("battery_id");
                    Integer newBatterySlotId = rs.getObject("slot_id") != null ? rs.getInt("slot_id") : null;
                    int slotNumber = rs.getInt("slot_number");
                    int towerNumber = rs.getInt("tower_number");
                    
                    // Find active contract for this user's vehicle(s)
                    Integer contractId = null;
                    String findContractSql;
                    if (vehicleId != null) {
                        findContractSql = "SELECT TOP 1 c.contract_id FROM Contracts c WHERE c.vehicle_id = ? AND c.status = 'active' ORDER BY c.contract_id DESC";
                        try (java.sql.PreparedStatement cPs = conn.prepareStatement(findContractSql)) {
                            cPs.setInt(1, vehicleId);
                            try (java.sql.ResultSet cRs = cPs.executeQuery()) {
                                if (cRs.next()) {
                                    contractId = cRs.getInt("contract_id");
                                }
                            }
                        }
                    } else {
                        findContractSql = "SELECT TOP 1 c.contract_id FROM Contracts c " +
                                "WHERE c.vehicle_id IN (SELECT vehicle_id FROM Vehicles WHERE user_id = ?) " +
                                "AND c.status = 'active' ORDER BY c.contract_id DESC";
                        try (java.sql.PreparedStatement cPs = conn.prepareStatement(findContractSql)) {
                            cPs.setString(1, userId);
                            try (java.sql.ResultSet cRs = cPs.executeQuery()) {
                                if (cRs.next()) {
                                    contractId = cRs.getInt("contract_id");
                                }
                            }
                        }
                    }

                    if (contractId == null) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", false);
                        response.put("message", "Không tìm thấy hợp đồng active cho user này. Không thể tạo swap.");
                        return ResponseEntity.status(400).body(response);
                    }
                    // Determine vehicle_id to persist on swap: prefer vehicleId from request, otherwise resolve from contract
                    Integer swapVehicleId = null;
                    if (vehicleId != null) {
                        swapVehicleId = vehicleId;
                    } else {
                        // find vehicle_id from contract
                        String findVehicleSql = "SELECT vehicle_id FROM Contracts WHERE contract_id = ?";
                        try (java.sql.PreparedStatement vPs = conn.prepareStatement(findVehicleSql)) {
                            vPs.setInt(1, contractId);
                            try (java.sql.ResultSet vRs = vPs.executeQuery()) {
                                if (vRs.next()) {
                                    swapVehicleId = vRs.getInt("vehicle_id");
                                }
                            }
                        }
                    }

                    // Simulate battery degradation: if oldBatteryId exists, reduce its state_of_health by random 1-30
                    if (oldBatteryId != null) {
                        double degradation = 1 + (Math.random() * 49); // random from 1.0 to 30.0
                        String updateOldBatterySql = """
                            UPDATE Batteries 
                            SET state_of_health = CASE 
                                WHEN state_of_health - ? < 0 THEN 0 
                                ELSE state_of_health - ? 
                            END,
                            cycle_count = cycle_count + 1
                            WHERE battery_id = ?
                        """;
                        try (java.sql.PreparedStatement degradePs = conn.prepareStatement(updateOldBatterySql)) {
                            degradePs.setDouble(1, degradation);
                            degradePs.setDouble(2, degradation);
                            degradePs.setLong(3, oldBatteryId);
                            degradePs.executeUpdate();
                        }
                    }

                    // Create swap record (include contract_id, vehicle_id and optional staff_id)
                    String insertSwapSql = """
                        INSERT INTO Swaps (user_id, contract_id, vehicle_id, station_id, tower_id, staff_id, old_battery_id, new_battery_id, swap_date, status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), 'INITIATED')
                    """;

            try (java.sql.PreparedStatement insertPs = conn.prepareStatement(insertSwapSql,
                java.sql.Statement.RETURN_GENERATED_KEYS)) {
                        insertPs.setString(1, userId);
                        insertPs.setInt(2, contractId);
                        if (swapVehicleId != null) {
                            insertPs.setInt(3, swapVehicleId);
                        } else {
                            insertPs.setNull(3, java.sql.Types.INTEGER);
                        }
                        insertPs.setLong(4, stationId);
                        // persist tower id (we require towerId in request)
                        insertPs.setLong(5, towerIdReq);
                        // staff_id (nullable)
                        if (staffId != null) {
                            insertPs.setString(6, staffId);
                        } else {
                            insertPs.setNull(6, java.sql.Types.VARCHAR);
                        }
                        if (oldBatteryId != null) {
                            insertPs.setLong(7, oldBatteryId);
                        } else {
                            insertPs.setNull(7, java.sql.Types.BIGINT);
                        }
                        insertPs.setLong(8, newBatteryId);

                        int rowsAffected = insertPs.executeUpdate();
                        if (rowsAffected > 0) {
                            try (java.sql.ResultSet generatedKeys = insertPs.getGeneratedKeys()) {
                                if (generatedKeys.next()) {
                                    Long swapId = generatedKeys.getLong(1);

                                    Map<String, Object> swapTransaction = new HashMap<>();
                                    swapTransaction.put("swapId", swapId);
                                    swapTransaction.put("userId", userId);
                                    swapTransaction.put("contractId", contractId);
                                    swapTransaction.put("vehicleId", swapVehicleId);
                                    swapTransaction.put("stationId", stationId);
                                    swapTransaction.put("oldBatteryId", oldBatteryId);
                                    swapTransaction.put("newBatteryId", newBatteryId);
                                    swapTransaction.put("staffId", staffId);
                                    swapTransaction.put("status", "INITIATED");
                                    swapTransaction.put("slotNumber", slotNumber);
                                    swapTransaction.put("slotId", newBatterySlotId);
                                    swapTransaction.put("towerNumber", towerNumber);
                                    swapTransaction.put("towerId", towerIdReq);
                                    swapTransaction.put("estimatedTime", 300); // 5 minutes
                                    swapTransaction.put("initiatedAt", new java.util.Date());

                                    Map<String, Object> response = new HashMap<>();
                                    response.put("success", true);
                                    response.put("message", "Battery swap initiated successfully");
                                    response.put("data", swapTransaction);

                                    return ResponseEntity.ok(response);
                                }
                            }
                        }
                    }
                } else {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "No available batteries at this tower");
                    return ResponseEntity.status(404).body(response);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to initiate battery swap");
            return ResponseEntity.status(500).body(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error initiating battery swap: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/swap/{swapId}/confirm")
    public ResponseEntity<?> confirmBatterySwap(@PathVariable Long swapId) {
        try {
            // We'll perform necessary updates in a transaction:
            // - set swap.status = 'COMPLETED'
            // - move old battery into an empty slot (if exists) and set its status = 'charging'
            // - remove new battery from its slot (slot becomes empty) and set new battery status = 'in_use'
            // - update vehicle.current_battery_id to new battery
            String getSwapSql = """
                SELECT s.*, 
                       old_b.slot_id as old_slot_id,
                       new_b.slot_id as new_slot_id,
                       old_b.state_of_health as old_battery_charge,
                       new_b.state_of_health as new_battery_charge
                FROM Swaps s
                LEFT JOIN Batteries old_b ON s.old_battery_id = old_b.battery_id
                INNER JOIN Batteries new_b ON s.new_battery_id = new_b.battery_id
                WHERE s.swap_id = ?
            """;

            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection()) {
                conn.setAutoCommit(false);

                // Read swap and battery slot info
                try (java.sql.PreparedStatement selectPs = conn.prepareStatement(getSwapSql)) {
                    selectPs.setLong(1, swapId);
                    try (java.sql.ResultSet rs = selectPs.executeQuery()) {
                        if (!rs.next()) {
                            conn.rollback();
                            Map<String, Object> response = new HashMap<>();
                            response.put("success", false);
                            response.put("message", "Swap not found");
                            return ResponseEntity.status(404).body(response);
                        }

                        Integer oldBatteryId = rs.getObject("old_battery_id") != null ? rs.getInt("old_battery_id") : null;
                        int newBatteryId = rs.getInt("new_battery_id");
                        int stationId = rs.getInt("station_id");
                        Integer contractId = rs.getObject("contract_id") != null ? rs.getInt("contract_id") : null;
                        Integer towerId = rs.getObject("tower_id") != null ? rs.getInt("tower_id") : null;

                        // 1) Update swap status
                        try (java.sql.PreparedStatement updateSwapPs = conn.prepareStatement("UPDATE Swaps SET status = 'COMPLETED', swap_date = GETDATE() WHERE swap_id = ?")) {
                            updateSwapPs.setLong(1, swapId);
                            updateSwapPs.executeUpdate();
                        }

                        // 2) Handle old battery: move into an empty slot in the SAME TOWER and set to 'charging'
                        if (oldBatteryId != null) {
                            String findEmptySlotSql = """
                                SELECT TOP 1 sl.slot_id FROM Slots sl
                                WHERE sl.tower_id = ? AND sl.status = 'empty'
                                ORDER BY sl.slot_number
                            """;
                            Integer targetSlotId = null;
                            try (java.sql.PreparedStatement slotPs = conn.prepareStatement(findEmptySlotSql)) {
                                slotPs.setInt(1, towerId);
                                try (java.sql.ResultSet slotRs = slotPs.executeQuery()) {
                                    if (slotRs.next()) {
                                        targetSlotId = slotRs.getInt("slot_id");
                                    }
                                }
                            }

                            if (targetSlotId != null) {
                                // assign old battery to the empty slot and set status 'charging'
                                try (java.sql.PreparedStatement updBat = conn.prepareStatement("UPDATE Batteries SET slot_id = ?, status = 'charging' WHERE battery_id = ?")) {
                                    updBat.setInt(1, targetSlotId);
                                    updBat.setInt(2, oldBatteryId);
                                    updBat.executeUpdate();
                                }
                                // set slot status to 'charging'
                                try (java.sql.PreparedStatement updSlot = conn.prepareStatement("UPDATE Slots SET status = 'charging' WHERE slot_id = ?")) {
                                    updSlot.setInt(1, targetSlotId);
                                    updSlot.executeUpdate();
                                }
                            } else {
                                // No empty slot: set battery status to 'charging' and clear slot_id
                                try (java.sql.PreparedStatement updBat = conn.prepareStatement("UPDATE Batteries SET slot_id = NULL, status = 'charging' WHERE battery_id = ?")) {
                                    updBat.setInt(1, oldBatteryId);
                                    updBat.executeUpdate();
                                }
                            }
                        }

                        // 3) Handle new battery: remove from its slot (slot becomes empty) and set status 'in_use'
                        // Get new battery's current slot id (if any)
                        Integer newBatterySlotId = rs.getObject("new_slot_id") != null ? rs.getInt("new_slot_id") : null;
                        if (newBatterySlotId != null) {
                            // set slot to 'empty'
                            try (java.sql.PreparedStatement updSlot = conn.prepareStatement("UPDATE Slots SET status = 'empty' WHERE slot_id = ?")) {
                                updSlot.setInt(1, newBatterySlotId);
                                updSlot.executeUpdate();
                            }
                        }
                        // set new battery to in_use and clear slot_id
                        try (java.sql.PreparedStatement updNewBat = conn.prepareStatement("UPDATE Batteries SET slot_id = NULL, status = 'in_use' WHERE battery_id = ?")) {
                            updNewBat.setInt(1, newBatteryId);
                            updNewBat.executeUpdate();
                        }

                        // 4) Update vehicle current_battery_id if contract -> vehicle mapping exists
                        if (contractId != null) {
                            try (java.sql.PreparedStatement vehPs = conn.prepareStatement(
                                    "UPDATE Vehicles SET current_battery_id = ? WHERE vehicle_id = (SELECT vehicle_id FROM Contracts WHERE contract_id = ?)") ) {
                                vehPs.setInt(1, newBatteryId);
                                vehPs.setInt(2, contractId);
                                vehPs.executeUpdate();
                            }
                        }

                        // 5) Update contract usage & billing as before
                        java.math.BigDecimal distanceUsed = null;
                        if (rs.getBigDecimal("odometer_after") != null && rs.getBigDecimal("odometer_before") != null) {
                            distanceUsed = rs.getBigDecimal("odometer_after").subtract(rs.getBigDecimal("odometer_before"));
                            if (distanceUsed.compareTo(java.math.BigDecimal.ZERO) > 0 && contractId != null) {
                                contractDao.updateMonthlyUsage(contractId, distanceUsed);
                                contractDao.calculateAndUpdateMonthlyFees(contractId);
                            }
                        }

                        // commit transaction
                        conn.commit();

                        // Prepare response payload
                        Map<String, Object> swapResult = new HashMap<>();
                        swapResult.put("swapId", swapId);
                        swapResult.put("userId", rs.getString("user_id"));
                        swapResult.put("stationId", stationId);
                        swapResult.put("oldBatteryId", oldBatteryId);
                        swapResult.put("newBatteryId", newBatteryId);
                        swapResult.put("status", "COMPLETED");
                        swapResult.put("swapDate", rs.getTimestamp("swap_date"));
                        swapResult.put("completedAt", new java.util.Date());

                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("message", "Battery swap completed successfully");
                        response.put("data", swapResult);
                        return ResponseEntity.ok(response);
                    }
                }
            } catch (Exception ex) {
                ex.printStackTrace();
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error during swap completion: " + ex.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error confirming battery swap: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}/health")
    public ResponseEntity<?> getBatteryHealth(@PathVariable Long id) {
        try {
            String sql = "SELECT * FROM Batteries WHERE battery_id = ?";
            
            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection();
                 java.sql.PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setLong(1, id);
                
                java.sql.ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    Map<String, Object> healthMetrics = new HashMap<>();
                    healthMetrics.put("batteryId", rs.getInt("battery_id"));
                    healthMetrics.put("model", rs.getString("model"));
                    healthMetrics.put("capacity", rs.getInt("capacity"));
                    healthMetrics.put("overallHealth", rs.getDouble("state_of_health"));
                    healthMetrics.put("cycleCount", rs.getInt("cycle_count"));
                    healthMetrics.put("status", rs.getString("status"));
                    
                    // Calculate derived metrics
                    double stateOfHealth = rs.getDouble("state_of_health");
                    int cycleCount = rs.getInt("cycle_count");
                    
                    healthMetrics.put("capacityRetention", stateOfHealth);
                    healthMetrics.put("maxCycles", 2000);
                    
                    // Calculate estimated life remaining (in months)
                    double degradationRate = (100 - stateOfHealth) / (cycleCount > 0 ? cycleCount : 1);
                    int remainingCycles = Math.max(0, 2000 - cycleCount);
                    double estimatedMonths = remainingCycles / 30.0; // Assuming ~30 cycles per month
                    healthMetrics.put("estimatedLifeRemaining", Math.round(estimatedMonths));
                    healthMetrics.put("degradationRate", Math.round(degradationRate * 100.0) / 100.0);
                    
                    // Health recommendations based on actual data
                    java.util.List<String> recommendations = new java.util.ArrayList<>();
                    if (stateOfHealth < 70) {
                        recommendations.add("Consider battery replacement soon");
                    }
                    if (cycleCount > 1500) {
                        recommendations.add("Monitor charging patterns carefully");
                    }
                    if (stateOfHealth > 80) {
                        recommendations.add("Battery is in good condition");
                    }
                    recommendations.add("Regular temperature monitoring");
                    recommendations.add("Avoid deep discharge cycles");
                    
                    healthMetrics.put("recommendations", recommendations);
                    healthMetrics.put("lastHealthCheck", java.time.LocalDateTime.now().toString());
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("data", healthMetrics);
                    
                    return ResponseEntity.ok(response);
                } else {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Battery not found");
                    return ResponseEntity.status(404).body(response);
                }
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching battery health: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/maintenance/schedule")
    public ResponseEntity<?> scheduleBatteryMaintenance(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> maintenanceRequest) {
        
        String maintenanceDate = (String) maintenanceRequest.get("maintenanceDate");
        String maintenanceType = (String) maintenanceRequest.get("type");
        String notes = (String) maintenanceRequest.get("notes");
        
        // Mock data - BatteryMaintenance table not implemented yet
        Map<String, Object> maintenanceSchedule = new HashMap<>();
        maintenanceSchedule.put("maintenanceId", System.currentTimeMillis());
        maintenanceSchedule.put("batteryId", id);
        maintenanceSchedule.put("scheduledDate", maintenanceDate);
        maintenanceSchedule.put("type", maintenanceType != null ? maintenanceType : "ROUTINE");
        maintenanceSchedule.put("status", "SCHEDULED");
        maintenanceSchedule.put("notes", notes);
        maintenanceSchedule.put("scheduledBy", "SYSTEM");
        maintenanceSchedule.put("createdAt", new Date());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Maintenance scheduled successfully (mock)");
        response.put("data", maintenanceSchedule);
        response.put("note", "Mock data - BatteryMaintenance table not implemented");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/station/{stationId}")
    public ResponseEntity<?> getBatteriesByStation(@PathVariable Long stationId) {
        try {
            // Query batteries at specific station from database
            String sql = """
                SELECT b.*, sl.slot_number, t.tower_number
                FROM Batteries b
                INNER JOIN Slots sl ON b.slot_id = sl.slot_id
                INNER JOIN Towers t ON sl.tower_id = t.tower_id
                WHERE t.station_id = ?
                ORDER BY t.tower_number, sl.slot_number
            """;
            
            List<Map<String, Object>> batteries = new ArrayList<>();
            
            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection();
                 java.sql.PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setLong(1, stationId);
                
                java.sql.ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> battery = new HashMap<>();
                    battery.put("id", rs.getInt("battery_id"));
                    battery.put("serialNumber", "BAT-" + stationId + "-" + String.format("%03d", rs.getInt("battery_id")));
                    battery.put("model", rs.getString("model"));
                    battery.put("capacity", rs.getInt("capacity"));
                    battery.put("stateOfHealth", rs.getDouble("state_of_health"));
                    battery.put("status", rs.getString("status").toUpperCase());
                    battery.put("slotNumber", rs.getInt("slot_number"));
                    battery.put("towerNumber", rs.getInt("tower_number"));
                    battery.put("cycleCount", rs.getInt("cycle_count"));
                    batteries.add(battery);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", batteries);
            response.put("total", batteries.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching batteries: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<?> getBatteryByVehicle(@PathVariable int vehicleId) {
        try {
            String sql = """
                SELECT b.model, b.state_of_health, b.cycle_count 
                FROM Vehicles v 
                INNER JOIN Batteries b ON v.current_battery_id = b.battery_id 
                WHERE v.vehicle_id = ?
            """;
            
            Map<String, Object> batteryInfo = new HashMap<>();
            
            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection();
                 java.sql.PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, vehicleId);
                
                java.sql.ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    batteryInfo.put("model", rs.getString("model"));
                    batteryInfo.put("health", rs.getDouble("state_of_health"));
                    batteryInfo.put("cycles", rs.getInt("cycle_count"));
                } else {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Không tìm thấy thông tin pin cho xe này");
                    return ResponseEntity.status(404).body(response);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", batteryInfo);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ==================== STAFF BATTERY MANAGEMENT CRUD APIs ====================

    @GetMapping
    public ResponseEntity<?> getAllBatteries(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long stationId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "50") int size) {
        try {
            List<Battery> batteries;
            
            if (status != null && !status.isEmpty()) {
                batteries = batteryDao.getBatteriesByStatus(status);
            } else {
                batteries = batteryDao.getAllBatteries();
            }
            
            // Filter by station if provided
            if (stationId != null) {
                batteries = batteries.stream()
                    .filter(b -> {
                        // Check if battery belongs to the station through slot/tower relationship
                        try {
                            String checkSql = """
                                SELECT COUNT(*) FROM Batteries b
                                INNER JOIN Slots sl ON b.slot_id = sl.slot_id
                                INNER JOIN Towers t ON sl.tower_id = t.tower_id
                                WHERE b.battery_id = ? AND t.station_id = ?
                            """;
                            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection();
                                 java.sql.PreparedStatement ps = conn.prepareStatement(checkSql)) {
                                ps.setInt(1, b.getBatteryId());
                                ps.setLong(2, stationId);
                                java.sql.ResultSet rs = ps.executeQuery();
                                if (rs.next()) {
                                    return rs.getInt(1) > 0;
                                }
                            }
                        } catch (Exception e) {
                            return false;
                        }
                        return false;
                    }).toList();
            }
            
            // Apply pagination
            int start = page * size;
            int end = Math.min(start + size, batteries.size());
            List<Battery> paginatedBatteries = batteries.subList(start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", paginatedBatteries);
            response.put("total", batteries.size());
            response.put("page", page);
            response.put("size", size);
            response.put("totalPages", (batteries.size() + size - 1) / size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching batteries: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBatteryById(@PathVariable Long id) {
        try {
            Battery battery = batteryDao.getBatteryById(id.intValue());
            
            Map<String, Object> response = new HashMap<>();
            if (battery != null) {
                response.put("success", true);
                response.put("data", battery);
            } else {
                response.put("success", false);
                response.put("message", "Battery not found");
                return ResponseEntity.status(404).body(response);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching battery: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<?> createBattery(@RequestBody Battery battery) {
        try {
            // Validate required fields
            if (battery.getModel() == null || battery.getModel().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Model is required");
                return ResponseEntity.status(400).body(response);
            }
            
            if (battery.getCapacity() <= 0) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Capacity must be greater than 0");
                return ResponseEntity.status(400).body(response);
            }
            
            // Set defaults
            if (battery.getStateOfHealth() == 0) {
                battery.setStateOfHealth(100.0); // New battery starts at 100%
            }
            if (battery.getStatus() == null || battery.getStatus().isEmpty()) {
                battery.setStatus("AVAILABLE");
            }
            if (battery.getCycleCount() == 0) {
                battery.setCycleCount(0); // New battery starts at 0 cycles
            }
            
            boolean created = batteryDao.createBattery(battery);
            
            Map<String, Object> response = new HashMap<>();
            if (created) {
                response.put("success", true);
                response.put("message", "Battery created successfully");
                response.put("data", battery);
            } else {
                response.put("success", false);
                response.put("message", "Failed to create battery");
                return ResponseEntity.status(500).body(response);
            }
            
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error creating battery: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBattery(@PathVariable Long id, @RequestBody Battery battery) {
        try {
            // Check if battery exists
            Battery existingBattery = batteryDao.getBatteryById(id.intValue());
            if (existingBattery == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Battery not found");
                return ResponseEntity.status(404).body(response);
            }
            
            // Set the ID for update
            battery.setBatteryId(id.intValue());
            
            // Validate fields
            if (battery.getModel() == null || battery.getModel().trim().isEmpty()) {
                battery.setModel(existingBattery.getModel());
            }
            if (battery.getCapacity() <= 0) {
                battery.setCapacity(existingBattery.getCapacity());
            }
            if (battery.getStateOfHealth() <= 0 || battery.getStateOfHealth() > 100) {
                battery.setStateOfHealth(existingBattery.getStateOfHealth());
            }
            if (battery.getStatus() == null || battery.getStatus().isEmpty()) {
                battery.setStatus(existingBattery.getStatus());
            }
            // Preserve existing slotId when the incoming request does not include it
            if (battery.getSlotId() == null) {
                battery.setSlotId(existingBattery.getSlotId());
            }

            if (battery.getCycleCount() <= 0) {
                battery.setCycleCount(existingBattery.getCycleCount());
            }
            
            boolean updated = batteryDao.updateBattery(battery);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
                // If the battery is located in a slot, update that slot's status to reflect the battery status.
                // Rule: if battery.status == 'IN_USE' => slot becomes 'empty' (battery removed)
                //       otherwise => slot becomes 'charging' (battery present/available in tower slot)
                try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection()) {
                    if (battery.getSlotId() != null) {
                        // Normalize battery status and map to slot status according to project conventions:
                        // battery: 'available','charging','in_use','faulty'
                        // slot: 'full','charging','empty'
                        String slotStatus = "charging";
                        if (battery.getStatus() != null) {
                            String bs = battery.getStatus().toLowerCase();
                            switch (bs) {
                                case "in_use":
                                case "in-use":
                                    slotStatus = "empty";// battery removed from slot
                                    break;
                                case "charging":
                                    slotStatus = "charging"; // battery present and charging
                                    break;
                                case "available":
                                    slotStatus = "full"; // battery present and ready
                                    break;
                                case "faulty":
                                    slotStatus = "faulty"; // battery faulty 
                                    break;
                                default:
                                    slotStatus = "charging";
                            }
                        }
                        try (java.sql.PreparedStatement slotPs = conn.prepareStatement("UPDATE Slots SET status = ? WHERE slot_id = ?")) {
                            slotPs.setString(1, slotStatus);
                            slotPs.setInt(2, battery.getSlotId());
                            slotPs.executeUpdate();
                        }
                        // Note: do NOT clear Batteries.slot_id here — keep slotId if battery still references it.
                    }
                } catch (Exception e) {
                    // Log but don't fail the entire request — battery update already succeeded
                    e.printStackTrace();
                }
                response.put("success", true);
                response.put("message", "Battery updated successfully");
                response.put("data", battery);
            } else {
                response.put("success", false);
                response.put("message", "Failed to update battery");
                return ResponseEntity.status(500).body(response);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error updating battery: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBattery(@PathVariable Long id) {
        try {
            // Check if battery exists
            Battery existingBattery = batteryDao.getBatteryById(id.intValue());
            if (existingBattery == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Battery not found");
                return ResponseEntity.status(404).body(response);
            }
            
            // Check if battery is currently in use
            if ("IN_USE".equals(existingBattery.getStatus())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Cannot delete battery that is currently in use");
                return ResponseEntity.status(400).body(response);
            }
            
            boolean deleted = batteryDao.deleteBattery(id.intValue());
            
            Map<String, Object> response = new HashMap<>();
            if (deleted) {
                response.put("success", true);
                response.put("message", "Battery deleted successfully");
            } else {
                response.put("success", false);
                response.put("message", "Failed to delete battery");
                return ResponseEntity.status(500).body(response);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error deleting battery: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getBatteryStatistics() {
        try {
            Map<String, Integer> stats = batteryDao.getBatteryStatistics();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching battery statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{batteryId}/assign-slot")
    public ResponseEntity<?> assignBatteryToSlot(
            @PathVariable Long batteryId,
            @RequestBody Map<String, Object> request) {
        try {
            Integer slotId = request.get("slotId") != null ? 
                Integer.valueOf(request.get("slotId").toString()) : null;
            
            if (slotId == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "slotId is required");
                return ResponseEntity.status(400).body(response);
            }
            
            // Check if battery exists
            Battery battery = batteryDao.getBatteryById(batteryId.intValue());
            if (battery == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Battery not found");
                return ResponseEntity.status(404).body(response);
            }
            
            // Check if battery is in_use (cannot assign to slot)
            if ("in_use".equalsIgnoreCase(battery.getStatus()) || "IN_USE".equals(battery.getStatus())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Cannot assign battery that is currently in use");
                return ResponseEntity.status(400).body(response);
            }
            
            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection()) {
                conn.setAutoCommit(false);
                
                try {
                    // 1. Check if slot exists and is empty
                    String checkSlotSql = """
                        SELECT sl.slot_id, sl.status, t.tower_id, t.tower_number, t.station_id
                        FROM Slots sl
                        INNER JOIN Towers t ON sl.tower_id = t.tower_id
                        WHERE sl.slot_id = ?
                    """;
                    
                    Integer towerId = null;
                    String slotStatus = null;
                    
                    try (java.sql.PreparedStatement checkPs = conn.prepareStatement(checkSlotSql)) {
                        checkPs.setInt(1, slotId);
                        java.sql.ResultSet rs = checkPs.executeQuery();
                        
                        if (!rs.next()) {
                            conn.rollback();
                            Map<String, Object> response = new HashMap<>();
                            response.put("success", false);
                            response.put("message", "Slot not found");
                            return ResponseEntity.status(404).body(response);
                        }
                        
                        slotStatus = rs.getString("status");
                        towerId = rs.getInt("tower_id");
                    }
                    
                    // Check if slot is empty
                    if (!"empty".equalsIgnoreCase(slotStatus)) {
                        conn.rollback();
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", false);
                        response.put("message", "Slot is not empty. Current status: " + slotStatus);
                        return ResponseEntity.status(400).body(response);
                    }
                    
                    // 2. Check if slot already has another battery
                    String checkBatteryInSlotSql = "SELECT COUNT(*) FROM Batteries WHERE slot_id = ?";
                    try (java.sql.PreparedStatement checkBatPs = conn.prepareStatement(checkBatteryInSlotSql)) {
                        checkBatPs.setInt(1, slotId);
                        java.sql.ResultSet rs = checkBatPs.executeQuery();
                        if (rs.next() && rs.getInt(1) > 0) {
                            conn.rollback();
                            Map<String, Object> response = new HashMap<>();
                            response.put("success", false);
                            response.put("message", "Slot already has a battery assigned");
                            return ResponseEntity.status(400).body(response);
                        }
                    }
                    
                    // 3. Update battery: set slot_id and status
                    String updateBatterySql = "UPDATE Batteries SET slot_id = ?, status = ? WHERE battery_id = ?";
                    String newBatteryStatus = "available"; // Battery in slot and ready
                    
                    try (java.sql.PreparedStatement updateBatPs = conn.prepareStatement(updateBatterySql)) {
                        updateBatPs.setInt(1, slotId);
                        updateBatPs.setString(2, newBatteryStatus);
                        updateBatPs.setLong(3, batteryId);
                        updateBatPs.executeUpdate();
                    }
                    
                    // 4. Update slot status to 'full'
                    String updateSlotSql = "UPDATE Slots SET status = 'full' WHERE slot_id = ?";
                    try (java.sql.PreparedStatement updateSlotPs = conn.prepareStatement(updateSlotSql)) {
                        updateSlotPs.setInt(1, slotId);
                        updateSlotPs.executeUpdate();
                    }
                    
                    conn.commit();
                    
                    // Get updated info
                    Battery updatedBattery = batteryDao.getBatteryById(batteryId.intValue());
                    
                    Map<String, Object> resultData = new HashMap<>();
                    resultData.put("batteryId", batteryId);
                    resultData.put("slotId", slotId);
                    resultData.put("towerId", towerId);
                    resultData.put("batteryStatus", updatedBattery.getStatus());
                    resultData.put("slotStatus", "full");
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Battery assigned to slot successfully");
                    response.put("data", resultData);
                    
                    return ResponseEntity.ok(response);
                    
                } catch (Exception e) {
                    conn.rollback();
                    throw e;
                }
            }
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error assigning battery to slot: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{batteryId}/remove-from-slot")
    public ResponseEntity<?> removeBatteryFromSlot(@PathVariable Long batteryId) {
        try {
            // Check if battery exists
            Battery battery = batteryDao.getBatteryById(batteryId.intValue());
            if (battery == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Battery not found");
                return ResponseEntity.status(404).body(response);
            }
            
            if (battery.getSlotId() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Battery is not assigned to any slot");
                return ResponseEntity.status(400).body(response);
            }
            
            // Check if battery is in_use (cannot remove)
            if ("in_use".equalsIgnoreCase(battery.getStatus()) || "IN_USE".equals(battery.getStatus())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Cannot remove battery that is currently in use");
                return ResponseEntity.status(400).body(response);
            }
            
            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection()) {
                conn.setAutoCommit(false);
                
                try {
                    Integer oldSlotId = battery.getSlotId();
                    
                    // 1. Update battery: clear slot_id and set status to 'charging' or 'faulty' based on current
                    String newStatus = "faulty".equalsIgnoreCase(battery.getStatus()) ? "faulty" : "charging";
                    String updateBatterySql = "UPDATE Batteries SET slot_id = NULL, status = ? WHERE battery_id = ?";
                    
                    try (java.sql.PreparedStatement updateBatPs = conn.prepareStatement(updateBatterySql)) {
                        updateBatPs.setString(1, newStatus);
                        updateBatPs.setLong(2, batteryId);
                        updateBatPs.executeUpdate();
                    }
                    
                    // 2. Update slot status to 'empty'
                    String updateSlotSql = "UPDATE Slots SET status = 'empty' WHERE slot_id = ?";
                    try (java.sql.PreparedStatement updateSlotPs = conn.prepareStatement(updateSlotSql)) {
                        updateSlotPs.setInt(1, oldSlotId);
                        updateSlotPs.executeUpdate();
                    }
                    
                    conn.commit();
                    
                    Map<String, Object> resultData = new HashMap<>();
                    resultData.put("batteryId", batteryId);
                    resultData.put("previousSlotId", oldSlotId);
                    resultData.put("batteryStatus", newStatus);
                    resultData.put("slotStatus", "empty");
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Battery removed from slot successfully");
                    response.put("data", resultData);
                    
                    return ResponseEntity.ok(response);
                    
                } catch (Exception e) {
                    conn.rollback();
                    throw e;
                }
            }
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error removing battery from slot: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/bulk")
    public ResponseEntity<?> bulkUpdateBatteries(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> batteryUpdates = (List<Map<String, Object>>) request.get("batteries");
            
            if (batteryUpdates == null || batteryUpdates.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "No batteries provided for update");
                return ResponseEntity.status(400).body(response);
            }
            
            int successCount = 0;
            int failCount = 0;
            List<String> errors = new ArrayList<>();
            
            for (Map<String, Object> batteryData : batteryUpdates) {
                try {
                    Integer id = (Integer) batteryData.get("batteryId");
                    if (id == null) {
                        failCount++;
                        errors.add("Battery ID missing");
                        continue;
                    }
                    
                    Battery existingBattery = batteryDao.getBatteryById(id);
                    if (existingBattery == null) {
                        failCount++;
                        errors.add("Battery " + id + " not found");
                        continue;
                    }
                    
                    // Update fields if provided
                    if (batteryData.containsKey("status")) {
                        existingBattery.setStatus((String) batteryData.get("status"));
                    }
                    if (batteryData.containsKey("stateOfHealth")) {
                        Double health = Double.valueOf(batteryData.get("stateOfHealth").toString());
                        if (health >= 0 && health <= 100) {
                            existingBattery.setStateOfHealth(health);
                        }
                    }
                    if (batteryData.containsKey("cycleCount")) {
                        Integer cycles = (Integer) batteryData.get("cycleCount");
                        if (cycles >= 0) {
                            existingBattery.setCycleCount(cycles);
                        }
                    }
                    
                    if (batteryDao.updateBattery(existingBattery)) {
                        successCount++;
                    } else {
                        failCount++;
                        errors.add("Failed to update battery " + id);
                    }
                } catch (Exception e) {
                    failCount++;
                    errors.add("Error updating battery: " + e.getMessage());
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", successCount > 0);
            response.put("message", String.format("Bulk update completed. Success: %d, Failed: %d", successCount, failCount));
            response.put("successCount", successCount);
            response.put("failCount", failCount);
            if (!errors.isEmpty()) {
                response.put("errors", errors);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error in bulk update: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}