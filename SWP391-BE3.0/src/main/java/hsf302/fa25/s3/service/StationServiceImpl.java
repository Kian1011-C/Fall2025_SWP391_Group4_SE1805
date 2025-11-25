package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Station;
import hsf302.fa25.s3.repository.StationRepo;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StationServiceImpl implements StationService {

    private final StationRepo stationRepo;

    public StationServiceImpl() {
        this.stationRepo = new StationRepo();
    }

    @Override
    public List<Map<String, Object>> getAllStations(String status, String search) {
        List<Station> stations;
        
        if (status != null && !status.isEmpty()) {
            stations = stationRepo.getStationsByStatus(status);
        } else {
            stations = stationRepo.getAllStations();
        }
        
        List<Map<String, Object>> stationMaps = new ArrayList<>();
        for (Station station : stations) {
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
            
            Map<String, Object> details = stationRepo.getStationDetails(station.getStationId());
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
        
        return stationMaps;
    }

    @Override
    public Map<String, Object> getStationById(Long id) {
        Station station = stationRepo.getStationById(id.intValue());
        
        if (station == null) {
            return null;
        }
        
        Map<String, Object> stationMap = new HashMap<>();
        stationMap.put("stationId", station.getStationId());
        stationMap.put("id", station.getStationId());
        stationMap.put("name", station.getName());
        stationMap.put("location", station.getLocation());
        stationMap.put("address", station.getLocation());
        stationMap.put("status", station.getStatus());
        
        Map<String, Object> details = stationRepo.getStationDetails(station.getStationId());
        stationMap.put("totalTowers", details.getOrDefault("totalTowers", 0));
        stationMap.put("totalSlots", details.getOrDefault("totalSlots", 0));
        stationMap.put("availableSlots", details.getOrDefault("availableSlots", 0));
        stationMap.put("chargingSlots", details.getOrDefault("chargingSlots", 0));
        stationMap.put("emptySlots", details.getOrDefault("emptySlots", 0));
        stationMap.put("totalBatteries", details.getOrDefault("totalBatteries", 0));
        stationMap.put("availableBatteries", details.getOrDefault("availableBatteries", 0));
        stationMap.put("chargingBatteries", details.getOrDefault("chargingBatteries", 0));
        stationMap.put("todayTransactions", details.getOrDefault("todayTransactions", 0));
        
        List<Map<String, Object>> towers = stationRepo.getTowersByStation(station.getStationId());
        stationMap.put("towers", towers);
        
        return stationMap;
    }

    @Override
    public Map<String, Object> getStationStatistics() {
        return stationRepo.getStationStatistics();
    }

    @Override
    public Station createStation(Station station) {
        if (station.getName() == null || station.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Station name is required");
        }

        if (station.getLocation() == null || station.getLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Station location is required");
        }

        if (station.getStatus() == null || station.getStatus().isEmpty()) {
            station.setStatus("active");
        }

        int stationId = stationRepo.createStationWithTower(station, 8);

        if (stationId > 0) {
            return stationRepo.getStationById(stationId);
        } else {
            throw new RuntimeException("Failed to create station");
        }
    }

    @Override
    public Station updateStation(int stationId, Station station) {
        Station existing = stationRepo.getStationById(stationId);
        if (existing == null) {
            throw new IllegalArgumentException("Station not found");
        }

        station.setStationId(stationId);
        if (station.getName() == null) station.setName(existing.getName());
        if (station.getLocation() == null) station.setLocation(existing.getLocation());
        if (station.getStatus() == null) station.setStatus(existing.getStatus());

        boolean updated = stationRepo.updateStation(station);

        if (updated) {
            return stationRepo.getStationById(stationId);
        } else {
            throw new RuntimeException("Failed to update station");
        }
    }

    @Override
    public boolean deleteStation(int stationId) {
        Station existing = stationRepo.getStationById(stationId);
        if (existing == null) {
            throw new IllegalArgumentException("Station not found");
        }

        return stationRepo.deleteStation(stationId);
    }

    @Override
    public List<Map<String, Object>> getStationTowers(int stationId) {
        Station station = stationRepo.getStationById(stationId);
        if (station == null) {
            throw new IllegalArgumentException("Station not found");
        }

        return stationRepo.getTowersByStation(stationId);
    }

    @Override
    public int addTowerToStation(int stationId, int numberOfSlots) {
        Station station = stationRepo.getStationById(stationId);
        if (station == null) {
            throw new IllegalArgumentException("Station not found");
        }

        int towerId = stationRepo.addTowerToStation(stationId, numberOfSlots);
        if (towerId <= 0) {
            throw new RuntimeException("Failed to add tower");
        }
        
        return towerId;
    }

    @Override
    public boolean updateTower(int towerId, String status) {
        if (status == null || status.isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }

        boolean updated = stationRepo.updateTower(towerId, status);
        if (!updated) {
            throw new RuntimeException("Failed to update tower");
        }
        
        return true;
    }

    @Override
    public boolean deleteTower(int towerId) {
        Map<String, Object> tower = stationRepo.getTowerById(towerId);
        if (tower == null) {
            throw new IllegalArgumentException("Tower not found");
        }

        int fullSlots = (int) tower.getOrDefault("fullSlots", 0);
        int chargingSlots = (int) tower.getOrDefault("chargingSlots", 0);
        
        if (fullSlots > 0 || chargingSlots > 0) {
            throw new IllegalStateException("Cannot delete tower with batteries. Please remove all batteries first.");
        }

        boolean deleted = stationRepo.deleteTower(towerId);
        if (!deleted) {
            throw new RuntimeException("Failed to delete tower");
        }
        
        return true;
    }

    @Override
    public Map<String, Object> getTowerById(int towerId) {
        return stationRepo.getTowerById(towerId);
    }
}
