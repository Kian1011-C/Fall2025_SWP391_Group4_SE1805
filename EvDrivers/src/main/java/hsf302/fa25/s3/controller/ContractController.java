package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dao.ContractDao;
import hsf302.fa25.s3.dao.ServicePlanDao;
import hsf302.fa25.s3.model.Contract;
import hsf302.fa25.s3.model.ServicePlan;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import hsf302.fa25.s3.dao.UserDao;
import hsf302.fa25.s3.model.User;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;


@RestController
@RequestMapping("/api/contracts")
public class ContractController {
    
    private final ContractDao contractDao = new ContractDao();
    private final ServicePlanDao servicePlanDao = new ServicePlanDao();
    private final UserDao userDao = new UserDao();

    @PostMapping
    public ResponseEntity<?> createContract(@RequestBody Map<String, Object> body) {
        Map<String, Object> res = new HashMap<>();
        try {
            // 1) Lấy & kiểm tra input
            String userId = asString(body.get("userId"));
            Integer vehicleId = asInteger(body.get("vehicleId"));
            Integer planId = asInteger(body.get("planId"));
            String planName = asString(body.get("planName"));
            String startDate = asString(body.get("startDate"));
            String endDate = asString(body.get("endDate"));
            String signedPlace = asString(body.get("signedPlace"));

            if (isBlank(userId) || vehicleId == null || isBlank(startDate) || isBlank(endDate)) {
                res.put("success", false);
                res.put("message", "Thiếu tham số: userId, vehicleId, startDate, endDate là bắt buộc.");
                return ResponseEntity.badRequest().body(res);
            }

            // 2) Parse ngày
            LocalDate s, e;
            try {
                s = LocalDate.parse(startDate);
                e = LocalDate.parse(endDate);
            } catch (DateTimeParseException ex) {
                res.put("success", false);
                res.put("message", "Định dạng ngày không hợp lệ. Dùng yyyy-MM-dd.");
                return ResponseEntity.badRequest().body(res);
            }
            if (e.isBefore(s)) {
                res.put("success", false);
                res.put("message", "endDate phải >= startDate.");
                return ResponseEntity.badRequest().body(res);
            }

            // 3) Kiểm tra user tồn tại & active
            User u = userDao.getUserById(userId);
            if (u == null || !"active".equalsIgnoreCase(u.getStatus())) {
                res.put("success", false);
                res.put("message", "Tài khoản không tồn tại hoặc chưa kích hoạt.");
                return ResponseEntity.badRequest().body(res);
            }

            // 4) Xe phải thuộc user
            if (!contractDao.vehicleBelongsToUser(vehicleId, userId)) {
                res.put("success", false);
                res.put("message", "Xe không thuộc về người dùng " + userId + ".");
                return ResponseEntity.badRequest().body(res);
            }

            // 5) Xác định planId (ưu tiên planId, nếu không có thì tra theo planName)
            Integer finalPlanId = planId;
            if (finalPlanId == null) {
                if (isBlank(planName)) {
                    res.put("success", false);
                    res.put("message", "Thiếu planId hoặc planName.");
                    return ResponseEntity.badRequest().body(res);
                }
                finalPlanId = contractDao.getPlanIdByName(planName);
                if (finalPlanId == null) {
                    res.put("success", false);
                    res.put("message", "Không tìm thấy gói dịch vụ đang active: " + planName);
                    return ResponseEntity.badRequest().body(res);
                }
            }

            // 6) Chặn overlap với hợp đồng active hiện có
            java.sql.Date ds = java.sql.Date.valueOf(s);
            java.sql.Date de = java.sql.Date.valueOf(e);
            if (contractDao.hasActiveOverlap(vehicleId, ds, de)) {
                res.put("success", false);
                res.put("message", "Xe đã có hợp đồng active trùng/đè khoảng thời gian này.");
                return ResponseEntity.badRequest().body(res);
            }

            // 7) Tạo hợp đồng (DAO sẽ set monthly_base_fee = base_price; monthly_total_fee = base_price)
            int contractId = contractDao.createContract(
                    vehicleId, finalPlanId, ds, de,
                    isBlank(signedPlace) ? "Hà Nội" : signedPlace
            );
            if (contractId <= 0) {
                res.put("success", false);
                res.put("message", "Tạo hợp đồng thất bại.");
                return ResponseEntity.status(500).body(res);
            }

            // 8) Trả về kết quả
            Map<String, Object> data = new HashMap<>();
            data.put("contractId", contractId);
            data.put("vehicleId", vehicleId);
            data.put("planId", finalPlanId);
            data.put("userId", userId);
            data.put("startDate", s.toString());
            data.put("endDate", e.toString());
            data.put("signedPlace", isBlank(signedPlace) ? "Hà Nội" : signedPlace);

            res.put("success", true);
            res.put("message", "Tạo hợp đồng thành công.");
            res.put("data", data);
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "Lỗi hệ thống: " + e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }

    // ==================== GET ALL CONTRACTS (Admin/Staff) ====================
    @GetMapping
    public ResponseEntity<?> getAllContracts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) Integer planId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "50") int size) {
        try {
            StringBuilder sql = new StringBuilder("""
                SELECT c.contract_id, c.vehicle_id, c.plan_id, c.start_date, c.end_date, 
                       c.status, c.contract_number, c.signed_place, c.monthly_distance, c.monthly_base_fee,
                       sp.plan_name,
                       v.plate_number, v.model as vehicle_model, v.user_id,
                       u.first_name, u.last_name, u.email, u.phone
                FROM Contracts c
                INNER JOIN ServicePlans sp ON c.plan_id = sp.plan_id
                INNER JOIN Vehicles v ON c.vehicle_id = v.vehicle_id
                INNER JOIN Users u ON v.user_id = u.user_id
                WHERE 1=1
            """);

            List<Object> params = new ArrayList<>();

            // Apply filters
            if (status != null && !status.isEmpty()) {
                sql.append(" AND c.status = ?");
                params.add(status);
            }
            if (userId != null && !userId.isEmpty()) {
                sql.append(" AND v.user_id = ?");
                params.add(userId);
            }
            if (planId != null) {
                sql.append(" AND c.plan_id = ?");
                params.add(planId);
            }

            sql.append(" ORDER BY c.contract_id DESC");

            List<Map<String, Object>> allContracts = new ArrayList<>();

            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection();
                 java.sql.PreparedStatement ps = conn.prepareStatement(sql.toString())) {
                
                // Set parameters
                for (int i = 0; i < params.size(); i++) {
                    ps.setObject(i + 1, params.get(i));
                }

                java.sql.ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> contractMap = new LinkedHashMap<>();
                    
                    // Contract info
                    contractMap.put("contractId", rs.getInt("contract_id"));
                    contractMap.put("contractNumber", rs.getString("contract_number"));
                    contractMap.put("status", rs.getString("status"));
                    contractMap.put("startDate", rs.getDate("start_date"));
                    contractMap.put("endDate", rs.getDate("end_date"));
                    contractMap.put("signedPlace", rs.getString("signed_place"));
                    contractMap.put("monthlyDistance", rs.getBigDecimal("monthly_distance"));
                    contractMap.put("monthlyBaseFee", rs.getBigDecimal("monthly_base_fee"));
                    
                    // Plan info
                    contractMap.put("planId", rs.getInt("plan_id"));
                    contractMap.put("planName", rs.getString("plan_name"));
                    
                    // Vehicle info
                    contractMap.put("vehicleId", rs.getInt("vehicle_id"));
                    contractMap.put("plateNumber", rs.getString("plate_number"));
                    contractMap.put("vehicleModel", rs.getString("vehicle_model"));
                    
                    // User info
                    contractMap.put("userId", rs.getString("user_id"));
                    contractMap.put("firstName", rs.getString("first_name"));
                    contractMap.put("lastName", rs.getString("last_name"));
                    contractMap.put("email", rs.getString("email"));
                    contractMap.put("phone", rs.getString("phone"));
                    
                    allContracts.add(contractMap);
                }
            }

            // Apply pagination
            int start = page * size;
            int end = Math.min(start + size, allContracts.size());
            List<Map<String, Object>> paginatedContracts = allContracts.subList(start, end);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", paginatedContracts);
            response.put("total", allContracts.size());
            response.put("page", page);
            response.put("size", size);
            response.put("totalPages", (allContracts.size() + size - 1) / size);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching contracts: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getContracts(@PathVariable String userId) {
        try {
            List<Contract> contracts = contractDao.getContractsByUserId(userId);
            
            List<Map<String, Object>> contractMaps = new ArrayList<>();
            for (Contract contract : contracts) {
                // Get service plan details
                ServicePlan plan = servicePlanDao.getPlanById(contract.getPlanId());
                
                Map<String, Object> contractMap = new HashMap<>();
                contractMap.put("contractId", contract.getContractId());
                contractMap.put("vehicleId", contract.getVehicleId());
                contractMap.put("contractNumber", contract.getContractNumber());
                contractMap.put("status", contract.getStatus());
                contractMap.put("startDate", contract.getStartDate());
                contractMap.put("endDate", contract.getEndDate());
                
                // Add service plan details
                if (plan != null) {
                    contractMap.put("planId", plan.getPlanId());
                    contractMap.put("planType", plan.getPlanName().toUpperCase());
                    contractMap.put("planName", plan.getPlanName() + " Plan");
                    contractMap.put("monthlyFee", plan.getBasePrice());
                    contractMap.put("baseDistance", plan.getBaseDistance());
                    contractMap.put("depositFee", plan.getDepositFee());
                    contractMap.put("description", plan.getDescription());
                    contractMap.put("isUnlimited", plan.isUnlimited());
                } else {
                    // Fallback if plan not found
                    contractMap.put("planType", "UNKNOWN");
                    contractMap.put("planName", "Unknown Plan");
                    contractMap.put("monthlyFee", 0);
                }
                
                // Add monthly usage from database
                contractMap.put("usedSwaps", 0); // TODO từ bảng Swaps nếu cần
                contractMap.put("usedDistance", contract.getMonthlyDistance());
                contractMap.put("monthlyBaseFee", contract.getMonthlyBaseFee());
                contractMap.put("monthlyOverageFee", contract.getMonthlyOverageFee());
                contractMap.put("monthlyTotalFee", contract.getMonthlyTotalFee());
                contractMap.put("currentMonth", contract.getCurrentMonth());
                
                contractMaps.add(contractMap);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", contractMaps);
            response.put("total", contractMaps.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching contracts: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{contractId}")
    public ResponseEntity<?> updateContract(@PathVariable Long contractId, @RequestBody Map<String, Object> updates) {
        // TODO: Implement actual contract update logic
        Map<String, Object> updatedContract = new HashMap<>();
        updatedContract.put("contractId", contractId);
        updatedContract.putAll(updates);
        updatedContract.put("updatedAt", new Date());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Contract updated successfully");
        response.put("data", updatedContract);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{contractId}/terminate")
    public ResponseEntity<?> terminateContract(@PathVariable Long contractId, @RequestBody Map<String, Object> terminationData) {
        String reason = (String) terminationData.get("reason");
        
        // TODO: Implement actual contract termination logic
        Map<String, Object> terminationResult = new HashMap<>();
        terminationResult.put("contractId", contractId);
        terminationResult.put("status", "TERMINATED");
        terminationResult.put("terminatedAt", new Date());
        terminationResult.put("reason", reason);
        terminationResult.put("refundAmount", 0);
        terminationResult.put("finalBillAmount", 0);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Contract terminated successfully");
        response.put("data", terminationResult);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{contractId}")
    public ResponseEntity<?> getContractDetails(@PathVariable Long contractId) {
        // Mock data - Enhanced contract details not implemented yet
        Map<String, Object> contractDetails = new HashMap<>();
        contractDetails.put("contractId", contractId);
        contractDetails.put("userId", 123L);
        contractDetails.put("planType", "PREMIUM");
        contractDetails.put("planName", "Premium Monthly Plan");
        contractDetails.put("duration", 12);
        contractDetails.put("monthlyFee", 500000);
        contractDetails.put("swapLimit", 30);
        contractDetails.put("usedSwaps", 15);
        contractDetails.put("remainingSwaps", 15);
        contractDetails.put("status", "ACTIVE");
        contractDetails.put("startDate", "2024-01-01");
        contractDetails.put("endDate", "2024-12-31");
        contractDetails.put("autoRenewal", true);
        contractDetails.put("nextBillingDate", "2024-02-01");
        contractDetails.put("totalPaid", 1500000);
        contractDetails.put("benefits", Arrays.asList(
            "Unlimited swaps per month",
            "Priority booking",
            "24/7 customer support",
            "Free battery health check"
        ));
        contractDetails.put("terms", Map.of(
            "cancellationPolicy", "30 days notice required",
            "refundPolicy", "Pro-rated refund for unused months",
            "upgradePolicy", "Can upgrade anytime with price adjustment"
        ));
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", contractDetails);
        response.put("note", "Mock data - Enhanced contract details not implemented");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{contractId}/usage")
    public ResponseEntity<?> getContractUsage(@PathVariable Long contractId) {
        // Mock data - Detailed usage history not implemented yet
        Map<String, Object> usage = new HashMap<>();
        usage.put("contractId", contractId);
        usage.put("currentPeriod", Map.of(
            "startDate", "2024-01-01",
            "endDate", "2024-01-31",
            "swapLimit", 30,
            "usedSwaps", 15,
            "remainingSwaps", 15
        ));
        
        List<Map<String, Object>> monthlyUsage = new ArrayList<>();
        monthlyUsage.add(Map.of("month", "2024-01", "swapsUsed", 15, "swapLimit", 30));
        monthlyUsage.add(Map.of("month", "2023-12", "swapsUsed", 25, "swapLimit", 30));
        monthlyUsage.add(Map.of("month", "2023-11", "swapsUsed", 28, "swapLimit", 30));
        
        usage.put("monthlyUsage", monthlyUsage);
        usage.put("averageMonthlyUsage", 22.7);
        usage.put("peakUsageMonth", "2023-11");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", usage);
        response.put("note", "Mock data - Detailed usage history not implemented");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{contractId}/renew")
    public ResponseEntity<?> renewContract(@PathVariable Long contractId, @RequestBody Map<String, Object> renewalData) {
        // TODO: Implement actual contract renewal logic
        Map<String, Object> renewalResult = new HashMap<>();
        renewalResult.put("originalContractId", contractId);
        renewalResult.put("newContractId", System.currentTimeMillis());
        renewalResult.put("renewalDate", new Date());
        renewalResult.put("newEndDate", new Date(System.currentTimeMillis() + 365L * 24 * 60 * 60 * 1000)); // 1 year
        renewalResult.put("planType", renewalData.get("planType"));
        renewalResult.put("monthlyFee", renewalData.get("monthlyFee"));
        renewalResult.put("status", "ACTIVE");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Contract renewed successfully");
        response.put("data", renewalResult);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/plans")
    public ResponseEntity<?> getAvailablePlans() {
        try {
            List<ServicePlan> servicePlans = servicePlanDao.getAllActivePlans();
            List<Map<String, Object>> plans = new ArrayList<>();
            
            for (ServicePlan plan : servicePlans) {
                Map<String, Object> planMap = new HashMap<>();
                planMap.put("planId", plan.getPlanId());
                planMap.put("planName", plan.getPlanName());
                planMap.put("name", plan.getPlanName() + " Plan");
                planMap.put("basePrice", plan.getBasePrice());
                planMap.put("monthlyFee", plan.getBasePrice()); // For frontend compatibility
                planMap.put("baseDistance", plan.getBaseDistance());
                planMap.put("depositFee", plan.getDepositFee());
                planMap.put("description", plan.getDescription());
                planMap.put("isUnlimited", plan.isUnlimited());
                
                // Add features based on plan type
                List<String> features = new ArrayList<>();
                if (plan.getPlanName().equals("Eco")) {
                    features.add("200 km base distance per month");
                    features.add("Basic customer support");
                    features.add("Standard battery monitoring");
                } else if (plan.getPlanName().equals("Cơ bản")) {
                    features.add("400 km base distance per month");
                    features.add("Standard customer support");
                    features.add("Battery health monitoring");
                } else if (plan.getPlanName().equals("Plus")) {
                    features.add("600 km base distance per month");
                    features.add("Priority support");
                    features.add("Advanced battery monitoring");
                    features.add("Booking priority");
                } else if (plan.getPlanName().equals("Premium")) {
                    features.add("Unlimited distance");
                    features.add("24/7 premium support");
                    features.add("Complete battery management");
                    features.add("VIP services");
                    features.add("No overage charges");
                }
                
                planMap.put("features", features);
                plans.add(planMap);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", plans);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching service plans: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{contractId}/billing")
    public ResponseEntity<?> processMonthlyBilling(@PathVariable Integer contractId) {
        try {
            // Tính toán phí trước khi billing
            contractDao.calculateAndUpdateMonthlyFees(contractId);
            
            // Thực hiện billing và reset tháng mới
            boolean success = contractDao.processMonthlyBilling(contractId);
            
            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("success", true);
                response.put("message", "Monthly billing processed successfully");
            } else {
                response.put("success", false);
                response.put("message", "Failed to process monthly billing");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error processing monthly billing: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/billing-report/{monthYear}")
    public ResponseEntity<?> getMonthlyBillingReport(@PathVariable String monthYear) {
        try {
            List<Map<String, Object>> reports = contractDao.getMonthlyBillingReport(monthYear);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", reports);
            response.put("month", monthYear);
            response.put("totalContracts", reports.size());
            
            // Tính tổng doanh thu
            java.math.BigDecimal totalRevenue = reports.stream()
                .map(r -> (java.math.BigDecimal) r.get("monthlyTotalFee"))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
            response.put("totalRevenue", totalRevenue);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error generating billing report: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/auto-reset-month")
    public ResponseEntity<?> autoResetMonth() {
        try {
            boolean success = contractDao.checkAndResetIfNewMonth();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", success);
            response.put("message", success ? 
                "All contracts reset to new month successfully" : 
                "Some contracts failed to reset");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error resetting contracts: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/vehicle/{vehicleId}/plan")
    public ResponseEntity<?> getVehiclePlan(@PathVariable int vehicleId) {
        try {
            String sql = """
                SELECT 
                    sp.plan_name,
                    sp.base_price,
                    sp.base_distance,
                    sp.description,
                    c.start_date,
                    c.end_date,
                    c.status,
                    c.monthly_distance,
                    c.monthly_total_fee,
                    c.contract_number
                FROM Contracts c
                INNER JOIN ServicePlans sp ON c.plan_id = sp.plan_id
                WHERE c.vehicle_id = ? AND c.status = 'active'
            """;
            
            Map<String, Object> planInfo = new HashMap<>();
            
            try (java.sql.Connection conn = hsf302.fa25.s3.context.ConnectDB.getConnection();
                 java.sql.PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, vehicleId);
                
                java.sql.ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    planInfo.put("planName", rs.getString("plan_name"));
                    planInfo.put("basePrice", rs.getBigDecimal("base_price"));
                    planInfo.put("baseDistance", rs.getInt("base_distance"));
                    planInfo.put("description", rs.getString("description"));
                    planInfo.put("startDate", rs.getDate("start_date"));
                    planInfo.put("endDate", rs.getDate("end_date"));
                    planInfo.put("status", rs.getString("status"));
                    planInfo.put("monthlyDistance", rs.getBigDecimal("monthly_distance"));
                    planInfo.put("monthlyFee", rs.getBigDecimal("monthly_total_fee"));
                    planInfo.put("contractNumber", rs.getString("contract_number"));
                    
                    // Thêm thông tin về giới hạn
                    int baseDistance = rs.getInt("base_distance");
                    if (baseDistance == -1) {
                        planInfo.put("isUnlimited", true);
                        planInfo.put("limitInfo", "Không giới hạn");
                    } else {
                        planInfo.put("isUnlimited", false);
                        planInfo.put("limitInfo", baseDistance + " km/tháng");
                    }
                } else {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Không tìm thấy gói thuê pin cho xe này");
                    return ResponseEntity.status(404).body(response);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", planInfo);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ===== Helpers =====
    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
    private static String asString(Object o) {
        return (o == null) ? null : String.valueOf(o);
    }
    private static Integer asInteger(Object o) {
        if (o == null) return null;
        if (o instanceof Integer i) return i;
        if (o instanceof Number n) return n.intValue();
        try { return Integer.parseInt(String.valueOf(o)); } catch (Exception e) { return null; }
    }
}
