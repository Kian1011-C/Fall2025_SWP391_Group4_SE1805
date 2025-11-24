package hsf302.fa25.s3.repository;

import hsf302.fa25.s3.utils.ConnectDB;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

@Repository
@Slf4j
public class ReportRepo {

    // ====================== COUNT HELPER ======================

    private int executeCount(String sql) {
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt(1) : 0;
        } catch (Exception e) {
            log.error("executeCount error, sql={}", sql, e);
            throw new RuntimeException("DB error executeCount", e);
        }
    }

    // Users
    public int countUsers() {
        return executeCount("SELECT COUNT(*) FROM Users");
    }

    public int countActiveUsers() {
        return executeCount("SELECT COUNT(*) FROM Users WHERE status = 'active'");
    }

    // Stations
    public int countStations() {
        return executeCount("SELECT COUNT(*) FROM Stations");
    }

    // Batteries
    public int countBatteries() {
        return executeCount("SELECT COUNT(*) FROM Batteries");
    }

    public int countActiveBatteries() {
        return executeCount("SELECT COUNT(*) FROM Batteries WHERE status = 'AVAILABLE'");
    }

    // Swaps
    public int countSwaps() {
        return executeCount("SELECT COUNT(*) FROM Swaps");
    }

    // Payments
    public int countPayments() {
        return executeCount("SELECT COUNT(*) FROM Payments");
    }

    // ====================== DOANH THU ======================

    /** Tổng doanh thu toàn hệ thống (chỉ tính status='success'). */
    public double getTotalRevenue() {
        final String sql = "SELECT ISNULL(SUM(amount),0) AS total FROM Payments WHERE status='success'";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getDouble("total") : 0.0;
        } catch (Exception e) {
            log.error("getTotalRevenue error", e);
            throw new RuntimeException("DB error getTotalRevenue", e);
        }
    }

    /** Tổng doanh thu trong khoảng thời gian [from, to] (bao trọn ngày 'to'). */
    public double getRevenueInRange(java.util.Date from, java.util.Date to) {
        final String paidAt = "COALESCE(vnp_pay_date, created_at)";
        final String sql = """
            SELECT ISNULL(SUM(amount),0) AS total
            FROM Payments
            WHERE status='success'
              AND %s >= ? AND %s < DATEADD(DAY,1,?)
            """.formatted(paidAt, paidAt);

        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setTimestamp(1, new Timestamp(from.getTime()));
            ps.setTimestamp(2, new Timestamp(to.getTime()));
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getDouble("total") : 0.0;
            }
        } catch (Exception e) {
            log.error("getRevenueInRange error", e);
            throw new RuntimeException("DB error getRevenueInRange", e);
        }
    }
}
