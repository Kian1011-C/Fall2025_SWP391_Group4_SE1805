package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/driver")
public class DriverController {
    
    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping("/towers")
    public ResponseEntity<?> getTowersByStation(@RequestParam int stationId) {
        try {
            List<Map<String, Object>> towerMaps = driverService.getTowersByStation(stationId);
            
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
            List<Map<String, Object>> slotMaps = driverService.getSlotsByTower(towerId);
            
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

    @GetMapping("/slot/empty")
    public ResponseEntity<?> getOneEmptySlot(@RequestParam int towerId) {
        try {
            Map<String, Object> slotMap = driverService.getOneEmptySlot(towerId);
            
            Map<String, Object> response = new HashMap<>();
            if (slotMap == null) {
                response.put("success", true);
                response.put("data", null);
                response.put("message", "Không tìm thấy slot trống trong trụ này");
                return ResponseEntity.ok(response);
            }

            response.put("success", true);
            response.put("data", slotMap);
            response.put("message", "Found empty slot");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi tìm slot trống: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(500).body(response);
        }
    }
}