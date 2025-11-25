package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Battery;
import hsf302.fa25.s3.repository.BatteryRepo;
import hsf302.fa25.s3.repository.SwapRepo;
import hsf302.fa25.s3.repository.ContractRepo;
import hsf302.fa25.s3.utils.ConnectDB;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

@Service
public class BatteryServiceImpl implements BatteryService {

    private final BatteryRepo batteryRepo;
    private final SwapRepo swapRepo;
    private final ContractRepo contractRepo;

    public BatteryServiceImpl() {
        this.batteryRepo = new BatteryRepo();
        this.swapRepo = new SwapRepo();
        this.contractRepo = new ContractRepo();
    }

    @Override
    public Battery getBatteryStatus(Long id) {
        return batteryRepo.getBatteryById(id.intValue());
    }

    @Override
    public List<Map<String, Object>> getBatteryHistory(Long id) {
        return swapRepo.getBatterySwapHistory(id.intValue());
    }

    @Override
    public Map<String, Object> getBatteryHealth(Long id) {
        try {
            String sql = "SELECT * FROM Batteries WHERE battery_id = ?";
            
            try (Connection conn = ConnectDB.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setLong(1, id);
                
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    Map<String, Object> healthMetrics = new HashMap<>();
                    healthMetrics.put("batteryId", rs.getInt("battery_id"));
                    healthMetrics.put("model", rs.getString("model"));
                    healthMetrics.put("capacity", rs.getInt("capacity"));
                    healthMetrics.put("overallHealth", rs.getDouble("state_of_health"));
                    healthMetrics.put("cycleCount", rs.getInt("cycle_count"));
                    healthMetrics.put("status", rs.getString("status"));
                    
                    double stateOfHealth = rs.getDouble("state_of_health");
                    int cycleCount = rs.getInt("cycle_count");
                    
                    healthMetrics.put("capacityRetention", stateOfHealth);
                    healthMetrics.put("maxCycles", 2000);
                    
                    double degradationRate = (100 - stateOfHealth) / (cycleCount > 0 ? cycleCount : 1);
                    int remainingCycles = Math.max(0, 2000 - cycleCount);
                    double estimatedMonths = remainingCycles / 30.0;
                    healthMetrics.put("estimatedLifeRemaining", Math.round(estimatedMonths));
                    healthMetrics.put("degradationRate", Math.round(degradationRate * 100.0) / 100.0);
                    
                    List<String> recommendations = new ArrayList<>();
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
                    
                    return healthMetrics;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error fetching battery health: " + e.getMessage(), e);
        }
        return null;
    }

    @Override
    public Map<String, Object> initiateBatterySwap(Map<String, Object> swapRequest) {
        try {
            String userId = swapRequest.get("userId").toString();
            Long stationId = Long.valueOf(swapRequest.get("stationId").toString());
            String staffId = swapRequest.containsKey("staffId") && swapRequest.get("staffId") != null
                    ? swapRequest.get("staffId").toString() : null;
            Long towerIdReq = swapRequest.containsKey("towerId") && swapRequest.get("towerId") != null
                ? Long.valueOf(swapRequest.get("towerId").toString()) : null;

            if (towerIdReq == null) {
                throw new IllegalArgumentException("towerId is required");
            }
            
            Long oldBatteryId = swapRequest.containsKey("batteryId") ? 
                Long.valueOf(swapRequest.get("batteryId").toString()) : null;
            Integer vehicleId = swapRequest.containsKey("vehicleId") && swapRequest.get("vehicleId") != null
                    ? Integer.valueOf(swapRequest.get("vehicleId").toString()) : null;
            
            String findBatterySql = """
                SELECT TOP 1 b.battery_id, sl.slot_id, sl.slot_number, t.tower_id, t.tower_number
                FROM Batteries b
                INNER JOIN Slots sl ON b.slot_id = sl.slot_id
                INNER JOIN Towers t ON sl.tower_id = t.tower_id
                WHERE t.tower_id = ? AND UPPER(b.status) = 'AVAILABLE'
                ORDER BY b.state_of_health DESC
            """;

            try (Connection conn = ConnectDB.getConnection();
                 PreparedStatement ps = conn.prepareStatement(findBatterySql)) {
                ps.setLong(1, towerIdReq);
                
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    Long newBatteryId = rs.getLong("battery_id");
                    Integer newBatterySlotId = rs.getObject("slot_id") != null ? rs.getInt("slot_id") : null;
                    int slotNumber = rs.getInt("slot_number");
                    int towerNumber = rs.getInt("tower_number");
                    
                    Integer contractId = findActiveContract(userId, vehicleId, conn);
                    if (contractId == null) {
                        throw new IllegalStateException("Không tìm thấy hợp đồng active cho user này");
                    }
                    
                    Integer swapVehicleId = resolveVehicleId(vehicleId, contractId, conn);
                    
                    if (oldBatteryId != null) {
                        degradeOldBattery(oldBatteryId, conn);
                    }
                    
                    Long swapId = createSwapRecord(userId, contractId, swapVehicleId, stationId, 
                                                   towerIdReq, staffId, oldBatteryId, newBatteryId, conn);
                    
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
                    swapTransaction.put("estimatedTime", 300);
                    swapTransaction.put("initiatedAt", new Date());

                    return swapTransaction;
                } else {
                    throw new IllegalStateException("No available batteries at this tower");
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error initiating battery swap: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> confirmBatterySwap(Long swapId) {
        try {
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

            try (Connection conn = ConnectDB.getConnection()) {
                conn.setAutoCommit(false);

                try (PreparedStatement selectPs = conn.prepareStatement(getSwapSql)) {
                    selectPs.setLong(1, swapId);
                    try (ResultSet rs = selectPs.executeQuery()) {
                        if (!rs.next()) {
                            conn.rollback();
                            throw new IllegalArgumentException("Swap not found");
                        }

                        Integer oldBatteryId = rs.getObject("old_battery_id") != null ? rs.getInt("old_battery_id") : null;
                        int newBatteryId = rs.getInt("new_battery_id");
                        int stationId = rs.getInt("station_id");
                        Integer contractId = rs.getObject("contract_id") != null ? rs.getInt("contract_id") : null;
                        Integer towerId = rs.getObject("tower_id") != null ? rs.getInt("tower_id") : null;

                        updateSwapStatus(swapId, conn);
                        handleOldBattery(oldBatteryId, towerId, conn);
                        handleNewBattery(newBatteryId, rs.getObject("new_slot_id") != null ? rs.getInt("new_slot_id") : null, conn);
                        updateVehicleBattery(contractId, newBatteryId, conn);
                        updateContractUsage(rs, contractId);

                        conn.commit();

                        Map<String, Object> swapResult = new HashMap<>();
                        swapResult.put("swapId", swapId);
                        swapResult.put("userId", rs.getString("user_id"));
                        swapResult.put("stationId", stationId);
                        swapResult.put("oldBatteryId", oldBatteryId);
                        swapResult.put("newBatteryId", newBatteryId);
                        swapResult.put("status", "COMPLETED");
                        swapResult.put("swapDate", rs.getTimestamp("swap_date"));
                        swapResult.put("completedAt", new Date());
                        
                        return swapResult;
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error confirming battery swap: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Battery> getAllBatteries(String status, Long stationId, int page, int size) {
        List<Battery> batteries;
        
        if (status != null && !status.isEmpty()) {
            batteries = batteryRepo.getBatteriesByStatus(status);
        } else {
            batteries = batteryRepo.getAllBatteries();
        }
        
        if (stationId != null) {
            batteries = filterBatteriesByStation(batteries, stationId);
        }
        
        int start = page * size;
        int end = Math.min(start + size, batteries.size());
        return batteries.subList(start, end);
    }

    @Override
    public Battery getBatteryById(Long id) {
        return batteryRepo.getBatteryById(id.intValue());
    }

    @Override
    public Battery createBattery(Battery battery) {
        if (battery.getModel() == null || battery.getModel().trim().isEmpty()) {
            throw new IllegalArgumentException("Model is required");
        }
        
        if (battery.getCapacity() <= 0) {
            throw new IllegalArgumentException("Capacity must be greater than 0");
        }
        
        if (battery.getStateOfHealth() == 0) {
            battery.setStateOfHealth(100.0);
        }
        if (battery.getStatus() == null || battery.getStatus().isEmpty()) {
            battery.setStatus("AVAILABLE");
        }
        if (battery.getCycleCount() == 0) {
            battery.setCycleCount(0);
        }
        
        boolean created = batteryRepo.createBattery(battery);
        if (!created) {
            throw new RuntimeException("Failed to create battery");
        }
        
        return battery;
    }

    @Override
    public Battery updateBattery(Long id, Battery battery) {
        Battery existingBattery = batteryRepo.getBatteryById(id.intValue());
        if (existingBattery == null) {
            throw new IllegalArgumentException("Battery not found");
        }
        
        battery.setBatteryId(id.intValue());
        
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
        if (battery.getSlotId() == null) {
            battery.setSlotId(existingBattery.getSlotId());
        }
        if (battery.getCycleCount() <= 0) {
            battery.setCycleCount(existingBattery.getCycleCount());
        }
        
        boolean updated = batteryRepo.updateBattery(battery);
        if (updated) {
            updateSlotStatusForBattery(battery);
        } else {
            throw new RuntimeException("Failed to update battery");
        }
        
        return battery;
    }

    @Override
    public boolean deleteBattery(Long id) {
        Battery existingBattery = batteryRepo.getBatteryById(id.intValue());
        if (existingBattery == null) {
            throw new IllegalArgumentException("Battery not found");
        }
        
        if ("IN_USE".equals(existingBattery.getStatus())) {
            throw new IllegalStateException("Cannot delete battery that is currently in use");
        }
        
        return batteryRepo.deleteBattery(id.intValue());
    }

    @Override
    public Map<String, Integer> getBatteryStatistics() {
        return batteryRepo.getBatteryStatistics();
    }

    @Override
    public List<Battery> getBatteriesByStation(Long stationId) {
        try {
            String sql = """
                SELECT b.*, sl.slot_number, t.tower_number
                FROM Batteries b
                INNER JOIN Slots sl ON b.slot_id = sl.slot_id
                INNER JOIN Towers t ON sl.tower_id = t.tower_id
                WHERE t.station_id = ?
                ORDER BY t.tower_number, sl.slot_number
            """;
            
            List<Battery> batteries = new ArrayList<>();
            
            try (Connection conn = ConnectDB.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setLong(1, stationId);
                
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Battery battery = new Battery();
                    battery.setBatteryId(rs.getInt("battery_id"));
                    battery.setModel(rs.getString("model"));
                    battery.setCapacity(rs.getInt("capacity"));
                    battery.setStateOfHealth(rs.getDouble("state_of_health"));
                    battery.setStatus(rs.getString("status"));
                    battery.setCycleCount(rs.getInt("cycle_count"));
                    Object slotObj = rs.getObject("slot_id");
                    if (slotObj != null) battery.setSlotId(((Number) slotObj).intValue());
                    batteries.add(battery);
                }
            }
            return batteries;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching batteries by station: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> getBatteryByVehicle(int vehicleId) {
        try {
            String sql = """
                SELECT b.model, b.state_of_health, b.cycle_count 
                FROM Vehicles v 
                INNER JOIN Batteries b ON v.current_battery_id = b.battery_id 
                WHERE v.vehicle_id = ?
            """;
            
            Map<String, Object> batteryInfo = new HashMap<>();
            
            try (Connection conn = ConnectDB.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, vehicleId);
                
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    batteryInfo.put("model", rs.getString("model"));
                    batteryInfo.put("health", rs.getDouble("state_of_health"));
                    batteryInfo.put("cycles", rs.getInt("cycle_count"));
                    return batteryInfo;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error fetching battery by vehicle: " + e.getMessage(), e);
        }
        return null;
    }

    @Override
    public Map<String, Object> scheduleBatteryMaintenance(Long id, Map<String, Object> maintenanceRequest) {
        String maintenanceDate = (String) maintenanceRequest.get("maintenanceDate");
        String maintenanceType = (String) maintenanceRequest.get("type");
        String notes = (String) maintenanceRequest.get("notes");
        
        Map<String, Object> maintenanceSchedule = new HashMap<>();
        maintenanceSchedule.put("maintenanceId", System.currentTimeMillis());
        maintenanceSchedule.put("batteryId", id);
        maintenanceSchedule.put("scheduledDate", maintenanceDate);
        maintenanceSchedule.put("type", maintenanceType != null ? maintenanceType : "ROUTINE");
        maintenanceSchedule.put("status", "SCHEDULED");
        maintenanceSchedule.put("notes", notes);
        maintenanceSchedule.put("scheduledBy", "SYSTEM");
        maintenanceSchedule.put("createdAt", new Date());
        
        return maintenanceSchedule;
    }

    @Override
    public Map<String, Object> assignBatteryToSlot(Long batteryId, Integer slotId) {
        try {
            Battery battery = batteryRepo.getBatteryById(batteryId.intValue());
            if (battery == null) {
                throw new IllegalArgumentException("Battery not found");
            }
            
            if ("in_use".equalsIgnoreCase(battery.getStatus()) || "IN_USE".equals(battery.getStatus())) {
                throw new IllegalStateException("Cannot assign battery that is currently in use");
            }
            
            try (Connection conn = ConnectDB.getConnection()) {
                conn.setAutoCommit(false);
                
                try {
                    String checkSlotSql = """
                        SELECT sl.slot_id, sl.status, t.tower_id, t.tower_number, t.station_id
                        FROM Slots sl
                        INNER JOIN Towers t ON sl.tower_id = t.tower_id
                        WHERE sl.slot_id = ?
                    """;
                    
                    Integer towerId = null;
                    String slotStatus = null;
                    
                    try (PreparedStatement checkPs = conn.prepareStatement(checkSlotSql)) {
                        checkPs.setInt(1, slotId);
                        ResultSet rs = checkPs.executeQuery();
                        
                        if (!rs.next()) {
                            conn.rollback();
                            throw new IllegalArgumentException("Slot not found");
                        }
                        
                        slotStatus = rs.getString("status");
                        towerId = rs.getInt("tower_id");
                    }
                    
                    if (!"empty".equalsIgnoreCase(slotStatus)) {
                        conn.rollback();
                        throw new IllegalStateException("Slot is not empty. Current status: " + slotStatus);
                    }
                    
                    String checkBatteryInSlotSql = "SELECT COUNT(*) FROM Batteries WHERE slot_id = ?";
                    try (PreparedStatement checkBatPs = conn.prepareStatement(checkBatteryInSlotSql)) {
                        checkBatPs.setInt(1, slotId);
                        ResultSet rs = checkBatPs.executeQuery();
                        if (rs.next() && rs.getInt(1) > 0) {
                            conn.rollback();
                            throw new IllegalStateException("Slot already has a battery assigned");
                        }
                    }
                    
                    String updateBatterySql = "UPDATE Batteries SET slot_id = ?, status = ? WHERE battery_id = ?";
                    String newBatteryStatus = "available";
                    
                    try (PreparedStatement updateBatPs = conn.prepareStatement(updateBatterySql)) {
                        updateBatPs.setInt(1, slotId);
                        updateBatPs.setString(2, newBatteryStatus);
                        updateBatPs.setLong(3, batteryId);
                        updateBatPs.executeUpdate();
                    }
                    
                    String updateSlotSql = "UPDATE Slots SET status = 'full' WHERE slot_id = ?";
                    try (PreparedStatement updateSlotPs = conn.prepareStatement(updateSlotSql)) {
                        updateSlotPs.setInt(1, slotId);
                        updateSlotPs.executeUpdate();
                    }
                    
                    conn.commit();
                    
                    Battery updatedBattery = batteryRepo.getBatteryById(batteryId.intValue());
                    
                    Map<String, Object> resultData = new HashMap<>();
                    resultData.put("batteryId", batteryId);
                    resultData.put("slotId", slotId);
                    resultData.put("towerId", towerId);
                    resultData.put("batteryStatus", updatedBattery.getStatus());
                    resultData.put("slotStatus", "full");
                    
                    return resultData;
                    
                } catch (Exception e) {
                    conn.rollback();
                    throw e;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error assigning battery to slot: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> removeBatteryFromSlot(Long batteryId) {
        try {
            Battery battery = batteryRepo.getBatteryById(batteryId.intValue());
            if (battery == null) {
                throw new IllegalArgumentException("Battery not found");
            }
            
            if (battery.getSlotId() == null) {
                throw new IllegalStateException("Battery is not assigned to any slot");
            }
            
            if ("in_use".equalsIgnoreCase(battery.getStatus()) || "IN_USE".equals(battery.getStatus())) {
                throw new IllegalStateException("Cannot remove battery that is currently in use");
            }
            
            try (Connection conn = ConnectDB.getConnection()) {
                conn.setAutoCommit(false);
                
                try {
                    Integer oldSlotId = battery.getSlotId();
                    
                    String newStatus = "faulty";
                    String updateBatterySql = "UPDATE Batteries SET slot_id = NULL, status = ? WHERE battery_id = ?";
                    
                    try (PreparedStatement updateBatPs = conn.prepareStatement(updateBatterySql)) {
                        updateBatPs.setString(1, newStatus);
                        updateBatPs.setLong(2, batteryId);
                        updateBatPs.executeUpdate();
                    }
                    
                    String updateSlotSql = "UPDATE Slots SET status = 'empty' WHERE slot_id = ?";
                    try (PreparedStatement updateSlotPs = conn.prepareStatement(updateSlotSql)) {
                        updateSlotPs.setInt(1, oldSlotId);
                        updateSlotPs.executeUpdate();
                    }
                    
                    conn.commit();
                    
                    Map<String, Object> resultData = new HashMap<>();
                    resultData.put("batteryId", batteryId);
                    resultData.put("previousSlotId", oldSlotId);
                    resultData.put("batteryStatus", newStatus);
                    resultData.put("slotStatus", "empty");
                    
                    return resultData;
                    
                } catch (Exception e) {
                    conn.rollback();
                    throw e;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error removing battery from slot: " + e.getMessage(), e);
        }
    }

    // Helper methods
    private Integer findActiveContract(String userId, Integer vehicleId, Connection conn) throws Exception {
        Integer contractId = null;
        String findContractSql;
        if (vehicleId != null) {
            findContractSql = "SELECT TOP 1 c.contract_id FROM Contracts c WHERE c.vehicle_id = ? AND c.status = 'active' ORDER BY c.contract_id DESC";
            try (PreparedStatement cPs = conn.prepareStatement(findContractSql)) {
                cPs.setInt(1, vehicleId);
                try (ResultSet cRs = cPs.executeQuery()) {
                    if (cRs.next()) {
                        contractId = cRs.getInt("contract_id");
                    }
                }
            }
        } else {
            findContractSql = "SELECT TOP 1 c.contract_id FROM Contracts c " +
                    "WHERE c.vehicle_id IN (SELECT vehicle_id FROM Vehicles WHERE user_id = ?) " +
                    "AND c.status = 'active' ORDER BY c.contract_id DESC";
            try (PreparedStatement cPs = conn.prepareStatement(findContractSql)) {
                cPs.setString(1, userId);
                try (ResultSet cRs = cPs.executeQuery()) {
                    if (cRs.next()) {
                        contractId = cRs.getInt("contract_id");
                    }
                }
            }
        }
        return contractId;
    }

    private Integer resolveVehicleId(Integer vehicleId, Integer contractId, Connection conn) throws Exception {
        if (vehicleId != null) {
            return vehicleId;
        }
        String findVehicleSql = "SELECT vehicle_id FROM Contracts WHERE contract_id = ?";
        try (PreparedStatement vPs = conn.prepareStatement(findVehicleSql)) {
            vPs.setInt(1, contractId);
            try (ResultSet vRs = vPs.executeQuery()) {
                if (vRs.next()) {
                    return vRs.getInt("vehicle_id");
                }
            }
        }
        return null;
    }

    private void degradeOldBattery(Long oldBatteryId, Connection conn) throws Exception {
        double degradation = 1 + (Math.random() * 49);
        String updateOldBatterySql = """
            UPDATE Batteries 
            SET state_of_health = CASE 
                WHEN state_of_health - ? < 0 THEN 0 
                ELSE state_of_health - ? 
            END,
            cycle_count = cycle_count + 1
            WHERE battery_id = ?
        """;
        try (PreparedStatement degradePs = conn.prepareStatement(updateOldBatterySql)) {
            degradePs.setDouble(1, degradation);
            degradePs.setDouble(2, degradation);
            degradePs.setLong(3, oldBatteryId);
            degradePs.executeUpdate();
        }
    }

    private Long createSwapRecord(String userId, Integer contractId, Integer swapVehicleId, 
                                   Long stationId, Long towerId, String staffId, 
                                   Long oldBatteryId, Long newBatteryId, Connection conn) throws Exception {
        String insertSwapSql = """
            INSERT INTO Swaps (user_id, contract_id, vehicle_id, station_id, tower_id, staff_id, old_battery_id, new_battery_id, swap_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), 'INITIATED')
        """;

        try (PreparedStatement insertPs = conn.prepareStatement(insertSwapSql, 
                java.sql.Statement.RETURN_GENERATED_KEYS)) {
            insertPs.setString(1, userId);
            insertPs.setInt(2, contractId);
            if (swapVehicleId != null) {
                insertPs.setInt(3, swapVehicleId);
            } else {
                insertPs.setNull(3, java.sql.Types.INTEGER);
            }
            insertPs.setLong(4, stationId);
            insertPs.setLong(5, towerId);
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
                try (ResultSet generatedKeys = insertPs.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        return generatedKeys.getLong(1);
                    }
                }
            }
        }
        return null;
    }

    private void updateSwapStatus(Long swapId, Connection conn) throws Exception {
        try (PreparedStatement updateSwapPs = conn.prepareStatement(
                "UPDATE Swaps SET status = 'COMPLETED', swap_date = GETDATE() WHERE swap_id = ?")) {
            updateSwapPs.setLong(1, swapId);
            updateSwapPs.executeUpdate();
        }
    }

    private void handleOldBattery(Integer oldBatteryId, Integer towerId, Connection conn) throws Exception {
        if (oldBatteryId != null) {
            String findEmptySlotSql = """
                SELECT TOP 1 sl.slot_id FROM Slots sl
                WHERE sl.tower_id = ? AND sl.status = 'empty'
                ORDER BY sl.slot_number
            """;
            Integer targetSlotId = null;
            try (PreparedStatement slotPs = conn.prepareStatement(findEmptySlotSql)) {
                slotPs.setInt(1, towerId);
                try (ResultSet slotRs = slotPs.executeQuery()) {
                    if (slotRs.next()) {
                        targetSlotId = slotRs.getInt("slot_id");
                    }
                }
            }

            if (targetSlotId != null) {
                try (PreparedStatement updBat = conn.prepareStatement(
                        "UPDATE Batteries SET slot_id = ?, status = 'charging' WHERE battery_id = ?")) {
                    updBat.setInt(1, targetSlotId);
                    updBat.setInt(2, oldBatteryId);
                    updBat.executeUpdate();
                }
                try (PreparedStatement updSlot = conn.prepareStatement(
                        "UPDATE Slots SET status = 'charging' WHERE slot_id = ?")) {
                    updSlot.setInt(1, targetSlotId);
                    updSlot.executeUpdate();
                }
            } else {
                try (PreparedStatement updBat = conn.prepareStatement(
                        "UPDATE Batteries SET slot_id = NULL, status = 'charging' WHERE battery_id = ?")) {
                    updBat.setInt(1, oldBatteryId);
                    updBat.executeUpdate();
                }
            }
        }
    }

    private void handleNewBattery(int newBatteryId, Integer newBatterySlotId, Connection conn) throws Exception {
        if (newBatterySlotId != null) {
            try (PreparedStatement updSlot = conn.prepareStatement(
                    "UPDATE Slots SET status = 'empty' WHERE slot_id = ?")) {
                updSlot.setInt(1, newBatterySlotId);
                updSlot.executeUpdate();
            }
        }
        try (PreparedStatement updNewBat = conn.prepareStatement(
                "UPDATE Batteries SET slot_id = NULL, status = 'in_use' WHERE battery_id = ?")) {
            updNewBat.setInt(1, newBatteryId);
            updNewBat.executeUpdate();
        }
    }

    private void updateVehicleBattery(Integer contractId, int newBatteryId, Connection conn) throws Exception {
        if (contractId != null) {
            try (PreparedStatement vehPs = conn.prepareStatement(
                    "UPDATE Vehicles SET current_battery_id = ? WHERE vehicle_id = (SELECT vehicle_id FROM Contracts WHERE contract_id = ?)")) {
                vehPs.setInt(1, newBatteryId);
                vehPs.setInt(2, contractId);
                vehPs.executeUpdate();
            }
        }
    }

    private void updateContractUsage(ResultSet rs, Integer contractId) throws Exception {
        java.math.BigDecimal distanceUsed = null;
        if (rs.getBigDecimal("odometer_after") != null && rs.getBigDecimal("odometer_before") != null) {
            distanceUsed = rs.getBigDecimal("odometer_after").subtract(rs.getBigDecimal("odometer_before"));
            if (distanceUsed.compareTo(java.math.BigDecimal.ZERO) > 0 && contractId != null) {
                contractRepo.updateMonthlyUsage(contractId, distanceUsed);
                contractRepo.calculateAndUpdateMonthlyFees(contractId);
            }
        }
    }

    private List<Battery> filterBatteriesByStation(List<Battery> batteries, Long stationId) {
        return batteries.stream()
            .filter(b -> {
                try {
                    String checkSql = """
                        SELECT COUNT(*) FROM Batteries b
                        INNER JOIN Slots sl ON b.slot_id = sl.slot_id
                        INNER JOIN Towers t ON sl.tower_id = t.tower_id
                        WHERE b.battery_id = ? AND t.station_id = ?
                    """;
                    try (Connection conn = ConnectDB.getConnection();
                         PreparedStatement ps = conn.prepareStatement(checkSql)) {
                        ps.setInt(1, b.getBatteryId());
                        ps.setLong(2, stationId);
                        ResultSet rs = ps.executeQuery();
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

    private void updateSlotStatusForBattery(Battery battery) {
        try (Connection conn = ConnectDB.getConnection()) {
            if (battery.getSlotId() != null) {
                String slotStatus = "charging";
                if (battery.getStatus() != null) {
                    String bs = battery.getStatus().toLowerCase();
                    switch (bs) {
                        case "in_use":
                        case "in-use":
                            slotStatus = "empty";
                            break;
                        case "charging":
                            slotStatus = "charging";
                            break;
                        case "available":
                            slotStatus = "full";
                            break;
                        case "faulty":
                            slotStatus = "faulty";
                            break;
                        default:
                            slotStatus = "charging";
                    }
                }
                try (PreparedStatement slotPs = conn.prepareStatement(
                        "UPDATE Slots SET status = ? WHERE slot_id = ?")) {
                    slotPs.setString(1, slotStatus);
                    slotPs.setInt(2, battery.getSlotId());
                    slotPs.executeUpdate();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
