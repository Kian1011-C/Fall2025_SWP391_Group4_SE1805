package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Slot;
import hsf302.fa25.s3.model.Tower;
import hsf302.fa25.s3.repository.SlotRepo;
import hsf302.fa25.s3.repository.TowerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final TowerRepo towerRepo;
    private final SlotRepo slotRepo;

    @Override
    public List<Map<String, Object>> getTowersByStation(int stationId) {
        List<Tower> towers = towerRepo.getTowersByStationId(stationId);

        List<Map<String, Object>> towerMaps = new ArrayList<>();
        for (Tower tower : towers) {
            Map<String, Object> towerMap = new HashMap<>();
            towerMap.put("id", tower.getTowerId());
            towerMap.put("towerNumber", tower.getTowerNumber());
            towerMap.put("status", tower.getStatus());

            // Get available slots for this tower
            List<Slot> slots = slotRepo.getSlotsByTowerId(tower.getTowerId());
            int availableSlots = 0;
            for (Slot slot : slots) {
                if ("available".equals(slot.getStatus()) || "full".equals(slot.getStatus())) {
                    availableSlots++;
                }
            }
            towerMap.put("availableSlots", availableSlots);
            towerMap.put("totalSlots", slots.size());

            towerMaps.add(towerMap);
        }
        return towerMaps;
    }

    @Override
    public List<Map<String, Object>> getSlotsByTower(int towerId) {
        List<Slot> slots = slotRepo.getSlotsByTowerId(towerId);

        List<Map<String, Object>> slotMaps = new ArrayList<>();
        for (Slot slot : slots) {
            Map<String, Object> slotMap = new HashMap<>();
            slotMap.put("id", slot.getSlotId());
            slotMap.put("slotNumber", slot.getSlotNumber());
            slotMap.put("status", slot.getStatus());

            // Lấy thông tin pin trong slot này (nếu có)
            Map<String, Object> batteryInfo = slotRepo.getBatteryInfoBySlotId(slot.getSlotId());
            if (batteryInfo != null) {
                slotMap.put("batteryId", batteryInfo.get("battery_id"));
                slotMap.put("batteryLevel", batteryInfo.get("state_of_health"));
                slotMap.put("batteryModel", batteryInfo.get("model"));
                slotMap.put("batteryStatus", batteryInfo.get("battery_status"));
            } else {
                slotMap.put("batteryId", null);
                slotMap.put("batteryLevel", null);
                slotMap.put("batteryModel", null);
                slotMap.put("batteryStatus", null);
            }

            slotMaps.add(slotMap);
        }
        return slotMaps;
    }

    @Override
    public Map<String, Object> getOneEmptySlot(int towerId) {
        Slot slot = slotRepo.getOneEmptySlotInTower(towerId);
        if (slot == null) return null;

        Map<String, Object> slotMap = new HashMap<>();
        slotMap.put("id", slot.getSlotId());
        slotMap.put("slotNumber", slot.getSlotNumber());
        slotMap.put("status", slot.getStatus());

        // Thêm thông tin pin trong slot (nếu có)
        Map<String, Object> batteryInfo = slotRepo.getBatteryInfoBySlotId(slot.getSlotId());
        if (batteryInfo != null) {
            slotMap.put("batteryId", batteryInfo.get("battery_id"));
            try {
                double soh = ((Number) batteryInfo.get("state_of_health")).doubleValue();
                int percentDrop = new Random().nextInt(16); // 0–15%
                double displayed = soh - (soh * percentDrop / 100.0);
                double rounded = BigDecimal
                        .valueOf(displayed)
                        .setScale(2, RoundingMode.HALF_UP)
                        .doubleValue();
                slotMap.put("batteryLevel", rounded);
            } catch (Exception ex) {
                slotMap.put("batteryLevel", batteryInfo.get("state_of_health"));
            }
            slotMap.put("batteryModel", batteryInfo.get("model"));
            slotMap.put("batteryStatus", batteryInfo.get("battery_status"));
        } else {
            slotMap.put("batteryId", null);
        }

        return slotMap;
    }
}
