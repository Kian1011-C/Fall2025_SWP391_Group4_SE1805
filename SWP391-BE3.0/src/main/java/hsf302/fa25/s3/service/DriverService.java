package hsf302.fa25.s3.service;

import java.util.List;
import java.util.Map;

public interface DriverService {

    /** Lấy danh sách trụ + availableSlots/totalSlots theo station */
    List<Map<String, Object>> getTowersByStation(int stationId);

    /** Lấy danh sách slot + thông tin pin theo tower */
    List<Map<String, Object>> getSlotsByTower(int towerId);

    /** Lấy 1 slot trống (kèm info pin nếu có), null nếu không có */
    Map<String, Object> getOneEmptySlot(int towerId);
}
