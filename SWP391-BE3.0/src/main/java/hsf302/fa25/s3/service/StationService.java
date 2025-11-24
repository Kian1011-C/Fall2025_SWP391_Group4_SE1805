package hsf302.fa25.s3.service;

import org.springframework.http.ResponseEntity;

public interface StationService {

    ResponseEntity<?> getStations(String status, String search);

    ResponseEntity<?> getStationById(Long id);

    ResponseEntity<?> getAllStationsStats();
}
