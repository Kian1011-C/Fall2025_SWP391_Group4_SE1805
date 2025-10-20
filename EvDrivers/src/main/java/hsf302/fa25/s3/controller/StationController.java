package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dao.StationDao;
import hsf302.fa25.s3.model.Station;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/stations")
@CrossOrigin(origins = "*")
public class StationController {
    
    private final StationDao stationDao = new StationDao();

    @GetMapping
    public ResponseEntity<?> getStations(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        
        try {
            List<Station> stations;
            
            if (status != null && !status.isEmpty()) {
                stations = stationDao.getStationsByStatus(status);
            } else {
                stations = stationDao.getAllStations();
            }
            
            List<Map<String, Object>> stationMaps = new ArrayList<>();
            for (Station station : stations) {
                Map<String, Object> stationMap = new HashMap<>();
                stationMap.put("id", station.getStationId());
                stationMap.put("name", station.getName());
                stationMap.put("address", station.getLocation());
                stationMap.put("status", "active".equals(station.getStatus()) ? "Hoạt động" : "Bảo trì");
                
                // Lấy thông tin chi tiết từ database
                Map<String, Object> details = stationDao.getStationDetails(station.getStationId());
                
                stationMap.put("totalSlots", details.getOrDefault("totalSlots", 0));
                stationMap.put("availableSlots", details.getOrDefault("availableSlots", 0));
                // Ensure availableSlots is the count of full batteries (ready to use)
                stationMap.put("available_slots", details.getOrDefault("availableSlots", 0));
                stationMap.put("chargingSlots", details.getOrDefault("chargingSlots", 0));
                stationMap.put("emptySlots", details.getOrDefault("emptySlots", 0));
                stationMap.put("todayTransactions", details.getOrDefault("todayTransactions", 0));
                stationMap.put("totalBatteries", details.getOrDefault("totalBatteries", 0));
                stationMap.put("availableBatteries", details.getOrDefault("availableBatteries", 0));
                stationMap.put("chargingBatteries", details.getOrDefault("chargingBatteries", 0));
                
                // Các field khác có thể hardcode tạm thời (sẽ cần thêm vào DB sau)
                stationMap.put("phone", "028-1234-567" + station.getStationId());
                stationMap.put("manager", "Manager " + station.getStationId());
                stationMap.put("capacity", details.getOrDefault("totalSlots", 0) + " slots");
                stationMap.put("maintenanceBatteries", 0);
                stationMap.put("lastMaintenance", "2024-01-10");
                stationMap.put("nextMaintenance", "2024-02-10");
                stationMap.put("operatingHours", "24/7");
                stationMap.put("pricePerSwap", 25000);
                stationMap.put("rating", 4.5);
                stationMap.put("services", Arrays.asList("Đổi pin", "Sạc nhanh", "Bảo trì"));
                stationMap.put("amenities", Arrays.asList("Parking", "Restroom"));
                stationMap.put("totalTransactions", ((Integer) details.getOrDefault("todayTransactions", 0)) * 30); // Estimate monthly
                
                // Apply search filter if provided
                if (search == null || search.isEmpty() ||
                    station.getName().toLowerCase().contains(search.toLowerCase()) ||
                    station.getLocation().toLowerCase().contains(search.toLowerCase())) {
                    stationMaps.add(stationMap);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stationMaps);
            response.put("total", stationMaps.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching stations: " + e.getMessage());
            response.put("data", new ArrayList<>());
            response.put("total", 0);
            
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStationById(@PathVariable Long id) {
        try {
            Station station = stationDao.getStationById(id.intValue());
            
            Map<String, Object> response = new HashMap<>();
            if (station != null) {
                Map<String, Object> stationMap = new HashMap<>();
                stationMap.put("id", station.getStationId());
                stationMap.put("name", station.getName());
                stationMap.put("address", station.getLocation());
                stationMap.put("status", "active".equals(station.getStatus()) ? "Hoạt động" : "Bảo trì");
                
                response.put("success", true);
                response.put("data", stationMap);
            } else {
                response.put("success", false);
                response.put("message", "Station not found");
                return ResponseEntity.status(404).body(response);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching station: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAllStationsStats() {
        try {
            Map<String, Object> statistics = stationDao.getStationStatistics();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", statistics);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
