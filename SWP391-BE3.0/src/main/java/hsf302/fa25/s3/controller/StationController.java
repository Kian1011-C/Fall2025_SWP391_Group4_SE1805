package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.repository.StationRepo;
import hsf302.fa25.s3.model.Station;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/stations")
public class StationController {
    
    private final StationRepo stationDao = new StationRepo();

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
                // Apply search filter if provided
                if (search != null && !search.isEmpty()) {
                    if (!station.getName().toLowerCase().contains(search.toLowerCase()) &&
                        !station.getLocation().toLowerCase().contains(search.toLowerCase())) {
                        continue;
                    }
                }
                
                Map<String, Object> stationMap = new HashMap<>();
                stationMap.put("stationId", station.getStationId());
                stationMap.put("id", station.getStationId());
                stationMap.put("name", station.getName());
                stationMap.put("location", station.getLocation());
                stationMap.put("address", station.getLocation());
                stationMap.put("status", station.getStatus());
                
                // Lấy thông tin chi tiết từ database
                Map<String, Object> details = stationDao.getStationDetails(station.getStationId());
                stationMap.put("totalTowers", details.getOrDefault("totalTowers", 0));
                stationMap.put("totalSlots", details.getOrDefault("totalSlots", 0));
                stationMap.put("availableSlots", details.getOrDefault("availableSlots", 0));
                stationMap.put("chargingSlots", details.getOrDefault("chargingSlots", 0));
                stationMap.put("emptySlots", details.getOrDefault("emptySlots", 0));
                stationMap.put("totalBatteries", details.getOrDefault("totalBatteries", 0));
                stationMap.put("availableBatteries", details.getOrDefault("availableBatteries", 0));
                stationMap.put("chargingBatteries", details.getOrDefault("chargingBatteries", 0));
                stationMap.put("todayTransactions", details.getOrDefault("todayTransactions", 0));
                
                stationMaps.add(stationMap);
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
                stationMap.put("stationId", station.getStationId());
                stationMap.put("id", station.getStationId());
                stationMap.put("name", station.getName());
                stationMap.put("location", station.getLocation());
                stationMap.put("address", station.getLocation());
                stationMap.put("status", station.getStatus());
                
                // Lấy thông tin chi tiết từ database
                Map<String, Object> details = stationDao.getStationDetails(station.getStationId());
                stationMap.put("totalTowers", details.getOrDefault("totalTowers", 0));
                stationMap.put("totalSlots", details.getOrDefault("totalSlots", 0));
                stationMap.put("availableSlots", details.getOrDefault("availableSlots", 0));
                stationMap.put("chargingSlots", details.getOrDefault("chargingSlots", 0));
                stationMap.put("emptySlots", details.getOrDefault("emptySlots", 0));
                stationMap.put("totalBatteries", details.getOrDefault("totalBatteries", 0));
                stationMap.put("availableBatteries", details.getOrDefault("availableBatteries", 0));
                stationMap.put("chargingBatteries", details.getOrDefault("chargingBatteries", 0));
                stationMap.put("todayTransactions", details.getOrDefault("todayTransactions", 0));
                
                // Lấy danh sách towers
                List<Map<String, Object>> towers = stationDao.getTowersByStation(station.getStationId());
                stationMap.put("towers", towers);
                
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
