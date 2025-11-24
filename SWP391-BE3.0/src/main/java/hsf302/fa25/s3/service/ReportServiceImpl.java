package hsf302.fa25.s3.service;

import hsf302.fa25.s3.repository.ReportRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepo reportRepo;

    @Override
    public Map<String, Object> getOverviewReport(String dateRange) {
        Map<String, Object> overviewData = new HashMap<>();

        // Lấy các số liệu từ Repo
        int totalUsers       = reportRepo.countUsers();
        int activeUsers      = reportRepo.countActiveUsers();
        int totalStations    = reportRepo.countStations();
        int totalBatteries   = reportRepo.countBatteries();
        int activeBatteries  = reportRepo.countActiveBatteries();
        int totalSwaps       = reportRepo.countSwaps();
        int totalTransactions= reportRepo.countPayments();
        double monthlyRevenue= reportRepo.getTotalRevenue(); // giống logic cũ

        overviewData.put("totalUsers", totalUsers);
        overviewData.put("activeUsers", activeUsers);
        overviewData.put("totalStations", totalStations);
        overviewData.put("totalBatteries", totalBatteries);
        overviewData.put("activeBatteries", activeBatteries);
        overviewData.put("totalSwaps", totalSwaps);
        overviewData.put("revenue", monthlyRevenue);
        overviewData.put("monthlyRevenue", monthlyRevenue);
        overviewData.put("totalTransactions", totalTransactions);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", overviewData);
        res.put("message", "Lấy báo cáo tổng quan thành công");
        return res;
    }

    @Override
    public Map<String, Object> getRevenueReport(String dateRange) {
        Map<String, Object> revenueData = new HashMap<>();

        double monthlyRevenue   = reportRepo.getTotalRevenue();  // giữ y như cũ
        double dailyRevenue     = monthlyRevenue / 30;
        double yearlyRevenue    = monthlyRevenue * 12;
        int totalTransactions   = reportRepo.countPayments();

        revenueData.put("monthly", monthlyRevenue);
        revenueData.put("daily", Math.round(dailyRevenue * 100.0) / 100.0);
        revenueData.put("yearly", yearlyRevenue);
        revenueData.put("totalTransactions", totalTransactions);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", revenueData);
        res.put("message", "Lấy báo cáo doanh thu thành công");
        return res;
    }

    @Override
    public Map<String, Object> getUsageReport(String dateRange) {
        Map<String, Object> usageData = new HashMap<>();

        int totalSwaps      = reportRepo.countSwaps();
        int activeBatteries = reportRepo.countActiveBatteries();
        int totalStations   = reportRepo.countStations();

        double averageSwapsPerDay = totalSwaps / 30.0;

        usageData.put("totalSwaps", totalSwaps);
        usageData.put("monthlySwaps", totalSwaps);
        usageData.put("averageSwapsPerDay", Math.round(averageSwapsPerDay * 100.0) / 100.0);
        usageData.put("activeBatteries", activeBatteries);
        usageData.put("totalStations", totalStations);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", usageData);
        res.put("message", "Lấy báo cáo sử dụng thành công");
        return res;
    }

    @Override
    public Map<String, Object> getCustomerReport(String dateRange) {
        Map<String, Object> customerData = new HashMap<>();

        int totalUsers  = reportRepo.countUsers();
        int activeUsers = reportRepo.countActiveUsers();
        int newUsersThisMonth = totalUsers / 10; // giữ mock cũ: 10% là user mới
        double retentionRate = totalUsers > 0
                ? (double) activeUsers / totalUsers * 100.0
                : 0.0;

        customerData.put("totalCustomers", totalUsers);
        customerData.put("activeCustomers", activeUsers);
        customerData.put("newCustomersThisMonth", newUsersThisMonth);
        customerData.put("customerRetentionRate", Math.round(retentionRate * 100.0) / 100.0);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", customerData);
        res.put("message", "Lấy báo cáo khách hàng thành công");
        return res;
    }

    @Override
    public Map<String, Object> exportReport(Map<String, Object> exportRequest) {
        String reportType = (String) exportRequest.get("reportType");
        String format     = (String) exportRequest.get("format");

        // Mock export giống code cũ
        Map<String, Object> exportResult = new HashMap<>();
        String fileName = reportType + "_report_" + System.currentTimeMillis() + "." + format;
        exportResult.put("fileName", fileName);
        exportResult.put("downloadUrl", "/downloads/" + fileName);
        exportResult.put("fileSize", "1.2 MB");
        exportResult.put("exportedAt", new Date());

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", exportResult);
        res.put("message", "Xuất báo cáo thành công");
        return res;
    }

    // =================== Doanh thu ===================

    @Override
    public double getTotalRevenue() {
        return reportRepo.getTotalRevenue();
    }

    @Override
    public double getRevenueInRange(String from, String to) {
        try {
            LocalDate fromDate = LocalDate.parse(from);
            LocalDate toDate   = LocalDate.parse(to);

            Date fromUtil = Date.from(fromDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date toUtil   = Date.from(toDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

            return reportRepo.getRevenueInRange(fromUtil, toUtil);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi parse ngày from/to, format phải là yyyy-MM-dd", e);
        }
    }
}
