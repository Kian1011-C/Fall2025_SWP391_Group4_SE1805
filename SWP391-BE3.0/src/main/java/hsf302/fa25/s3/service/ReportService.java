package hsf302.fa25.s3.service;

import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface ReportService {

    // Các API báo cáo tổng quan
    Map<String, Object> getOverviewReport(String dateRange);

    Map<String, Object> getRevenueReport(String dateRange);

    Map<String, Object> getUsageReport(String dateRange);

    Map<String, Object> getCustomerReport(String dateRange);

    Map<String, Object> exportReport(Map<String, Object> exportRequest);

    // Doanh thu
    double getTotalRevenue();

    double getRevenueInRange(String from, String to);
}
