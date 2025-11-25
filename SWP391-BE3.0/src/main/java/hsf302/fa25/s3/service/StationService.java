package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Station;
import java.util.List;
import java.util.Map;

public interface StationService {
    
    // Station retrieval operations
    List<Map<String, Object>> getAllStations(String status, String search);
    Map<String, Object> getStationById(Long id);
    Map<String, Object> getStationStatistics();
    
    // Station CRUD operations
    Station createStation(Station station);
    Station updateStation(int stationId, Station station);
    boolean deleteStation(int stationId);
    
    // Tower management
    List<Map<String, Object>> getStationTowers(int stationId);
    int addTowerToStation(int stationId, int numberOfSlots);
    boolean updateTower(int towerId, String status);
    boolean deleteTower(int towerId);
    Map<String, Object> getTowerById(int towerId);
}
