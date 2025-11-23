package hsf302.fa25.s3.repository;

import hsf302.fa25.s3.model.UserDashboard;
import hsf302.fa25.s3.utils.ConnectDB;
import java.sql.*;

public class UserDashboardRepo {

    private final Connection con;

    public UserDashboardRepo() throws SQLException, ClassNotFoundException {
        this.con = ConnectDB.getConnection();
    }

    public UserDashboard getDashboardByUserId(String userId) throws SQLException {
        String sql = """
        SELECT 
            u.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.role,
            v.plate_number,
            v.model AS vehicle_model,
            c.contract_number,
            c.status AS contract_status,
            c.start_date AS contract_start_date,
            c.end_date AS contract_end_date,
            b.model AS battery_model,
            b.state_of_health AS battery_health,
            b.status AS battery_status,
            -- Tính tổng số lần đổi pin thành công
            (SELECT COUNT(*) FROM Swaps s2 
             JOIN Contracts c2 ON s2.contract_id = c2.contract_id 
             JOIN Vehicles v2 ON c2.vehicle_id = v2.vehicle_id 
             WHERE v2.user_id = u.user_id AND s2.status = 'COMPLETED') AS total_swaps,
            -- Tính tổng quãng đường đã đi (từ tất cả xe của user)
            (SELECT ISNULL(SUM(v3.current_odometer), 0) FROM Vehicles v3 
             WHERE v3.user_id = u.user_id) AS total_distance
        FROM Users u
        LEFT JOIN Vehicles v ON u.user_id = v.user_id
        LEFT JOIN Contracts c ON v.vehicle_id = c.vehicle_id
        LEFT JOIN Swaps s ON c.contract_id = s.contract_id AND s.status = 'COMPLETED'
        LEFT JOIN Batteries b ON s.new_battery_id = b.battery_id
        WHERE u.user_id = ?
        """;

        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return UserDashboard.builder()
                        .userId(rs.getString("user_id"))
                        .firstName(rs.getString("first_name"))
                        .lastName(rs.getString("last_name"))
                        .email(rs.getString("email"))
                        .role(rs.getString("role"))
                        .vehiclePlate(rs.getString("plate_number"))
                        .vehicleModel(rs.getString("vehicle_model"))
                        .contractNumber(rs.getString("contract_number"))
                        .contractStatus(rs.getString("contract_status"))
                        .contractStartDate(rs.getTimestamp("contract_start_date"))
                        .contractEndDate(rs.getTimestamp("contract_end_date"))
                        .batteryModel(rs.getString("battery_model"))
                        .batteryHealth(rs.getDouble("battery_health"))
                        .batteryStatus(rs.getString("battery_status"))
                        .totalSwaps(rs.getInt("total_swaps"))
                        .totalDistance(rs.getDouble("total_distance"))
                        .build();
            }
        }
        return null;
    }
}
