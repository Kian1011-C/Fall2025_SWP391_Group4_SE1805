package hsf302.fa25.s3.repository;

import hsf302.fa25.s3.utils.ConnectDB;
import hsf302.fa25.s3.model.Issue;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class IssueRepo {

    public boolean insert(String userId, int stationId, String description) {
        String sql = "INSERT INTO Issues (user_id, station_id, description, status, created_at) " +
                "VALUES (?, ?, ?, 'open', GETDATE())";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, userId);
            ps.setInt(2, stationId);
            ps.setString(3, description);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("IssueDao.insert err: " + e.getMessage());
            return false;
        }
    }

    /** Driver: chỉ xem của mình; Staff/Admin: xem tất cả */
    public List<Issue> listByVisibility(String role, String userIdIfDriver) {
        String base = "SELECT issue_id, user_id, station_id, description, status, created_at FROM Issues ";
        String order = " ORDER BY issue_id DESC";

        boolean isStaffOrAdmin = "Staff".equalsIgnoreCase(role) || "Admin".equalsIgnoreCase(role);
        String sql = isStaffOrAdmin ? (base + order) : (base + " WHERE user_id = ? " + order);

        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            if (!isStaffOrAdmin) {
                ps.setString(1, userIdIfDriver);
            }
            try (ResultSet rs = ps.executeQuery()) {
                List<Issue> items = new ArrayList<>();
                while (rs.next()) items.add(map(rs));
                return items;
            }
        } catch (SQLException e) {
            System.err.println("IssueDao.listByVisibility err: " + e.getMessage());
            return List.of();
        }
    }

    private Issue map(ResultSet rs) throws SQLException {
        return Issue.builder()
                .issueId(rs.getInt("issue_id"))
                .userId(rs.getString("user_id"))
                .stationId(rs.getInt("station_id"))
                .description(rs.getString("description"))
                .status(rs.getString("status"))
                .createdAt(rs.getTimestamp("created_at"))
                .build();
    }
}