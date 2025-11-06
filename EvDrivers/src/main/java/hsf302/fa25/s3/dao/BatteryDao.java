package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.Battery;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BatteryDao {

    public List<Battery> getBatteriesBySlotId(int slotId) {
        List<Battery> list = new ArrayList<>();
        String sql = "SELECT * FROM Batteries WHERE slot_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, slotId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Battery b = new Battery();
                b.setBatteryId(rs.getInt("battery_id"));
                b.setModel(rs.getString("model"));
                b.setCapacity(rs.getInt("capacity"));
                b.setStateOfHealth(rs.getDouble("state_of_health"));
                b.setStatus(rs.getString("status"));
                // use getObject to preserve NULL -> null in Integer slotId
                Object slotObj = rs.getObject("slot_id");
                if (slotObj != null) b.setSlotId(((Number) slotObj).intValue());
                list.add(b);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // Lấy tất cả pin
    public List<Battery> getAllBatteries() {
        List<Battery> list = new ArrayList<>();
        String sql = "SELECT * FROM Batteries ORDER BY battery_id";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Battery b = createBatteryFromResultSet(rs);
                list.add(b);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // Lấy pin theo ID
    public Battery getBatteryById(int batteryId) {
        String sql = "SELECT * FROM Batteries WHERE battery_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, batteryId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return createBatteryFromResultSet(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // Lấy pin theo trạng thái
    public List<Battery> getBatteriesByStatus(String status) {
        List<Battery> list = new ArrayList<>();
        String sql = "SELECT * FROM Batteries WHERE status=? ORDER BY battery_id";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, status);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Battery b = createBatteryFromResultSet(rs);
                list.add(b);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // Cập nhật pin
    public boolean updateBattery(Battery battery) {
        String sql = "UPDATE Batteries SET model=?, capacity=?, state_of_health=?, status=?, slot_id=?, cycle_count=? WHERE battery_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, battery.getModel());
            ps.setInt(2, battery.getCapacity());
            ps.setDouble(3, battery.getStateOfHealth());
            ps.setString(4, battery.getStatus());
            ps.setObject(5, battery.getSlotId(), java.sql.Types.INTEGER);
            ps.setInt(6, battery.getCycleCount());
            ps.setInt(7, battery.getBatteryId());

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Tạo pin mới
    public boolean createBattery(Battery battery) {
        String sql = "INSERT INTO Batteries (model, capacity, state_of_health, status, slot_id, cycle_count) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, battery.getModel());
            ps.setInt(2, battery.getCapacity());
            ps.setDouble(3, battery.getStateOfHealth());
            ps.setString(4, battery.getStatus());
            ps.setObject(5, battery.getSlotId(), java.sql.Types.INTEGER);
            ps.setInt(6, battery.getCycleCount());

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Xóa pin
    public boolean deleteBattery(int batteryId) {
        String sql = "DELETE FROM Batteries WHERE battery_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, batteryId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Thống kê pin theo trạng thái
    public Map<String, Integer> getBatteryStatistics() {
        Map<String, Integer> stats = new HashMap<>();
        String sql = "SELECT status, COUNT(*) as count FROM Batteries GROUP BY status";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                stats.put(rs.getString("status"), rs.getInt("count"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return stats;
    }

    // Helper method để tạo Battery object từ ResultSet
    private Battery createBatteryFromResultSet(ResultSet rs) throws Exception {
        Battery b = new Battery();
        b.setBatteryId(rs.getInt("battery_id"));
        b.setModel(rs.getString("model"));
        b.setCapacity(rs.getInt("capacity"));
        b.setStateOfHealth(rs.getDouble("state_of_health"));
        b.setStatus(rs.getString("status"));
        b.setCycleCount(rs.getInt("cycle_count"));
        Object slotObj = rs.getObject("slot_id");
        if (slotObj != null) b.setSlotId(((Number) slotObj).intValue());
        return b;
    }
}
