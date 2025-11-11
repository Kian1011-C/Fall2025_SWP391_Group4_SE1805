package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.Station;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StationDao {

    public List<Station> getAllStations() {
        List<Station> list = new ArrayList<>();
        String sql = "SELECT * FROM Stations ORDER BY station_id";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Station s = createStationFromResultSet(rs);
                list.add(s);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public Station getStationById(int stationId) {
        String sql = "SELECT * FROM Stations WHERE station_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, stationId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return createStationFromResultSet(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // Tìm trạm gần nhất (giả sử có tọa độ latitude, longitude trong DB)
    public List<Station> getNearbyStations(double latitude, double longitude, int limit) {
        List<Station> list = new ArrayList<>();
        // Công thức tính khoảng cách đơn giản (có thể cải thiện bằng Haversine formula)
        String sql = "SELECT TOP (?) *, " +
                    "SQRT(POWER(latitude - ?, 2) + POWER(longitude - ?, 2)) as distance " +
                    "FROM Stations WHERE status='active' " +
                    "ORDER BY distance";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, limit);
            ps.setDouble(2, latitude);
            ps.setDouble(3, longitude);
            
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Station s = createStationFromResultSet(rs);
                list.add(s);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // Lấy trạm theo trạng thái
    public List<Station> getStationsByStatus(String status) {
        List<Station> list = new ArrayList<>();
        String sql = "SELECT * FROM Stations WHERE status=? ORDER BY station_id";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, status);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Station s = createStationFromResultSet(rs);
                list.add(s);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    // Tạo trạm mới
    public boolean createStation(Station station) {
        String sql = "INSERT INTO Stations (name, location, status, latitude, longitude) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, station.getName());
            ps.setString(2, station.getLocation());
            ps.setString(3, station.getStatus() != null ? station.getStatus() : "active");
            ps.setObject(4, station.getLatitude(), java.sql.Types.DOUBLE);
            ps.setObject(5, station.getLongitude(), java.sql.Types.DOUBLE);

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Cập nhật trạm
    public boolean updateStation(Station station) {
        String sql = "UPDATE Stations SET name=?, location=?, status=?, latitude=?, longitude=? WHERE station_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, station.getName());
            ps.setString(2, station.getLocation());
            ps.setString(3, station.getStatus());
            ps.setObject(4, station.getLatitude(), java.sql.Types.DOUBLE);
            ps.setObject(5, station.getLongitude(), java.sql.Types.DOUBLE);
            ps.setInt(6, station.getStationId());

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Xóa trạm (soft delete)
    public boolean deleteStation(int stationId) {
        String sql = "UPDATE Stations SET status='inactive' WHERE station_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, stationId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Thống kê trạm với thêm thông tin chi tiết
    public Map<String, Object> getStationStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Thống kê theo trạng thái
        String statusSql = "SELECT status, COUNT(*) as count FROM Stations GROUP BY status";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(statusSql)) {

            ResultSet rs = ps.executeQuery();
            Map<String, Integer> statusCount = new HashMap<>();
            while (rs.next()) {
                statusCount.put(rs.getString("status"), rs.getInt("count"));
            }
            stats.put("byStatus", statusCount);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Tổng số trạm
        String totalSql = "SELECT COUNT(*) as total FROM Stations";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(totalSql)) {

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                stats.put("total", rs.getInt("total"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return stats;
    }

    // Lấy thông tin chi tiết của trạm (slots, towers, batteries)
    public Map<String, Object> getStationDetails(int stationId) {
        Map<String, Object> details = new HashMap<>();
        
        // Đếm towers
        String towerSql = "SELECT COUNT(*) as tower_count FROM Towers WHERE station_id = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(towerSql)) {
            ps.setInt(1, stationId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                details.put("totalTowers", rs.getInt("tower_count"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Đếm slots theo trạng thái
        String slotSql = """
            SELECT sl.status, COUNT(*) as count 
            FROM Slots sl 
            INNER JOIN Towers t ON sl.tower_id = t.tower_id 
            WHERE t.station_id = ? 
            GROUP BY sl.status
        """;
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(slotSql)) {
            ps.setInt(1, stationId);
            ResultSet rs = ps.executeQuery();
            
            int totalSlots = 0;
            int fullSlots = 0;
            int chargingSlots = 0;
            int emptySlots = 0;
            
            while (rs.next()) {
                String status = rs.getString("status");
                int count = rs.getInt("count");
                totalSlots += count;
                
                switch (status) {
                    case "full": fullSlots = count; break;
                    case "charging": chargingSlots = count; break;
                    case "empty": emptySlots = count; break;
                }
            }
            
            details.put("totalSlots", totalSlots);
            details.put("availableSlots", fullSlots);
            details.put("chargingSlots", chargingSlots);
            details.put("emptySlots", emptySlots);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Đếm batteries theo trạng thái tại station này
        String batterySql = """
            SELECT b.status, COUNT(*) as count
            FROM Batteries b
            INNER JOIN Slots sl ON b.slot_id = sl.slot_id
            INNER JOIN Towers t ON sl.tower_id = t.tower_id
            WHERE t.station_id = ?
            GROUP BY b.status
        """;
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(batterySql)) {
            ps.setInt(1, stationId);
            ResultSet rs = ps.executeQuery();
            
            int totalBatteries = 0;
            int availableBatteries = 0;
            int chargingBatteries = 0;
            
            while (rs.next()) {
                String status = rs.getString("status");
                int count = rs.getInt("count");
                totalBatteries += count;
                
                if ("available".equals(status)) {
                    availableBatteries = count;
                } else if ("charging".equals(status)) {
                    chargingBatteries = count;
                }
            }
            
            details.put("totalBatteries", totalBatteries);
            details.put("availableBatteries", availableBatteries);
            details.put("chargingBatteries", chargingBatteries);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Đếm số swap hôm nay
        String swapSql = """
            SELECT COUNT(*) as today_swaps 
            FROM Swaps 
            WHERE station_id = ? AND CAST(swap_time AS DATE) = CAST(GETDATE() AS DATE)
        """;
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(swapSql)) {
            ps.setInt(1, stationId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                details.put("todayTransactions", rs.getInt("today_swaps"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return details;
    }

    // Helper method để tạo Station object từ ResultSet
    private Station createStationFromResultSet(ResultSet rs) throws Exception {
        Station s = new Station();
        s.setStationId(rs.getInt("station_id"));
        s.setName(rs.getString("name"));
        s.setLocation(rs.getString("location"));
        s.setStatus(rs.getString("status"));
        
        // Kiểm tra xem có cột latitude, longitude không
        try {
            s.setLatitude(rs.getDouble("latitude"));
            s.setLongitude(rs.getDouble("longitude"));
        } catch (Exception ignored) {
            // Nếu không có cột này thì bỏ qua
        }
        
        return s;
    }
}
