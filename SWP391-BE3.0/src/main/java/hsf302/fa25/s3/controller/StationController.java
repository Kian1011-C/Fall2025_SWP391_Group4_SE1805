package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.service.StationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/stations")
public class StationController {
    
    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping
    public ResponseEntity<?> getStations(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        
        try {
            List<Map<String, Object>> stationMaps = stationService.getAllStations(status, search);
            
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
            Map<String, Object> stationMap = stationService.getStationById(id);
            
            Map<String, Object> response = new HashMap<>();
            if (stationMap != null) {
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
            Map<String, Object> statistics = stationService.getStationStatistics();
            
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
