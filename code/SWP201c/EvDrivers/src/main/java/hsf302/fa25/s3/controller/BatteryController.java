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
            Long oldBatteryId = swapRequest.containsKey("batteryId") ? 
                Long.valueOf(swapRequest.get("batteryId").toString()) : null;
            
            // Find available battery at the station
            String findBatterySql = """
                SELECT TOP 1 b.battery_id, sl.slot_number, t.tower_number
                FROM Batteries b
                INNER JOIN Slots sl ON b.slot_id = sl.slot_id
                INNER JOIN Towers t ON sl.tower_id = t.tower_id
                WHERE t.station_id = ? AND b.status = 'AVAILABLE'
                ORDER BY b.state_of_health DESC
            """;
            
            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection();
                 java.sql.PreparedStatement ps = conn.prepareStatement(findBatterySql)) {
                ps.setLong(1, stationId);
                
                java.sql.ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    Long newBatteryId = rs.getLong("battery_id");
                    int slotNumber = rs.getInt("slot_number");
                    int towerNumber = rs.getInt("tower_number");
                    
                    // Create swap record
                    String insertSwapSql = """
                        INSERT INTO Swaps (user_id, station_id, old_battery_id, new_battery_id, swap_date, status)
                        VALUES (?, ?, ?, ?, GETDATE(), 'INITIATED')
                    """;
                    
                    try (java.sql.PreparedStatement insertPs = conn.prepareStatement(insertSwapSql, 
                            java.sql.Statement.RETURN_GENERATED_KEYS)) {
                        insertPs.setString(1, userId);
                        insertPs.setLong(2, stationId);
                        if (oldBatteryId != null) {
                            insertPs.setLong(3, oldBatteryId);
                        } else {
                            insertPs.setNull(3, java.sql.Types.BIGINT);
                        }
                        insertPs.setLong(4, newBatteryId);
                        
                        int rowsAffected = insertPs.executeUpdate();
                        if (rowsAffected > 0) {
                            java.sql.ResultSet generatedKeys = insertPs.getGeneratedKeys();
                            if (generatedKeys.next()) {
                                Long swapId = generatedKeys.getLong(1);
                                
                                Map<String, Object> swapTransaction = new HashMap<>();
                                swapTransaction.put("swapId", swapId);
                                swapTransaction.put("userId", userId);
                                swapTransaction.put("stationId", stationId);
                                swapTransaction.put("oldBatteryId", oldBatteryId);
                                swapTransaction.put("newBatteryId", newBatteryId);
                                swapTransaction.put("status", "INITIATED");
                                swapTransaction.put("slotNumber", slotNumber);
                                swapTransaction.put("towerNumber", towerNumber);
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
                } else {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "No available batteries at this station");
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
            // Update swap status to COMPLETED
            String updateSwapSql = "UPDATE Swaps SET status = 'COMPLETED' WHERE swap_id = ?";
            
            // Get swap details
            String getSwapSql = """
                SELECT s.*, 
                       old_b.state_of_health as old_battery_charge,
                       new_b.state_of_health as new_battery_charge
                FROM Swaps s
                LEFT JOIN Batteries old_b ON s.old_battery_id = old_b.battery_id
                INNER JOIN Batteries new_b ON s.new_battery_id = new_b.battery_id
                WHERE s.swap_id = ?
            """;
            
            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection()) {
                // Update swap status
                try (java.sql.PreparedStatement updatePs = conn.prepareStatement(updateSwapSql)) {
                    updatePs.setLong(1, swapId);
                    int rowsUpdated = updatePs.executeUpdate();
                    
                    if (rowsUpdated > 0) {
                        // Get updated swap details
                        try (java.sql.PreparedStatement selectPs = conn.prepareStatement(getSwapSql)) {
                            selectPs.setLong(1, swapId);
                            
                            java.sql.ResultSet rs = selectPs.executeQuery();
                            if (rs.next()) {
                                Map<String, Object> swapResult = new HashMap<>();
                                swapResult.put("swapId", rs.getLong("swap_id"));
                                swapResult.put("userId", rs.getString("user_id"));
                                swapResult.put("stationId", rs.getLong("station_id"));
                                swapResult.put("oldBatteryId", rs.getObject("old_battery_id"));
                                swapResult.put("newBatteryId", rs.getLong("new_battery_id"));
                                swapResult.put("status", "COMPLETED");
                                swapResult.put("swapDate", rs.getTimestamp("swap_date"));
                                swapResult.put("completedAt", new java.util.Date());
                                
                                // Calculate actual time (mock calculation)
                                long startTime = rs.getTimestamp("swap_date").getTime();
                                long currentTime = System.currentTimeMillis();
                                long actualTimeSeconds = Math.min(600, (currentTime - startTime) / 1000); // Max 10 minutes
                                swapResult.put("actualTime", actualTimeSeconds);
                                
                                swapResult.put("oldBatteryCharge", rs.getDouble("old_battery_charge"));
                                swapResult.put("newBatteryCharge", rs.getDouble("new_battery_charge"));
                                
                                // No cost for individual swap - billing is monthly based on distance used
                                swapResult.put("cost", 0);
                                swapResult.put("billingNote", "Monthly billing based on distance usage");
                                
                                // Track distance usage for monthly billing
                                java.math.BigDecimal distanceUsed = null;
                                if (rs.getBigDecimal("odometer_after") != null && rs.getBigDecimal("odometer_before") != null) {
                                    distanceUsed = rs.getBigDecimal("odometer_after").subtract(rs.getBigDecimal("odometer_before"));
                                    
                                    if (distanceUsed.compareTo(java.math.BigDecimal.ZERO) > 0) {
                                        // Find contract for this user to update monthly usage
                                        try (java.sql.PreparedStatement contractPs = conn.prepareStatement(
                                                "SELECT TOP 1 contract_id FROM Contracts WHERE vehicle_id IN " +
                                                "(SELECT vehicle_id FROM Vehicles WHERE user_id = ?) AND status = 'ACTIVE'")) {
                                            contractPs.setString(1, rs.getString("user_id"));
                                            java.sql.ResultSet contractRs = contractPs.executeQuery();
                                            
                                            if (contractRs.next()) {
                                                int contractId = contractRs.getInt("contract_id");
                                                
                                                // Update monthly usage in contract
                                                contractDao.updateMonthlyUsage(contractId, distanceUsed);
                                                contractDao.calculateAndUpdateMonthlyFees(contractId);
                                                
                                                swapResult.put("distanceUsed", distanceUsed);
                                                swapResult.put("contractId", contractId);
                                                swapResult.put("usageUpdated", true);
                                                swapResult.put("billingNote", "Distance tracked for monthly billing");
                                            }
                                        }
                                    }
                                } else {
                                    swapResult.put("distanceUsed", 0);
                                    swapResult.put("usageUpdated", false);
                                    swapResult.put("billingNote", "No odometer data - distance not tracked");
                                }
                                
                                Map<String, Object> response = new HashMap<>();
                                response.put("success", true);
                                response.put("message", "Battery swap completed successfully");
                                response.put("data", swapResult);
                                
                                return ResponseEntity.ok(response);
                            }
                        }
                    }
                }
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Swap not found or already completed");
                return ResponseEntity.status(404).body(response);
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

    @GetMapping("/swap/active")
    public ResponseEntity<?> getActiveSwaps(@RequestParam(required = false) String userId) {
        try {
            List<Map<String, Object>> activeSwaps = swapDao.getActiveSwaps(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activeSwaps);
            response.put("total", activeSwaps.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching active swaps: " + e.getMessage());
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
            if (battery.getStateOfHealth() < 0 || battery.getStateOfHealth() > 100) {
                battery.setStateOfHealth(existingBattery.getStateOfHealth());
            }
            if (battery.getStatus() == null || battery.getStatus().isEmpty()) {
                battery.setStatus(existingBattery.getStatus());
            }
            
            boolean updated = batteryDao.updateBattery(battery);
            
            Map<String, Object> response = new HashMap<>();
            if (updated) {
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