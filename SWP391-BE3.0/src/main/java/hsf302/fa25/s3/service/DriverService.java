package hsf302.fa25.s3.service;

import java.util.List;
import java.util.Map;

public interface DriverService {
    List<Map<String, Object>> getTowersByStation(int stationId);
    List<Map<String, Object>> getSlotsByTower(int towerId);
    Map<String, Object> getOneEmptySlot(int towerId);
}
