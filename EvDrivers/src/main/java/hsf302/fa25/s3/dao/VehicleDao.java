package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.VehicleBatteryInfo;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class VehicleDao {

    // ========================== ĐĂNG KÝ XE TỐI GIẢN ==========================

    /** Kiểm tra biển số đã tồn tại */
    public boolean existsByPlate(String plateNumber) {
        String sql = "SELECT 1 FROM Vehicles WHERE plate_number = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, plateNumber);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            System.err.println("❌ VehicleDao.existsByPlate error: " + e.getMessage());
            return false;
        }
    }

    /** Kiểm tra VIN đã tồn tại */
    public boolean existsByVin(String vinNumber) {
        String sql = "SELECT 1 FROM Vehicles WHERE vin_number = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, vinNumber);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            System.err.println("❌ VehicleDao.existsByVin error: " + e.getMessage());
            return false;
        }
    }

    /**
     * Đăng ký xe (chỉ 3 trường: plate_number, model, vin_number)
     * Các trường khác để NULL / 0.
     */
    public boolean createVehicleMinimal(String userId, String plateNumber, String model, String vinNumber) {
        final String sql = """
            INSERT INTO Vehicles (user_id, plate_number, model, vin_number,
                                  battery_type, compatible_battery_types,
                                  current_battery_id, current_odometer)
            VALUES (?, ?, ?, ?, NULL, NULL, NULL, 0)
        """;
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            ps.setString(2, plateNumber);
            ps.setString(3, model);
            ps.setString(4, vinNumber);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("❌ VehicleDao.createVehicleMinimal error: " + e.getMessage());
            return false;
        }
    }

    // ========================== LẤY DANH SÁCH / CHI TIẾT ==========================

    public List<VehicleBatteryInfo> getVehiclesWithBatteryByUser(String userId) {
        List<VehicleBatteryInfo> list = new ArrayList<>();
        String sql = """
            SELECT v.vehicle_id, v.plate_number, v.model AS vehicle_model,
                   v.vin_number, v.battery_type, v.compatible_battery_types,
                   v.current_battery_id AS battery_id, v.current_odometer,
                   b.model AS battery_model, b.state_of_health AS health
            FROM Vehicles v
            LEFT JOIN Batteries b ON v.current_battery_id = b.battery_id
            WHERE v.user_id = ?
            ORDER BY v.vehicle_id DESC
        """;
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                VehicleBatteryInfo v = new VehicleBatteryInfo();
                v.setVehicleId(rs.getInt("vehicle_id"));
                v.setUserId(userId);
                v.setPlateNumber(rs.getString("plate_number"));
                v.setVehicleModel(rs.getString("vehicle_model"));
                v.setVinNumber(rs.getString("vin_number"));
                v.setBatteryType(rs.getString("battery_type"));
                v.setCompatibleBatteryTypes(rs.getString("compatible_battery_types"));
                v.setBatteryId(rs.getObject("battery_id", Integer.class));
                v.setBatteryModel(rs.getString("battery_model"));
                v.setHealth(rs.getDouble("health"));
                v.setCurrentOdometer(rs.getDouble("current_odometer"));
                list.add(v);
            }

        } catch (SQLException e) {
            System.err.println("❌ VehicleDao.getVehiclesWithBatteryByUser error: " + e.getMessage());
        }
        return list;
    }

    public List<VehicleBatteryInfo> getAllVehicles() {
        List<VehicleBatteryInfo> list = new ArrayList<>();
        String sql = """
            SELECT v.vehicle_id, v.user_id, v.plate_number, v.model AS vehicle_model,
                   v.vin_number, v.battery_type, v.compatible_battery_types,
                   v.current_battery_id AS battery_id, v.current_odometer,
                   b.model AS battery_model, b.state_of_health AS health
            FROM Vehicles v
            LEFT JOIN Batteries b ON v.current_battery_id = b.battery_id
            ORDER BY v.vehicle_id DESC
        """;
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                VehicleBatteryInfo v = new VehicleBatteryInfo();
                v.setVehicleId(rs.getInt("vehicle_id"));
                v.setUserId(rs.getString("user_id"));
                v.setPlateNumber(rs.getString("plate_number"));
                v.setVehicleModel(rs.getString("vehicle_model"));
                v.setVinNumber(rs.getString("vin_number"));
                v.setBatteryType(rs.getString("battery_type"));
                v.setCompatibleBatteryTypes(rs.getString("compatible_battery_types"));
                v.setBatteryId(rs.getObject("battery_id", Integer.class));
                v.setBatteryModel(rs.getString("battery_model"));
                v.setHealth(rs.getDouble("health"));
                v.setCurrentOdometer(rs.getDouble("current_odometer"));
                list.add(v);
            }
        } catch (SQLException e) {
            System.err.println("❌ VehicleDao.getAllVehicles error: " + e.getMessage());
        }
        return list;
    }

    public VehicleBatteryInfo getVehicleById(int vehicleId) {
        String sql = """
            SELECT v.vehicle_id, v.user_id, v.plate_number, v.model AS vehicle_model,
                   v.vin_number, v.battery_type, v.compatible_battery_types,
                   v.current_battery_id AS battery_id, v.current_odometer,
                   b.model AS battery_model, b.state_of_health AS health
            FROM Vehicles v
            LEFT JOIN Batteries b ON v.current_battery_id = b.battery_id
            WHERE v.vehicle_id = ?
        """;
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, vehicleId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                VehicleBatteryInfo v = new VehicleBatteryInfo();
                v.setVehicleId(rs.getInt("vehicle_id"));
                v.setUserId(rs.getString("user_id"));
                v.setPlateNumber(rs.getString("plate_number"));
                v.setVehicleModel(rs.getString("vehicle_model"));
                v.setVinNumber(rs.getString("vin_number"));
                v.setBatteryType(rs.getString("battery_type"));
                v.setCompatibleBatteryTypes(rs.getString("compatible_battery_types"));
                v.setBatteryId(rs.getObject("battery_id", Integer.class));
                v.setBatteryModel(rs.getString("battery_model"));
                v.setHealth(rs.getDouble("health"));
                v.setCurrentOdometer(rs.getDouble("current_odometer"));
                return v;
            }
        } catch (SQLException e) {
            System.err.println("❌ VehicleDao.getVehicleById error: " + e.getMessage());
        }
        return null;
    }

    // ========================== CẬP NHẬT / XOÁ / TÌM KIẾM ==========================

    public boolean updateVehicle(VehicleBatteryInfo vehicle) {
        String sql = """
            UPDATE Vehicles SET 
                user_id=?, plate_number=?, model=?, vin_number=?, 
                battery_type=?, compatible_battery_types=?, 
                current_battery_id=?, current_odometer=? 
            WHERE vehicle_id=?
        """;
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, vehicle.getUserId());
            ps.setString(2, vehicle.getPlateNumber());
            ps.setString(3, vehicle.getVehicleModel());
            ps.setString(4, vehicle.getVinNumber());
            ps.setString(5, vehicle.getBatteryType());
            ps.setString(6, vehicle.getCompatibleBatteryTypes());

            if (vehicle.getBatteryId() != null && vehicle.getBatteryId() > 0)
                ps.setInt(7, vehicle.getBatteryId());
            else
                ps.setNull(7, Types.INTEGER);

            ps.setDouble(8, vehicle.getCurrentOdometer() != null ? vehicle.getCurrentOdometer() : 0.0);
            ps.setInt(9, vehicle.getVehicleId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("❌ VehicleDao.updateVehicle error: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteVehicle(int vehicleId) {
        String sql = "DELETE FROM Vehicles WHERE vehicle_id = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, vehicleId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("❌ VehicleDao.deleteVehicle error: " + e.getMessage());
            return false;
        }
    }

    public List<VehicleBatteryInfo> getVehiclesByPlateNumber(String plateNumber) {
        List<VehicleBatteryInfo> list = new ArrayList<>();
        String sql = """
            SELECT v.vehicle_id, v.user_id, v.plate_number, v.model AS vehicle_model,
                   v.vin_number, v.battery_type, v.compatible_battery_types,
                   v.current_battery_id AS battery_id, v.current_odometer,
                   b.model AS battery_model, b.state_of_health AS health
            FROM Vehicles v
            LEFT JOIN Batteries b ON v.current_battery_id = b.battery_id
            WHERE v.plate_number LIKE ?
            ORDER BY v.vehicle_id DESC
        """;
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, "%" + plateNumber + "%");
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                VehicleBatteryInfo v = new VehicleBatteryInfo();
                v.setVehicleId(rs.getInt("vehicle_id"));
                v.setUserId(rs.getString("user_id"));
                v.setPlateNumber(rs.getString("plate_number"));
                v.setVehicleModel(rs.getString("vehicle_model"));
                v.setVinNumber(rs.getString("vin_number"));
                v.setBatteryType(rs.getString("battery_type"));
                v.setCompatibleBatteryTypes(rs.getString("compatible_battery_types"));
                v.setBatteryId(rs.getObject("battery_id", Integer.class));
                v.setBatteryModel(rs.getString("battery_model"));
                v.setHealth(rs.getDouble("health"));
                v.setCurrentOdometer(rs.getDouble("current_odometer"));
                list.add(v);
            }
        } catch (SQLException e) {
            System.err.println("❌ VehicleDao.getVehiclesByPlateNumber error: " + e.getMessage());
        }
        return list;
    }
}
