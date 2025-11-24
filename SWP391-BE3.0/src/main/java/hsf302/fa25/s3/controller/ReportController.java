package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService service;

    // ================== OVERVIEW ==================
    @GetMapping("/overview")
    public ResponseEntity<?> getOverviewReport(
            @RequestParam(required = false) String dateRange) {
        try {
            return ResponseEntity.ok(service.getOverviewReport(dateRange));
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("message", "Lỗi khi lấy báo cáo tổng quan: " + e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }

    // ================== REVENUE ==================
    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueReport(
            @RequestParam(required = false) String dateRange) {
        try {
            return ResponseEntity.ok(service.getRevenueReport(dateRange));
        } catch (Exception e) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("message", "Lỗi khi lấy báo cáo doanh thu: " + e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }

    // ================== USAGE ==================
    @GetMapping("/usage")
    public ResponseEntity<?> getUsageReport(
            @RequestParam(required = false) String dateRange) {
        try {
            return ResponseEntity.ok(service.getUsageReport(dateRange));
        } catch (Exception e) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("message", "Lỗi khi lấy báo cáo sử dụng: " + e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }

    // ================== CUSTOMERS ==================
    @GetMapping("/customers")
    public ResponseEntity<?> getCustomerReport(
            @RequestParam(required = false) String dateRange) {
        try {
            return ResponseEntity.ok(service.getCustomerReport(dateRange));
        } catch (Exception e) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("message", "Lỗi khi lấy báo cáo khách hàng: " + e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }

    // ================== EXPORT (mock) ==================
    @PostMapping("/export")
    public ResponseEntity<?> exportReport(@RequestBody Map<String, Object> exportRequest) {
        try {
            return ResponseEntity.ok(service.exportReport(exportRequest));
        } catch (Exception e) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("message", "Lỗi khi xuất báo cáo: " + e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }

    // ================== TỔNG DOANH THU ==================
    @GetMapping("/revenue/total")
    public Map<String, Object> totalRevenue() {
        double total = service.getTotalRevenue();
        return Map.of(
                "success", true,
                "totalRevenue", total,
                "currency", "VND"
        );
    }

    /** Tổng doanh thu theo khoảng ngày [from, to], format yyyy-MM-dd. */
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
