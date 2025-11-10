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

    // Tìm trạm gần nhất (tạm thời trả về tất cả active stations - có thể cải thiện sau)
    public List<Station> getNearbyStations(double latitude, double longitude, int limit) {
        List<Station> list = new ArrayList<>();
        String sql = "SELECT TOP (?) * FROM Stations WHERE status='active' ORDER BY station_id";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, limit);
            
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

    // Tạo trạm mới (trả về station_id)
    public int createStation(Station station) {
        String sql = "INSERT INTO Stations (name, location, status) VALUES (?, ?, ?)";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, station.getName());
            ps.setString(2, station.getLocation());
            ps.setString(3, station.getStatus() != null ? station.getStatus() : "active");

            int affected = ps.executeUpdate();
            if (affected > 0) {
                ResultSet generatedKeys = ps.getGeneratedKeys();
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                }
            }
            return -1;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    // Tạo tower mới (trả về tower_id)
    public int createTower(int stationId, int towerNumber) {
        String sql = "INSERT INTO Towers (station_id, tower_number, status) VALUES (?, ?, 'active')";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, stationId);
            ps.setInt(2, towerNumber);

            int affected = ps.executeUpdate();
            if (affected > 0) {
                ResultSet generatedKeys = ps.getGeneratedKeys();
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                }
            }
            return -1;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    // Tạo slot mới
    public boolean createSlot(int towerId, int slotNumber) {
        String sql = "INSERT INTO Slots (tower_id, slot_number, status) VALUES (?, ?, 'empty')";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, towerId);
            ps.setInt(2, slotNumber);

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Tạo station với tower và slots tự động
    public int createStationWithTower(Station station, int numberOfSlots) {
        try {
            // Tạo station trước
            int stationId = createStation(station);
            if (stationId <= 0) {
                return -1;
            }

            // Tạo 1 tower mặc định
            int towerId = createTower(stationId, 1);
            if (towerId <= 0) {
                return -1;
            }

            // Tạo slots cho tower (mặc định 8 slots)
            int slots = numberOfSlots > 0 ? numberOfSlots : 8;
            for (int i = 1; i <= slots; i++) {
                createSlot(towerId, i);
            }

            return stationId;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    // Thêm tower mới vào station có sẵn
    public int addTowerToStation(int stationId, int numberOfSlots) {
        try {
            // Lấy số tower hiện tại để tạo tower_number mới
            String sql = "SELECT MAX(tower_number) as max_tower FROM Towers WHERE station_id = ?";
            int nextTowerNumber = 1;
            
            try (Connection conn = ConnectDB.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, stationId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    nextTowerNumber = rs.getInt("max_tower") + 1;
                }
            }

            // Tạo tower mới
            int towerId = createTower(stationId, nextTowerNumber);
            if (towerId <= 0) {
                return -1;
            }

            // Tạo slots cho tower (mặc định 8 slots)
            int slots = numberOfSlots > 0 ? numberOfSlots : 8;
            for (int i = 1; i <= slots; i++) {
                createSlot(towerId, i);
            }

            return towerId;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    // Lấy danh sách towers của một station
    public List<Map<String, Object>> getTowersByStation(int stationId) {
        List<Map<String, Object>> towers = new ArrayList<>();
        String sql = """
            SELECT t.tower_id, t.tower_number, t.status,
                   COUNT(sl.slot_id) as total_slots,
                   SUM(CASE WHEN sl.status = 'full' THEN 1 ELSE 0 END) as full_slots,
                   SUM(CASE WHEN sl.status = 'charging' THEN 1 ELSE 0 END) as charging_slots,
                   SUM(CASE WHEN sl.status = 'empty' THEN 1 ELSE 0 END) as empty_slots
            FROM Towers t
            LEFT JOIN Slots sl ON t.tower_id = sl.tower_id
            WHERE t.station_id = ?
            GROUP BY t.tower_id, t.tower_number, t.status
            ORDER BY t.tower_number
        """;
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, stationId);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                Map<String, Object> tower = new HashMap<>();
                tower.put("towerId", rs.getInt("tower_id"));
                tower.put("towerNumber", rs.getInt("tower_number"));
                tower.put("status", rs.getString("status"));
                tower.put("totalSlots", rs.getInt("total_slots"));
                tower.put("fullSlots", rs.getInt("full_slots"));
                tower.put("chargingSlots", rs.getInt("charging_slots"));
                tower.put("emptySlots", rs.getInt("empty_slots"));
                towers.add(tower);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return towers;
    }

    // Cập nhật tower
    public boolean updateTower(int towerId, String status) {
        String sql = "UPDATE Towers SET status = ? WHERE tower_id = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, status);
            ps.setInt(2, towerId);

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Xóa tower (hard delete - xóa cả slots và batteries liên quan)
    public boolean deleteTower(int towerId) {
        try (Connection conn = ConnectDB.getConnection()) {
            // Bắt đầu transaction
            conn.setAutoCommit(false);
            
            try {
                // 1. Xóa batteries trong các slots của tower này
                String deleteBatteriesSql = """
                    DELETE FROM Batteries 
                    WHERE slot_id IN (
                        SELECT slot_id FROM Slots WHERE tower_id = ?
                    )
                """;
                try (PreparedStatement ps = conn.prepareStatement(deleteBatteriesSql)) {
                    ps.setInt(1, towerId);
                    ps.executeUpdate();
                }
                
                // 2. Xóa slots của tower
                String deleteSlotsSql = "DELETE FROM Slots WHERE tower_id = ?";
                try (PreparedStatement ps = conn.prepareStatement(deleteSlotsSql)) {
                    ps.setInt(1, towerId);
                    ps.executeUpdate();
                }
                
                // 3. Xóa tower
                String deleteTowerSql = "DELETE FROM Towers WHERE tower_id = ?";
                try (PreparedStatement ps = conn.prepareStatement(deleteTowerSql)) {
                    ps.setInt(1, towerId);
                    ps.executeUpdate();
                }
                
                conn.commit();
                return true;
            } catch (Exception e) {
                conn.rollback();
                e.printStackTrace();
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Lấy thông tin tower theo ID
    public Map<String, Object> getTowerById(int towerId) {
        String sql = """
            SELECT t.tower_id, t.station_id, t.tower_number, t.status,
                   COUNT(sl.slot_id) as total_slots,
                   SUM(CASE WHEN sl.status = 'full' THEN 1 ELSE 0 END) as full_slots,
                   SUM(CASE WHEN sl.status = 'charging' THEN 1 ELSE 0 END) as charging_slots,
                   SUM(CASE WHEN sl.status = 'empty' THEN 1 ELSE 0 END) as empty_slots
            FROM Towers t
            LEFT JOIN Slots sl ON t.tower_id = sl.tower_id
            WHERE t.tower_id = ?
            GROUP BY t.tower_id, t.station_id, t.tower_number, t.status
        """;
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, towerId);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                Map<String, Object> tower = new HashMap<>();
                tower.put("towerId", rs.getInt("tower_id"));
                tower.put("stationId", rs.getInt("station_id"));
                tower.put("towerNumber", rs.getInt("tower_number"));
                tower.put("status", rs.getString("status"));
                tower.put("totalSlots", rs.getInt("total_slots"));
                tower.put("fullSlots", rs.getInt("full_slots"));
                tower.put("chargingSlots", rs.getInt("charging_slots"));
                tower.put("emptySlots", rs.getInt("empty_slots"));
                return tower;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return null;
    }

    // Cập nhật trạm
    public boolean updateStation(Station station) {
        String sql = "UPDATE Stations SET name=?, location=?, status=? WHERE station_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, station.getName());
            ps.setString(2, station.getLocation());
            ps.setString(3, station.getStatus());
            ps.setInt(4, station.getStationId());

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Xóa trạm (soft delete)
    // Xóa trạm (soft delete - set status = maintenance)
    public boolean deleteStation(int stationId) {
        String sql = "UPDATE Stations SET status='maintenance' WHERE station_id=?";
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
            WHERE station_id = ? AND CAST(swap_date AS DATE) = CAST(GETDATE() AS DATE)
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
        
        return s;
    }
}
