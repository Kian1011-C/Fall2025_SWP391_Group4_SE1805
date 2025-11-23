package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.utils.ConnectDB;
import hsf302.fa25.s3.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService service;
    @GetMapping("/overview")
    public ResponseEntity<?> getOverviewReport(@RequestParam(required = false) String dateRange) {
        try {
            Map<String, Object> overviewData = new HashMap<>();
            
            try (Connection conn = ConnectDB.getConnection()) {
                // Get total users
                int totalUsers = executeCountQuery(conn, "SELECT COUNT(*) FROM Users");
                int activeUsers = executeCountQuery(conn, "SELECT COUNT(*) FROM Users WHERE status = 'active'");
                
                // Get total stations
                int totalStations = executeCountQuery(conn, "SELECT COUNT(*) FROM Stations");
                
                // Get total batteries
                int totalBatteries = executeCountQuery(conn, "SELECT COUNT(*) FROM Batteries");
                int activeBatteries = executeCountQuery(conn, "SELECT COUNT(*) FROM Batteries WHERE status = 'AVAILABLE'");
                
                // Get total swaps
                int totalSwaps = executeCountQuery(conn, "SELECT COUNT(*) FROM Swaps");
                
                // Get total transactions (payments)
                int totalTransactions = executeCountQuery(conn, "SELECT COUNT(*) FROM Payments");
                
                // Calculate monthly revenue (sum of all payments)
                double monthlyRevenue = executeSumQuery(conn, "SELECT ISNULL(SUM(amount), 0) FROM Payments WHERE status = 'SUCCESS'");
                
                overviewData.put("totalUsers", totalUsers);
                overviewData.put("totalStations", totalStations);
                overviewData.put("totalBatteries", totalBatteries);
                overviewData.put("activeBatteries", activeBatteries);
                overviewData.put("totalSwaps", totalSwaps);
                overviewData.put("activeUsers", activeUsers);
                overviewData.put("revenue", monthlyRevenue);
                overviewData.put("monthlyRevenue", monthlyRevenue);
                overviewData.put("totalTransactions", totalTransactions);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", overviewData);
            response.put("message", "Lấy báo cáo tổng quan thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy báo cáo tổng quan: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueReport(@RequestParam(required = false) String dateRange) {
        try {
            Map<String, Object> revenueData = new HashMap<>();
            
            try (Connection conn = ConnectDB.getConnection()) {
                double monthlyRevenue = executeSumQuery(conn, "SELECT ISNULL(SUM(amount), 0) FROM Payments WHERE status = 'SUCCESS'");
                double dailyRevenue = monthlyRevenue / 30;
                double yearlyRevenue = monthlyRevenue * 12;
                int totalTransactions = executeCountQuery(conn, "SELECT COUNT(*) FROM Payments");
                
                revenueData.put("monthly", monthlyRevenue);
                revenueData.put("daily", dailyRevenue);
                revenueData.put("yearly", yearlyRevenue);
                revenueData.put("totalTransactions", totalTransactions);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", revenueData);
            response.put("message", "Lấy báo cáo doanh thu thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy báo cáo doanh thu: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/usage")
    public ResponseEntity<?> getUsageReport(@RequestParam(required = false) String dateRange) {
        try {
            Map<String, Object> usageData = new HashMap<>();
            
            try (Connection conn = ConnectDB.getConnection()) {
                int totalSwaps = executeCountQuery(conn, "SELECT COUNT(*) FROM Swaps");
                int activeBatteries = executeCountQuery(conn, "SELECT COUNT(*) FROM Batteries WHERE status = 'AVAILABLE'");
                int totalStations = executeCountQuery(conn, "SELECT COUNT(*) FROM Stations");
                
                double averageSwapsPerDay = (double) totalSwaps / 30;
                
                usageData.put("totalSwaps", totalSwaps);
                usageData.put("monthlySwaps", totalSwaps);
                usageData.put("averageSwapsPerDay", Math.round(averageSwapsPerDay * 100.0) / 100.0);
                usageData.put("activeBatteries", activeBatteries);
                usageData.put("totalStations", totalStations);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", usageData);
            response.put("message", "Lấy báo cáo sử dụng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy báo cáo sử dụng: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/customers")
    public ResponseEntity<?> getCustomerReport(@RequestParam(required = false) String dateRange) {
        try {
            Map<String, Object> customerData = new HashMap<>();
            
            try (Connection conn = ConnectDB.getConnection()) {
                int totalUsers = executeCountQuery(conn, "SELECT COUNT(*) FROM Users");
                int activeUsers = executeCountQuery(conn, "SELECT COUNT(*) FROM Users WHERE status = 'active'");
                int newUsersThisMonth = totalUsers / 10; // Mock: 10% are new users
                double retentionRate = totalUsers > 0 ? (double) activeUsers / totalUsers * 100.0 : 0.0;
                
                customerData.put("totalCustomers", totalUsers);
                customerData.put("activeCustomers", activeUsers);
                customerData.put("newCustomersThisMonth", newUsersThisMonth);
                customerData.put("customerRetentionRate", Math.round(retentionRate * 100.0) / 100.0);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", customerData);
            response.put("message", "Lấy báo cáo khách hàng thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy báo cáo khách hàng: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @PostMapping("/export")
    public ResponseEntity<?> exportReport(@RequestBody Map<String, Object> exportRequest) {
        try {
            String reportType = (String) exportRequest.get("reportType");
            String format = (String) exportRequest.get("format");
            
            // Mock export functionality
            Map<String, Object> exportResult = new HashMap<>();
            exportResult.put("fileName", reportType + "_report_" + System.currentTimeMillis() + "." + format);
            exportResult.put("downloadUrl", "/downloads/" + exportResult.get("fileName"));
            exportResult.put("fileSize", "1.2 MB");
            exportResult.put("exportedAt", new Date());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", exportResult);
            response.put("message", "Xuất báo cáo thành công");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xuất báo cáo: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Helper methods to execute database queries
    private int executeCountQuery(Connection conn, String sql) {
        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }
    
    private double executeSumQuery(Connection conn, String sql) {
        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getDouble(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0.0;
    }

    //tong doanh thu
    @GetMapping("/revenue/total")
    public Map<String, Object> totalRevenue() {
        double total = service.getTotalRevenue();
        return Map.of(
                "success", true,
                "totalRevenue", total,
                "currency", "VND"
        );
    }

    /** (Tuỳ chọn) Tổng doanh thu theo khoảng ngày [from, to], format yyyy-MM-dd. */
    @GetMapping("/revenue/range")
    public Map<String, Object> revenueInRange(
            @RequestParam String from,
            @RequestParam String to
    ) {
        double total = service.getRevenueInRange(from, to);
        return Map.of(
                "success", true,
                "from", from,
                "to", to,
                "totalRevenue", total,
                "currency", "VND"
        );
    }
}