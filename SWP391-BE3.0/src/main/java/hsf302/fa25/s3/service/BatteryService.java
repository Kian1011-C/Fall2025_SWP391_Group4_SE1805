package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Battery;
import java.util.List;
import java.util.Map;

public interface BatteryService {
    
    // Battery status and health operations
    Battery getBatteryStatus(Long id);
    List<Map<String, Object>> getBatteryHistory(Long id);
    Map<String, Object> getBatteryHealth(Long id);
    
    // Battery swap operations
    Map<String, Object> initiateBatterySwap(Map<String, Object> swapRequest);
    Map<String, Object> confirmBatterySwap(Long swapId);
    
    // Battery CRUD operations
    List<Battery> getAllBatteries(String status, Long stationId, int page, int size);
    Battery getBatteryById(Long id);
    Battery createBattery(Battery battery);
    Battery updateBattery(Long id, Battery battery);
    boolean deleteBattery(Long id);
    
    // Battery statistics and management
    Map<String, Integer> getBatteryStatistics();
    List<Battery> getBatteriesByStation(Long stationId);
    Map<String, Object> getBatteryByVehicle(int vehicleId);
    
    // Battery maintenance
    Map<String, Object> scheduleBatteryMaintenance(Long id, Map<String, Object> maintenanceRequest);
    
    // Battery slot assignment
    Map<String, Object> assignBatteryToSlot(Long batteryId, Integer slotId);
    Map<String, Object> removeBatteryFromSlot(Long batteryId);
}
