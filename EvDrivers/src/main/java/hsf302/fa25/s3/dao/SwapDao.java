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
        String sql = "INSERT INTO Swaps (user_id, contract_id, vehicle_id, station_id, tower_id, staff_id, old_battery_id, new_battery_id, odometer_before, odometer_after, status, swap_date) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE())";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            if (swap.getUserId() != null) ps.setString(1, swap.getUserId()); else ps.setNull(1, java.sql.Types.VARCHAR);
            if (swap.getContractId() != null) ps.setInt(2, swap.getContractId()); else ps.setNull(2, java.sql.Types.INTEGER);
            if (swap.getVehicleId() != null) ps.setInt(3, swap.getVehicleId()); else ps.setNull(3, java.sql.Types.INTEGER);
            if (swap.getStationId() != null) ps.setInt(4, swap.getStationId()); else ps.setNull(4, java.sql.Types.INTEGER);
            if (swap.getTowerId() != null) ps.setInt(5, swap.getTowerId()); else ps.setNull(5, java.sql.Types.INTEGER);
            if (swap.getStaffId() != null) ps.setString(6, swap.getStaffId()); else ps.setNull(6, java.sql.Types.VARCHAR);
            if (swap.getOldBatteryId() != null) ps.setInt(7, swap.getOldBatteryId()); else ps.setNull(7, java.sql.Types.INTEGER);
            if (swap.getNewBatteryId() != null) ps.setInt(8, swap.getNewBatteryId()); else ps.setNull(8, java.sql.Types.INTEGER);
            if (swap.getOdometerBefore() != null) ps.setDouble(9, swap.getOdometerBefore()); else ps.setNull(9, java.sql.Types.DOUBLE);
            if (swap.getOdometerAfter() != null) ps.setDouble(10, swap.getOdometerAfter()); else ps.setNull(10, java.sql.Types.DOUBLE);
            ps.setString(11, swap.getSwapStatus() != null ? swap.getSwapStatus() : "INITIATED");

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    // Cập nhật trạng thái swap
    public boolean updateSwapStatus(int swapId, String status) {
        String sql = "UPDATE Swaps SET status=? WHERE swap_id=?";
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
        Connection conn = null;
        try {
            conn = ConnectDB.getConnection();
            conn.setAutoCommit(false);

            // Read swap row and contextual ids
            String selectSwap = "SELECT vehicle_id, old_battery_id, new_battery_id, station_id, tower_id FROM Swaps WHERE swap_id = ?";
            Integer vehicleId = null, oldBatteryId = null, newBatteryId = null, stationId = null, towerId = null;
            try (PreparedStatement psSel = conn.prepareStatement(selectSwap)) {
                psSel.setInt(1, swapId);
                try (ResultSet rs = psSel.executeQuery()) {
                    if (rs.next()) {
                        Object vObj = rs.getObject("vehicle_id"); if (vObj != null) vehicleId = ((Number) vObj).intValue();
                        Object ob = rs.getObject("old_battery_id"); if (ob != null) oldBatteryId = ((Number) ob).intValue();
                        Object nb = rs.getObject("new_battery_id"); if (nb != null) newBatteryId = ((Number) nb).intValue();
                        Object st = rs.getObject("station_id"); if (st != null) stationId = ((Number) st).intValue();
                        Object tw = rs.getObject("tower_id"); if (tw != null) towerId = ((Number) tw).intValue();
                    } else {
                        conn.rollback();
                        return false;
                    }
                }
            }

            // find where new battery currently sits
            Integer targetSlotId = null;
            if (newBatteryId != null) {
                String selSlot = "SELECT slot_id FROM Batteries WHERE battery_id = ?";
                try (PreparedStatement psSlot = conn.prepareStatement(selSlot)) {
                    psSlot.setInt(1, newBatteryId);
                    try (ResultSet rs = psSlot.executeQuery()) {
                        if (rs.next()) {
                            Object sObj = rs.getObject("slot_id"); if (sObj != null) targetSlotId = ((Number) sObj).intValue();
                        }
                    }
                }
            }

            // find empty slot to place old battery first (prefer tower -> station -> any)
            Integer placementSlotId = null;
            if (towerId != null) {
                String selEmptyInTower = "SELECT TOP 1 slot_id FROM Slots WHERE tower_id = ? AND status = 'empty' ORDER BY slot_number";
                try (PreparedStatement ps = conn.prepareStatement(selEmptyInTower)) {
                    ps.setInt(1, towerId);
                    try (ResultSet rs = ps.executeQuery()) { if (rs.next()) placementSlotId = rs.getInt("slot_id"); }
                }
            }
            if (placementSlotId == null && stationId != null) {
                String selEmptyInStation = "SELECT TOP 1 s.slot_id FROM Slots s JOIN Towers t ON s.tower_id = t.tower_id WHERE t.station_id = ? AND s.status = 'empty' ORDER BY s.slot_number";
                try (PreparedStatement ps = conn.prepareStatement(selEmptyInStation)) {
                    ps.setInt(1, stationId);
                    try (ResultSet rs = ps.executeQuery()) { if (rs.next()) placementSlotId = rs.getInt("slot_id"); }
                }
            }
            if (placementSlotId == null) {
                String selAnyEmpty = "SELECT TOP 1 slot_id FROM Slots WHERE status = 'empty' ORDER BY slot_id";
                try (PreparedStatement ps = conn.prepareStatement(selAnyEmpty)) {
                    try (ResultSet rs = ps.executeQuery()) { if (rs.next()) placementSlotId = rs.getInt("slot_id"); }
                }
            }

            // 1) place old battery into placementSlotId first (if possible)
            if (oldBatteryId != null && placementSlotId != null) {
                String updOldBat = "UPDATE Batteries SET slot_id = ?, status = ? WHERE battery_id = ?";
                try (PreparedStatement psOld = conn.prepareStatement(updOldBat)) {
                    psOld.setInt(1, placementSlotId);
                    psOld.setString(2, "charging");
                    psOld.setInt(3, oldBatteryId);
                    psOld.executeUpdate();
                }
                String updSlot = "UPDATE Slots SET status = ? WHERE slot_id = ?";
                try (PreparedStatement psSlot = conn.prepareStatement(updSlot)) {
                    psSlot.setString(1, "charging");
                    psSlot.setInt(2, placementSlotId);
                    psSlot.executeUpdate();
                }
            }

            // 2) remove new battery from its slot (if it had one)
            if (newBatteryId != null && targetSlotId != null) {
                String updNewBat = "UPDATE Batteries SET slot_id = NULL, status = ? WHERE battery_id = ?";
                try (PreparedStatement psNew = conn.prepareStatement(updNewBat)) {
                    psNew.setString(1, "in_use");
                    psNew.setInt(2, newBatteryId);
                    psNew.executeUpdate();
                }
                // mark the old slot empty unless we just placed old battery into the same slot
                if (placementSlotId == null || !placementSlotId.equals(targetSlotId)) {
                    String updOldSlot = "UPDATE Slots SET status = ? WHERE slot_id = ?";
                    try (PreparedStatement psOldSlot = conn.prepareStatement(updOldSlot)) {
                        psOldSlot.setString(1, "empty");
                        psOldSlot.setInt(2, targetSlotId);
                        psOldSlot.executeUpdate();
                    }
                }
            } else if (newBatteryId != null) {
                String updNewBat = "UPDATE Batteries SET status = ? WHERE battery_id = ?";
                try (PreparedStatement psNew = conn.prepareStatement(updNewBat)) {
                    psNew.setString(1, "in_use");
                    psNew.setInt(2, newBatteryId);
                    psNew.executeUpdate();
                }
            }

            // 3) update vehicle
            if (vehicleId != null && newBatteryId != null) {
                String updVeh = "UPDATE Vehicles SET current_battery_id = ? WHERE vehicle_id = ?";
                try (PreparedStatement psVeh = conn.prepareStatement(updVeh)) {
                    psVeh.setInt(1, newBatteryId);
                    psVeh.setInt(2, vehicleId);
                    psVeh.executeUpdate();
                }
            }

            // 4) update swap status
            String updSwap = "UPDATE Swaps SET status='COMPLETED', swap_date=GETDATE() WHERE swap_id=?";
            try (PreparedStatement psUpd = conn.prepareStatement(updSwap)) {
                psUpd.setInt(1, swapId);
                psUpd.executeUpdate();
            }

            conn.commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            try { if (conn != null) conn.rollback(); } catch (Exception ex) { ex.printStackTrace(); }
            return false;
        } finally {
            try { if (conn != null) conn.setAutoCommit(true); if (conn != null) conn.close(); } catch (Exception ignore) {}
        }
    }

    // Lấy swap gần đây
    public List<Swap> getRecentSwaps(int limit) {
        List<Swap> list = new ArrayList<>();
        String sql = "SELECT * FROM Swaps ORDER BY swap_id DESC OFFSET 0 ROWS FETCH NEXT ? ROWS ONLY";
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
                swap.put("swapStatus", rs.getString("status"));
                swap.put("swapDate", rs.getTimestamp("swap_date"));
                
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
        String statusSql = "SELECT status, COUNT(*) as count FROM Swaps GROUP BY status";
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

        // Swap trong tháng này (use swap_date for both month and year)
        String monthlySql = "SELECT COUNT(*) as monthly FROM Swaps WHERE MONTH(swap_date) = MONTH(GETDATE()) AND YEAR(swap_date) = YEAR(GETDATE())";
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
        // swap_id
        Object swapIdObj = rs.getObject("swap_id");
        if (swapIdObj != null) swap.setSwapId(((Number) swapIdObj).intValue());

        // user_id
        try { swap.setUserId(rs.getString("user_id")); } catch (Exception ignore) { swap.setUserId(null); }

        // contract_id
        Object contractObj = rs.getObject("contract_id");
        if (contractObj != null) swap.setContractId(((Number) contractObj).intValue());

        // vehicle_id
        try {
            Object vObj = rs.getObject("vehicle_id");
            if (vObj != null) swap.setVehicleId(((Number) vObj).intValue());
        } catch (Exception ignore) {}

        // station/tower
        Object stationObj = rs.getObject("station_id");
        if (stationObj != null) swap.setStationId(((Number) stationObj).intValue());
        Object towerObj = rs.getObject("tower_id");
        if (towerObj != null) swap.setTowerId(((Number) towerObj).intValue());

        // staff_id
        try { swap.setStaffId(rs.getString("staff_id")); } catch (Exception ex) {
            try { int staffInt = rs.getInt("staff_id"); swap.setStaffId(String.valueOf(staffInt)); } catch (Exception ignore) { swap.setStaffId(null); }
        }

        // old/new batteries
        Object oldObj = rs.getObject("old_battery_id");
        if (oldObj != null) swap.setOldBatteryId(((Number) oldObj).intValue());
        Object newObj = rs.getObject("new_battery_id");
        if (newObj != null) swap.setNewBatteryId(((Number) newObj).intValue());

        // odometers
        Object odoBefore = rs.getObject("odometer_before");
        if (odoBefore != null) swap.setOdometerBefore(((Number) odoBefore).doubleValue());
        Object odoAfter = rs.getObject("odometer_after");
        if (odoAfter != null) swap.setOdometerAfter(((Number) odoAfter).doubleValue());

        swap.setSwapStatus(rs.getString("status"));

        // swap_date
        try { java.sql.Timestamp ts = rs.getTimestamp("swap_date"); if (ts != null) swap.setSwapDate(ts); } catch (Exception ignore) {}

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

    // Tạo swap tự động (không cần staff_id). Thêm swap_date = GETDATE() và trạng thái mặc định 'AUTO'.
    // Sử dụng khi hệ thống tự tạo swap (ví dụ: theo lịch hoặc khi detect cần đổi pin),
    // staff_id sẽ để NULL trong DB.
    public boolean createAutoSwap(Swap swap) {
        // include user_id and vehicle_id where available; swap_date is set to GETDATE()
        String sql = "INSERT INTO Swaps (user_id, contract_id, vehicle_id, station_id, tower_id, old_battery_id, new_battery_id, odometer_before, odometer_after, status, swap_date) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE())";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            if (swap.getUserId() != null) {
                ps.setString(1, swap.getUserId());
            } else {
                ps.setNull(1, java.sql.Types.VARCHAR);
            }

            if (swap.getContractId() != null) ps.setInt(2, swap.getContractId());
            else ps.setNull(2, java.sql.Types.INTEGER);

            if (swap.getVehicleId() != null) ps.setInt(3, swap.getVehicleId());
            else ps.setNull(3, java.sql.Types.INTEGER);

            if (swap.getStationId() != null) ps.setInt(4, swap.getStationId()); else ps.setNull(4, java.sql.Types.INTEGER);
            if (swap.getTowerId() != null) ps.setInt(5, swap.getTowerId()); else ps.setNull(5, java.sql.Types.INTEGER);

            if (swap.getOldBatteryId() != null) ps.setInt(6, swap.getOldBatteryId()); else ps.setNull(6, java.sql.Types.INTEGER);
            if (swap.getNewBatteryId() != null) ps.setInt(7, swap.getNewBatteryId()); else ps.setNull(7, java.sql.Types.INTEGER);

            if (swap.getOdometerBefore() != null) ps.setDouble(8, swap.getOdometerBefore()); else ps.setNull(8, java.sql.Types.DOUBLE);
            if (swap.getOdometerAfter() != null) ps.setDouble(9, swap.getOdometerAfter()); else ps.setNull(9, java.sql.Types.DOUBLE);

            ps.setString(10, swap.getSwapStatus() != null ? swap.getSwapStatus() : "AUTO");

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
