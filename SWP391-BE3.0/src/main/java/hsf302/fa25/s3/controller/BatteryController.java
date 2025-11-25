package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.model.Battery;
import hsf302.fa25.s3.service.BatteryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/batteries")
public class BatteryController {

    private final BatteryService batteryService;

    public BatteryController(BatteryService batteryService) {
        this.batteryService = batteryService;
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<?> getBatteryStatus(@PathVariable Long id) {
        try {
            Battery battery = batteryService.getBatteryStatus(id);
            
            Map<String, Object> response = new HashMap<>();
            if (battery != null) {
                Map<String, Object> batteryStatus = new HashMap<>();
                batteryStatus.put("id", battery.getBatteryId());
                batteryStatus.put("serialNumber", "BAT-" + battery.getBatteryId() + "-2024");
                batteryStatus.put("model", battery.getModel());
                batteryStatus.put("capacity", battery.getCapacity());
                batteryStatus.put("stateOfHealth", battery.getStateOfHealth());
                batteryStatus.put("status", battery.getStatus().toUpperCase());
                batteryStatus.put("cycleCount", battery.getCycleCount());
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
            List<Map<String, Object>> history = batteryService.getBatteryHistory(id);
            
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
            Map<String, Object> swapTransaction = batteryService.initiateBatterySwap(swapRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Battery swap initiated successfully");
            response.put("data", swapTransaction);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        } catch (IllegalStateException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
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
            Map<String, Object> swapResult = batteryService.confirmBatterySwap(swapId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Battery swap completed successfully");
            response.put("data", swapResult);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
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
            Map<String, Object> healthMetrics = batteryService.getBatteryHealth(id);
            
            if (healthMetrics != null) {
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
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching battery health: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


    @GetMapping("/station/{stationId}")
    public ResponseEntity<?> getBatteriesByStation(@PathVariable Long stationId) {
        try {
            List<Battery> batteries = batteryService.getBatteriesByStation(stationId);
            
            List<Map<String, Object>> batteryMaps = new ArrayList<>();
            for (Battery b : batteries) {
                Map<String, Object> battery = new HashMap<>();
                battery.put("id", b.getBatteryId());
                battery.put("serialNumber", "BAT-" + stationId + "-" + String.format("%03d", b.getBatteryId()));
                battery.put("model", b.getModel());
                battery.put("capacity", b.getCapacity());
                battery.put("stateOfHealth", b.getStateOfHealth());
                battery.put("status", b.getStatus().toUpperCase());
                battery.put("cycleCount", b.getCycleCount());
                batteryMaps.add(battery);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", batteryMaps);
            response.put("total", batteryMaps.size());
            
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
            Map<String, Object> batteryInfo = batteryService.getBatteryByVehicle(vehicleId);
            
            if (batteryInfo == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy thông tin pin cho xe này");
                return ResponseEntity.status(404).body(response);
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
            List<Battery> batteries = batteryService.getAllBatteries(status, stationId, page, size);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", batteries);
            response.put("page", page);
            response.put("size", size);
            
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
            Battery battery = batteryService.getBatteryById(id);
            
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
            Battery createdBattery = batteryService.createBattery(battery);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Battery created successfully");
            response.put("data", createdBattery);
            
            return ResponseEntity.status(201).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
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
            Battery updatedBattery = batteryService.updateBattery(id, battery);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Battery updated successfully");
            response.put("data", updatedBattery);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
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
            batteryService.deleteBattery(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Battery deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (IllegalStateException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
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
            Map<String, Integer> stats = batteryService.getBatteryStatistics();
            
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
            
            Map<String, Object> resultData = batteryService.assignBatteryToSlot(batteryId, slotId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Battery assigned to slot successfully");
            response.put("data", resultData);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (IllegalStateException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
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
            Map<String, Object> resultData = batteryService.removeBatteryFromSlot(batteryId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Battery removed from slot successfully");
            response.put("data", resultData);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (IllegalStateException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error removing battery from slot: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

}
