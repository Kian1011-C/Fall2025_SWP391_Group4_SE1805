package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dao.TowerDao;
import hsf302.fa25.s3.dao.SlotDao;
import hsf302.fa25.s3.model.Tower;
import hsf302.fa25.s3.model.Slot;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/driver")
public class DriverController {
    
    private final TowerDao towerDao = new TowerDao();
    private final SlotDao slotDao = new SlotDao();

    @GetMapping("/towers")
    public ResponseEntity<?> getTowersByStation(@RequestParam int stationId) {
        try {
            List<Tower> towers = towerDao.getTowersByStationId(stationId);
            
            List<Map<String, Object>> towerMaps = new ArrayList<>();
            for (Tower tower : towers) {
                Map<String, Object> towerMap = new HashMap<>();
                towerMap.put("id", tower.getTowerId());
                towerMap.put("towerNumber", tower.getTowerNumber());
                towerMap.put("status", tower.getStatus());
                
                // Get available slots for this tower
                List<Slot> slots = slotDao.getSlotsByTowerId(tower.getTowerId());
                int availableSlots = 0;
                for (Slot slot : slots) {
                    if ("available".equals(slot.getStatus()) || "full".equals(slot.getStatus())) {
                        availableSlots++;
                    }
                }
                towerMap.put("availableSlots", availableSlots);
                towerMap.put("totalSlots", slots.size());
                
                towerMaps.add(towerMap);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", towerMaps);
            response.put("message", "Lấy danh sách trụ thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách trụ: " + e.getMessage());
            response.put("data", new ArrayList<>());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/slots")
    public ResponseEntity<?> getSlotsByTower(@RequestParam int towerId) {
        try {
            List<Slot> slots = slotDao.getSlotsByTowerId(towerId);
            
            List<Map<String, Object>> slotMaps = new ArrayList<>(); 
            for (Slot slot : slots) {
                Map<String, Object> slotMap = new HashMap<>();
                slotMap.put("id", slot.getSlotId());
                slotMap.put("slotNumber", slot.getSlotNumber());
                slotMap.put("status", slot.getStatus());
                
                // Lấy thông tin pin trong slot này (nếu có)
                Map<String, Object> batteryInfo = slotDao.getBatteryInfoBySlotId(slot.getSlotId());
                if (batteryInfo != null) {
                    slotMap.put("batteryId", batteryInfo.get("battery_id"));
                    slotMap.put("batteryLevel", batteryInfo.get("state_of_health")); // SOH as battery level
                    slotMap.put("batteryModel", batteryInfo.get("model"));
                    slotMap.put("batteryStatus", batteryInfo.get("battery_status"));
                } else {
                    slotMap.put("batteryId", null);
                    slotMap.put("batteryLevel", null);
                    slotMap.put("batteryModel", null);
                    slotMap.put("batteryStatus", null);
                }
                
                slotMaps.add(slotMap);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", slotMaps);
            response.put("message", "Lấy danh sách slot với thông tin pin thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách slot: " + e.getMessage());
            response.put("data", new ArrayList<>());
            
            return ResponseEntity.status(500).body(response);
        }
    }
}