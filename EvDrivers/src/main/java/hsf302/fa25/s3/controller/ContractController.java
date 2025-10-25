package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dao.ContractDao;
import hsf302.fa25.s3.dao.ServicePlanDao;
import hsf302.fa25.s3.model.Contract;
import hsf302.fa25.s3.model.ServicePlan;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {
    
    private final ContractDao contractDao = new ContractDao();
    private final ServicePlanDao servicePlanDao = new ServicePlanDao();

    @PostMapping
    public ResponseEntity<?> createContract(@RequestBody Map<String, Object> contractData) {
        // Mock data - Contract creation not implemented yet (missing createContract DAO method)
        Map<String, Object> newContract = new HashMap<>();
        newContract.put("contractId", System.currentTimeMillis());
        newContract.put("userId", contractData.get("userId"));
        newContract.put("vehicleId", contractData.get("vehicleId"));
        newContract.put("planId", contractData.get("planId"));
        newContract.put("planType", contractData.get("planType"));
        newContract.put("duration", contractData.get("duration"));
        newContract.put("monthlyFee", contractData.get("monthlyFee"));
        newContract.put("swapLimit", contractData.get("swapLimit"));
        newContract.put("status", "ACTIVE");
        newContract.put("startDate", new Date());
        newContract.put("endDate", new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000)); // 30 days
        newContract.put("createdAt", new Date());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Contract created successfully (mock)");
        response.put("data", newContract);
        response.put("note", "Mock data - ContractDao.createContract method not implemented");
        
        return ResponseEntity.ok(response);
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
                contractMap.put("usedSwaps", 0); // TODO: Calculate from Swaps table
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
        terminationResult.put("refundAmount", 0); // Calculate based on remaining time
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
}