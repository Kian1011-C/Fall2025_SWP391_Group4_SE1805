package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.Slot;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SlotDao {

    public List<Slot> getSlotsByTowerId(int towerId) {
        List<Slot> list = new ArrayList<>();
        String sql = "SELECT * FROM Slots WHERE tower_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, towerId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Slot s = new Slot();
                s.setSlotId(rs.getInt("slot_id"));
                s.setTowerId(rs.getInt("tower_id"));
                s.setSlotNumber(rs.getInt("slot_number"));
                s.setStatus(rs.getString("status"));
                list.add(s);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // Lấy thông tin pin trong slot
    public Map<String, Object> getBatteryInfoBySlotId(int slotId) {
        String sql = "SELECT b.battery_id, b.model, b.state_of_health, b.status as battery_status " +
                    "FROM Batteries b WHERE b.slot_id = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, slotId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Map<String, Object> batteryInfo = new HashMap<>();
                batteryInfo.put("battery_id", rs.getInt("battery_id"));
                batteryInfo.put("model", rs.getString("model"));
                batteryInfo.put("state_of_health", rs.getDouble("state_of_health"));
                batteryInfo.put("battery_status", rs.getString("battery_status"));
                return batteryInfo;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null; // Không có pin trong slot này
    }
}
