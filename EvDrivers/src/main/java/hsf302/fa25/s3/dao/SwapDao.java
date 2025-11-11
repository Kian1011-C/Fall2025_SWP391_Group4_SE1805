package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.Swap;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SwapDao {

    // Lấy tất cả swap
    public List<Swap> getAllSwaps() {
        List<Swap> list = new ArrayList<>();
        String sql = "SELECT * FROM Swaps ORDER BY swap_id DESC";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Swap swap = createSwapFromResultSet(rs);
                list.add(swap);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // Lấy swap theo ID
    public Swap getSwapById(int swapId) {
        String sql = "SELECT * FROM Swaps WHERE swap_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, swapId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return createSwapFromResultSet(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // Lấy danh sách swap của 1 user (qua hợp đồng của xe)
    public List<Swap> getSwapsByUserId(String userId) {
        List<Swap> list = new ArrayList<>();
        String sql = "SELECT s.* FROM Swaps s " +
                "JOIN Contracts c ON s.contract_id = c.contract_id " +
                "JOIN Vehicles v ON c.vehicle_id = v.vehicle_id " +
                "WHERE v.user_id=? ORDER BY s.swap_id DESC";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Swap swap = createSwapFromResultSet(rs);
                list.add(swap);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // Lấy swap theo station ID
    public List<Swap> getSwapsByStationId(int stationId) {
        List<Swap> list = new ArrayList<>();
        String sql = "SELECT * FROM Swaps WHERE station_id=? ORDER BY swap_id DESC";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, stationId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Swap swap = createSwapFromResultSet(rs);
                list.add(swap);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // Tạo swap mới
    public boolean createSwap(Swap swap) {
        String sql = "INSERT INTO Swaps (contract_id, station_id, tower_id, staff_id, old_battery_id, new_battery_id, odometer_before, odometer_after, swap_status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, swap.getContractId());
            ps.setInt(2, swap.getStationId());
            ps.setInt(3, swap.getTowerId());
            ps.setInt(4, swap.getStaffId());
            ps.setObject(5, swap.getOldBatteryId() != 0 ? swap.getOldBatteryId() : null);
            ps.setObject(6, swap.getNewBatteryId() != 0 ? swap.getNewBatteryId() : null);
            ps.setDouble(7, swap.getOdometerBefore());
            ps.setDouble(8, swap.getOdometerAfter());
            ps.setString(9, swap.getSwapStatus());
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    // Cập nhật trạng thái swap
    public boolean updateSwapStatus(int swapId, String status) {
        String sql = "UPDATE Swaps SET swap_status=? WHERE swap_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, status);
            ps.setInt(2, swapId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Hoàn thành swap
    public boolean completeSwap(int swapId) {
        String sql = "UPDATE Swaps SET swap_status='COMPLETED', completed_time=GETDATE() WHERE swap_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, swapId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Lấy swap gần đây
    public List<Swap> getRecentSwaps(int limit) {
        List<Swap> list = new ArrayList<>();
        String sql = "SELECT TOP (?) * FROM Swaps ORDER BY swap_id DESC";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, limit);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Swap swap = createSwapFromResultSet(rs);
                list.add(swap);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // Lấy lịch sử swap của 1 battery
    public List<Map<String, Object>> getBatterySwapHistory(int batteryId) {
        List<Map<String, Object>> history = new ArrayList<>();
        String sql = """
            SELECT s.*, 
                   st.name as station_name,
                   CONCAT(u.first_name, ' ', u.last_name) as user_name,
                   c.vehicle_id
            FROM Swaps s
            LEFT JOIN Stations st ON s.station_id = st.station_id
            LEFT JOIN Contracts c ON s.contract_id = c.contract_id
            LEFT JOIN Vehicles v ON c.vehicle_id = v.vehicle_id
            LEFT JOIN Users u ON v.user_id = u.user_id
            WHERE s.old_battery_id = ? OR s.new_battery_id = ?
            ORDER BY s.swap_id DESC
        """;
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, batteryId);
            ps.setInt(2, batteryId);
            
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Map<String, Object> swap = new HashMap<>();
                swap.put("swapId", rs.getInt("swap_id"));
                swap.put("stationId", rs.getInt("station_id"));
                swap.put("stationName", rs.getString("station_name"));
                swap.put("userName", rs.getString("user_name"));
                swap.put("vehicleId", rs.getInt("vehicle_id"));
                swap.put("oldBatteryId", rs.getObject("old_battery_id"));
                swap.put("newBatteryId", rs.getObject("new_battery_id"));
                swap.put("odometerBefore", rs.getDouble("odometer_before"));
                swap.put("odometerAfter", rs.getDouble("odometer_after"));
                swap.put("swapStatus", rs.getString("status")); // Fix column name
                swap.put("swapDate", rs.getTimestamp("swap_date")); // Fix column name
                
                // Xác định role của battery trong swap này
                if (rs.getObject("old_battery_id") != null && rs.getInt("old_battery_id") == batteryId) {
                    swap.put("batteryRole", "REMOVED");
                } else if (rs.getObject("new_battery_id") != null && rs.getInt("new_battery_id") == batteryId) {
                    swap.put("batteryRole", "INSTALLED");
                }
                
                history.add(swap);
            }
        } catch (Exception e) {
            System.err.println("Error in getBatterySwapHistory for batteryId: " + batteryId);
            e.printStackTrace();
        }
        return history;
    }

    // Thống kê swap
    public Map<String, Object> getSwapStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Thống kê theo trạng thái
        String statusSql = "SELECT swap_status, COUNT(*) as count FROM Swaps GROUP BY swap_status";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(statusSql)) {

            ResultSet rs = ps.executeQuery();
            Map<String, Integer> statusCount = new HashMap<>();
            while (rs.next()) {
                statusCount.put(rs.getString("swap_status"), rs.getInt("count"));
            }
            stats.put("byStatus", statusCount);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Tổng số swap
        String totalSql = "SELECT COUNT(*) as total FROM Swaps";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(totalSql)) {

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                stats.put("total", rs.getInt("total"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Swap trong tháng này
        String monthlySql = "SELECT COUNT(*) as monthly FROM Swaps WHERE MONTH(created_time) = MONTH(GETDATE()) AND YEAR(created_time) = YEAR(GETDATE())";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(monthlySql)) {

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                stats.put("monthly", rs.getInt("monthly"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return stats;
    }

    // Helper method để tạo Swap object từ ResultSet
    private Swap createSwapFromResultSet(ResultSet rs) throws Exception {
        Swap swap = new Swap();
        swap.setSwapId(rs.getInt("swap_id"));
        swap.setContractId(rs.getInt("contract_id"));
        swap.setStationId(rs.getInt("station_id"));
        swap.setTowerId(rs.getInt("tower_id"));
        swap.setStaffId(rs.getInt("staff_id"));
        swap.setOldBatteryId(rs.getInt("old_battery_id"));
        swap.setNewBatteryId(rs.getInt("new_battery_id"));
        swap.setOdometerBefore(rs.getDouble("odometer_before"));
        swap.setOdometerAfter(rs.getDouble("odometer_after"));
        swap.setSwapStatus(rs.getString("swap_status"));
        
        // Có thể thêm timestamp fields nếu cần trong tương lai
        
        return swap;
    }

    // Lấy active swaps (INITIATED hoặc IN_PROGRESS)
    public List<Map<String, Object>> getActiveSwaps(String userId) {
        List<Map<String, Object>> activeSwaps = new ArrayList<>();
        String sql = """
            SELECT s.*, st.name as station_name, 
                   sl.slot_number, t.tower_number
            FROM Swaps s
            INNER JOIN Stations st ON s.station_id = st.station_id
            LEFT JOIN Batteries b ON s.new_battery_id = b.battery_id
            LEFT JOIN Slots sl ON b.slot_id = sl.slot_id
            LEFT JOIN Towers t ON sl.tower_id = t.tower_id
            WHERE s.status IN ('INITIATED', 'IN_PROGRESS')
        """;
        
        if (userId != null) {
            sql += " AND s.user_id = ?";
        }
        
        sql += " ORDER BY s.swap_date DESC";
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            if (userId != null) {
                ps.setString(1, userId);
            }
            
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Map<String, Object> swap = new HashMap<>();
                swap.put("swapId", rs.getLong("swap_id"));
                swap.put("userId", rs.getString("user_id"));
                swap.put("stationId", rs.getLong("station_id"));
                swap.put("stationName", rs.getString("station_name"));
                swap.put("status", rs.getString("status"));
                swap.put("initiatedAt", rs.getTimestamp("swap_date"));
                swap.put("oldBatteryId", rs.getObject("old_battery_id"));
                swap.put("newBatteryId", rs.getLong("new_battery_id"));
                
                if (rs.getObject("slot_number") != null) {
                    swap.put("slotNumber", rs.getInt("slot_number"));
                }
                if (rs.getObject("tower_number") != null) {
                    swap.put("towerNumber", rs.getInt("tower_number"));
                }
                
                // Estimate completion time (5-10 minutes from initiation)
                long initiatedTime = rs.getTimestamp("swap_date").getTime();
                swap.put("estimatedCompletion", new java.util.Date(initiatedTime + 300000)); // 5 minutes
                
                activeSwaps.add(swap);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return activeSwaps;
    }
}
