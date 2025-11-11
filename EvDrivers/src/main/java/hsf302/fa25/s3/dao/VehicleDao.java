package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.model.VehicleBatteryInfo;
import hsf302.fa25.s3.context.ConnectDB;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class VehicleDao {

    // Lấy danh sách xe + thông tin pin theo userId
    public List<VehicleBatteryInfo> getVehiclesWithBatteryByUser(String userId) {
        List<VehicleBatteryInfo> list = new ArrayList<>();

        String sql = """
            SELECT 
                v.vehicle_id,
                v.plate_number,
                v.model AS vehicle_model,
                v.vin_number,
                v.battery_type,
                v.compatible_battery_types,
                v.current_battery_id AS battery_id,
                v.current_odometer,
                b.model AS battery_model,
                b.state_of_health AS health
            FROM Vehicles v
            LEFT JOIN Batteries b ON v.current_battery_id = b.battery_id
            WHERE v.user_id = ?
            ORDER BY v.vehicle_id DESC
        """;

        System.out.println("🔍 VehicleDao: Starting query for userId = " + userId);
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            System.out.println("🔍 VehicleDao: Executing SQL with userId = " + userId);
            
            ResultSet rs = ps.executeQuery();
            int count = 0;

            while (rs.next()) {
                count++;
                System.out.println("🔍 VehicleDao: Processing vehicle " + count + " - ID: " + rs.getInt("vehicle_id"));
                
                VehicleBatteryInfo v = new VehicleBatteryInfo();
                v.setVehicleId(rs.getInt("vehicle_id"));
                v.setPlateNumber(rs.getString("plate_number"));
                v.setVehicleModel(rs.getString("vehicle_model"));
                v.setVinNumber(rs.getString("vin_number"));
                v.setBatteryType(rs.getString("battery_type"));
                v.setCompatibleBatteryTypes(rs.getString("compatible_battery_types"));
                v.setCreatedAt(null); // No created_at column in Vehicles table
                v.setBatteryId(rs.getInt("battery_id")); // current_battery_id từ database
                v.setBatteryModel(rs.getString("battery_model"));
                v.setHealth(rs.getDouble("health"));
                v.setCurrentOdometer(rs.getDouble("current_odometer")); // 🔥 Thêm dòng này

                list.add(v);
                System.out.println("✅ VehicleDao: Added vehicle: " + v.getPlateNumber());
            }
            
            System.out.println("🔍 VehicleDao: Total vehicles found: " + count);

        } catch (SQLException e) {
            System.err.println("❌ VehicleDao: SQL Exception - " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("🔍 VehicleDao: Returning " + list.size() + " vehicles");
        return list;
    }
}
