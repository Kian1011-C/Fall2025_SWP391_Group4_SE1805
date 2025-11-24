package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.service.StationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class StationController {

    private final StationService stationService;

    @GetMapping
    public ResponseEntity<?> getStations(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return stationService.getStations(status, search);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStationById(@PathVariable Long id) {
        return stationService.getStationById(id);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAllStationsStats() {
        return stationService.getAllStationsStats();
    }
}
