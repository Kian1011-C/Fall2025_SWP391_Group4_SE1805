package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dao.PaymentDao;
import hsf302.fa25.s3.model.Payment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    private final PaymentDao paymentDao = new PaymentDao();

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            Double amount = Double.valueOf(paymentData.get("amount").toString());
            String method = (String) paymentData.get("method");
            String type = (String) paymentData.get("type");
            String userId = paymentData.get("userId").toString();
            
            // Calculate fees
            double fee = amount * 0.02; // 2% processing fee
            double netAmount = amount - fee;
            
            // Create payment record using PaymentDao
            PaymentDao paymentDao = new PaymentDao();
            int paymentId = paymentDao.createPayment(userId, amount, method, type, "SUCCESS");
            
            if (paymentId > 0) {
                Map<String, Object> paymentResult = new HashMap<>();
                paymentResult.put("paymentId", paymentId);
                paymentResult.put("userId", userId);
                paymentResult.put("amount", amount);
                paymentResult.put("method", method);
                paymentResult.put("type", type);
                paymentResult.put("status", "SUCCESS");
                paymentResult.put("transactionId", "TXN-" + paymentId);
                paymentResult.put("processedAt", new Date());
                paymentResult.put("fee", fee);
                paymentResult.put("netAmount", netAmount);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Payment processed successfully");
                response.put("data", paymentResult);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Failed to process payment");
                return ResponseEntity.status(500).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error processing payment: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/user/{userId}/history")
    public ResponseEntity<?> getPaymentHistory(@PathVariable String userId,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int size) {
        try {
            List<Payment> payments = paymentDao.getPaymentsByUserId(userId.toString());
            
            List<Map<String, Object>> paymentMaps = new ArrayList<>();
            for (Payment payment : payments) {
                Map<String, Object> paymentMap = new HashMap<>();
                paymentMap.put("paymentId", payment.getPaymentId());
                paymentMap.put("userId", payment.getUserId());
                paymentMap.put("amount", payment.getAmount());
                paymentMap.put("method", payment.getMethod());
                paymentMap.put("status", payment.getStatus());
                paymentMap.put("currency", payment.getCurrency());
                paymentMap.put("transactionId", payment.getTransactionRef());
                paymentMap.put("processedAt", payment.getCreatedAt());
                paymentMap.put("contractId", payment.getContractId());
                
                paymentMaps.add(paymentMap);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", paymentMaps);
            response.put("pagination", Map.of(
                "page", page,
                "size", size,
                "total", paymentMaps.size(),
                "totalPages", 1
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching payment history: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/user/{userId}/auto-payment")
    public ResponseEntity<?> setupAutoPayment(@PathVariable String userId, @RequestBody Map<String, Object> autoPaymentData) {
        String paymentMethod = (String) autoPaymentData.get("paymentMethod");
        String frequency = (String) autoPaymentData.get("frequency");
        Double amount = Double.valueOf(autoPaymentData.get("amount").toString());
        
        // Mock data - AutoPayment table not implemented yet
        Map<String, Object> autoPaymentSetup = new HashMap<>();
        autoPaymentSetup.put("autoPaymentId", System.currentTimeMillis());
        autoPaymentSetup.put("userId", userId);
        autoPaymentSetup.put("paymentMethod", paymentMethod);
        autoPaymentSetup.put("frequency", frequency);
        autoPaymentSetup.put("amount", amount);
        autoPaymentSetup.put("status", "ACTIVE");
        autoPaymentSetup.put("nextPaymentDate", new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000));
        autoPaymentSetup.put("createdAt", new Date());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Auto payment setup successfully (mock)");
        response.put("data", autoPaymentSetup);
        response.put("note", "Mock data - AutoPayment table not implemented");
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/user/{userId}/auto-payment")
    public ResponseEntity<?> cancelAutoPayment(@PathVariable String userId) {
        // TODO: Implement actual auto payment cancellation
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Auto payment cancelled successfully");
        response.put("cancelledAt", new Date());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<?> refundPayment(@PathVariable Long paymentId, @RequestBody Map<String, Object> refundData) {
        String reason = (String) refundData.get("reason");
        Double refundAmount = Double.valueOf(refundData.get("amount").toString());
        
        // TODO: Implement actual refund processing
        Map<String, Object> refundResult = new HashMap<>();
        refundResult.put("refundId", System.currentTimeMillis());
        refundResult.put("originalPaymentId", paymentId);
        refundResult.put("refundAmount", refundAmount);
        refundResult.put("reason", reason);
        refundResult.put("status", "PROCESSED");
        refundResult.put("processedAt", new Date());
        refundResult.put("estimatedRefundDate", new Date(System.currentTimeMillis() + 3L * 24 * 60 * 60 * 1000)); // 3 days
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Refund processed successfully");
        response.put("data", refundResult);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/methods")
    public ResponseEntity<?> getPaymentMethods(@PathVariable String userId) {
        // Mock data - PaymentMethods table not implemented yet
        List<Map<String, Object>> paymentMethods = new ArrayList<>();
        
        Map<String, Object> creditCard = new HashMap<>();
        creditCard.put("id", 1);
        creditCard.put("type", "CREDIT_CARD");
        creditCard.put("cardNumber", "**** **** **** 1234");
        creditCard.put("cardType", "VISA");
        creditCard.put("expiryDate", "12/26");
        creditCard.put("holderName", "NGUYEN VAN A");
        creditCard.put("isDefault", true);
        creditCard.put("isActive", true);
        
        Map<String, Object> bankAccount = new HashMap<>();
        bankAccount.put("id", 2);
        bankAccount.put("type", "BANK_TRANSFER");
        bankAccount.put("bankName", "Vietcombank");
        bankAccount.put("accountNumber", "**** **** 5678");
        bankAccount.put("holderName", "NGUYEN VAN A");
        bankAccount.put("isDefault", false);
        bankAccount.put("isActive", true);
        
        Map<String, Object> wallet = new HashMap<>();
        wallet.put("id", 3);
        wallet.put("type", "WALLET");
        wallet.put("walletProvider", "MoMo");
        wallet.put("phoneNumber", "**** *** 789");
        wallet.put("balance", 150000);
        wallet.put("isDefault", false);
        wallet.put("isActive", true);
        
        paymentMethods.add(creditCard);
        paymentMethods.add(bankAccount);
        paymentMethods.add(wallet);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", paymentMethods);
        response.put("note", "Mock data - PaymentMethods table not implemented");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/{userId}/methods")
    public ResponseEntity<?> addPaymentMethod(@PathVariable String userId, @RequestBody Map<String, Object> paymentMethodData) {
        // TODO: Implement actual payment method addition
        Map<String, Object> newPaymentMethod = new HashMap<>(paymentMethodData);
        newPaymentMethod.put("id", System.currentTimeMillis());
        newPaymentMethod.put("userId", userId);
        newPaymentMethod.put("isActive", true);
        newPaymentMethod.put("addedAt", new Date());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment method added successfully");
        response.put("data", newPaymentMethod);
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/user/{userId}/methods/{methodId}")
    public ResponseEntity<?> removePaymentMethod(@PathVariable String userId, @PathVariable Long methodId) {
        // TODO: Implement actual payment method removal
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment method removed successfully");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/balance")
    public ResponseEntity<?> getUserBalance(@PathVariable String userId) {
        // Mock data - UserBalance/Wallet table not implemented yet
        Map<String, Object> balance = new HashMap<>();
        balance.put("userId", userId);
        balance.put("currentBalance", 150000);
        balance.put("currency", "VND");
        balance.put("pendingAmount", 25000);
        balance.put("availableAmount", 125000);
        balance.put("lastUpdated", new Date());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", balance);
        response.put("note", "Mock data - UserBalance table not implemented");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/{userId}/topup")
    public ResponseEntity<?> topupBalance(@PathVariable String userId, @RequestBody Map<String, Object> topupData) {
        Double amount = Double.valueOf(topupData.get("amount").toString());
        String method = (String) topupData.get("method");
        
        // Mock topup - UserBalance table not implemented yet
        Map<String, Object> topupResult = new HashMap<>();
        topupResult.put("topupId", System.currentTimeMillis());
        topupResult.put("userId", userId);
        topupResult.put("amount", amount);
        topupResult.put("method", method);
        topupResult.put("status", "SUCCESS");
        topupResult.put("newBalance", 150000 + amount);
        topupResult.put("processedAt", new Date());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Balance topped up successfully (mock)");
        response.put("data", topupResult);
        response.put("note", "Mock data - UserBalance table not implemented");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/calculate-monthly-bill/{contractId}")
    public ResponseEntity<?> calculateMonthlyBill(@PathVariable Integer contractId) {
        try {
            // Sử dụng ContractDao để tính phí monthly
            hsf302.fa25.s3.dao.ContractDao contractDao = new hsf302.fa25.s3.dao.ContractDao();
            
            // Tính toán phí dựa trên usage hiện tại
            boolean calculated = contractDao.calculateAndUpdateMonthlyFees(contractId);
            
            if (calculated) {
                // Lấy thông tin contract sau khi tính toán
                hsf302.fa25.s3.model.Contract contract = contractDao.getContractById(contractId);
                
                Map<String, Object> billDetails = new HashMap<>();
                billDetails.put("contractId", contractId);
                billDetails.put("currentMonth", contract.getCurrentMonth());
                billDetails.put("distanceUsed", contract.getMonthlyDistance());
                billDetails.put("baseFee", contract.getMonthlyBaseFee());
                billDetails.put("overageDistance", contract.getMonthlyOverageDistance());
                billDetails.put("overageFee", contract.getMonthlyOverageFee());
                billDetails.put("totalFee", contract.getMonthlyTotalFee());
                
                // Thêm thông tin service plan
                hsf302.fa25.s3.dao.ServicePlanDao servicePlanDao = new hsf302.fa25.s3.dao.ServicePlanDao();
                hsf302.fa25.s3.model.ServicePlan plan = servicePlanDao.getPlanById(contract.getPlanId());
                if (plan != null) {
                    billDetails.put("planName", plan.getPlanName());
                    billDetails.put("baseDistance", plan.getBaseDistance());
                    billDetails.put("isUnlimited", plan.isUnlimited());
                }
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Monthly bill calculated successfully");
                response.put("data", billDetails);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Failed to calculate monthly bill");
                return ResponseEntity.status(500).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error calculating monthly bill: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/process-monthly-payment/{contractId}")
    public ResponseEntity<?> processMonthlyPayment(@PathVariable Integer contractId, 
                                                   @RequestBody Map<String, Object> paymentData) {
        try {
            String method = (String) paymentData.get("method");
            String userId = paymentData.get("userId").toString();
            
            hsf302.fa25.s3.dao.ContractDao contractDao = new hsf302.fa25.s3.dao.ContractDao();
            
            // Lấy thông tin contract và tổng phí
            hsf302.fa25.s3.model.Contract contract = contractDao.getContractById(contractId);
            if (contract == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Contract not found");
                return ResponseEntity.status(404).body(response);
            }
            
            double totalAmount = contract.getMonthlyTotalFee().doubleValue();
            
            // Tạo payment record
            int paymentId = paymentDao.createPayment(userId, totalAmount, method, "MONTHLY_BILLING", "SUCCESS");
            
            if (paymentId > 0) {
                // Process monthly billing (reset usage for next month)
                boolean billingProcessed = contractDao.processMonthlyBilling(contractId);
                
                Map<String, Object> paymentResult = new HashMap<>();
                paymentResult.put("paymentId", paymentId);
                paymentResult.put("contractId", contractId);
                paymentResult.put("userId", userId);
                paymentResult.put("amount", totalAmount);
                paymentResult.put("method", method);
                paymentResult.put("type", "MONTHLY_BILLING");
                paymentResult.put("status", "SUCCESS");
                paymentResult.put("billingMonth", contract.getCurrentMonth());
                paymentResult.put("distanceBilled", contract.getMonthlyDistance());
                paymentResult.put("baseFee", contract.getMonthlyBaseFee());
                paymentResult.put("overageFee", contract.getMonthlyOverageFee());
                paymentResult.put("processedAt", new Date());
                paymentResult.put("billingReset", billingProcessed);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Monthly payment processed successfully");
                response.put("data", paymentResult);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Failed to process monthly payment");
                return ResponseEntity.status(500).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error processing monthly payment: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/monthly-usage-summary/{contractId}")
    public ResponseEntity<?> getMonthlyUsageSummary(@PathVariable Integer contractId) {
        try {
            hsf302.fa25.s3.dao.ContractDao contractDao = new hsf302.fa25.s3.dao.ContractDao();
            hsf302.fa25.s3.dao.ServicePlanDao servicePlanDao = new hsf302.fa25.s3.dao.ServicePlanDao();
            
            hsf302.fa25.s3.model.Contract contract = contractDao.getContractById(contractId);
            
            if (contract != null) {
                // Tính toán latest fees
                contractDao.calculateAndUpdateMonthlyFees(contractId);
                contract = contractDao.getContractById(contractId); // Refresh data
                
                hsf302.fa25.s3.model.ServicePlan plan = servicePlanDao.getPlanById(contract.getPlanId());
                
                Map<String, Object> summary = new HashMap<>();
                summary.put("contractId", contractId);
                summary.put("currentMonth", contract.getCurrentMonth());
                summary.put("planName", plan != null ? plan.getPlanName() : "Unknown");
                summary.put("baseDistance", plan != null ? plan.getBaseDistance() : 0);
                summary.put("distanceUsed", contract.getMonthlyDistance());
                summary.put("overageDistance", contract.getMonthlyOverageDistance());
                
                // Tính % usage
                if (plan != null && !plan.isUnlimited() && plan.getBaseDistance() > 0) {
                    double usagePercent = contract.getMonthlyDistance().doubleValue() / plan.getBaseDistance() * 100;
                    summary.put("usagePercentage", Math.round(usagePercent * 100.0) / 100.0);
                } else {
                    summary.put("usagePercentage", plan != null && plan.isUnlimited() ? "Unlimited" : 0);
                }
                
                summary.put("baseFee", contract.getMonthlyBaseFee());
                summary.put("overageFee", contract.getMonthlyOverageFee());
                summary.put("totalFee", contract.getMonthlyTotalFee());
                summary.put("lastResetDate", contract.getLastResetDate());
                
                // Calculate current overage charge (if any)
                if (plan != null && !plan.isUnlimited() && 
                    contract.getMonthlyDistance().compareTo(java.math.BigDecimal.valueOf(plan.getBaseDistance())) > 0) {
                    // Calculate overage charge for distances beyond base
                    java.math.BigDecimal overageCharge = servicePlanDao.calculateOverageCharge(
                        contract.getMonthlyDistance().intValue(), plan.getBaseDistance());
                    summary.put("calculatedOverageCharge", overageCharge);
                } else {
                    summary.put("calculatedOverageCharge", 0);
                }
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", summary);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Contract not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching usage summary: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/current-bill-status/user/{userId}")
    public ResponseEntity<?> getCurrentBillStatus(@PathVariable String userId) {
        try {
            hsf302.fa25.s3.dao.ContractDao contractDao = new hsf302.fa25.s3.dao.ContractDao();
            hsf302.fa25.s3.dao.ServicePlanDao servicePlanDao = new hsf302.fa25.s3.dao.ServicePlanDao();
            
            // Get active contracts for user
            List<hsf302.fa25.s3.model.Contract> contracts = contractDao.getContractsByUserId(userId.toString());
            List<Map<String, Object>> billStatuses = new ArrayList<>();
            
            for (hsf302.fa25.s3.model.Contract contract : contracts) {
                if ("ACTIVE".equals(contract.getStatus())) {
                    // Calculate current fees
                    contractDao.calculateAndUpdateMonthlyFees(contract.getContractId());
                    
                    // Refresh contract data
                    hsf302.fa25.s3.model.Contract updatedContract = contractDao.getContractById(contract.getContractId());
                    hsf302.fa25.s3.model.ServicePlan plan = servicePlanDao.getPlanById(contract.getPlanId());
                    
                    Map<String, Object> billStatus = new HashMap<>();
                    billStatus.put("contractId", contract.getContractId());
                    billStatus.put("contractNumber", contract.getContractNumber());
                    billStatus.put("currentMonth", updatedContract.getCurrentMonth());
                    
                    if (plan != null) {
                        billStatus.put("planName", plan.getPlanName());
                        billStatus.put("planType", plan.getPlanName().toUpperCase());
                        billStatus.put("baseDistance", plan.getBaseDistance());
                        billStatus.put("basePrice", plan.getBasePrice());
                        billStatus.put("isUnlimited", plan.isUnlimited());
                    }
                    
                    billStatus.put("distanceUsed", updatedContract.getMonthlyDistance());
                    billStatus.put("baseFee", updatedContract.getMonthlyBaseFee());
                    billStatus.put("overageDistance", updatedContract.getMonthlyOverageDistance());
                    billStatus.put("overageFee", updatedContract.getMonthlyOverageFee());
                    billStatus.put("currentTotalFee", updatedContract.getMonthlyTotalFee());
                    
                    // Calculate progress percentage
                    if (plan != null && !plan.isUnlimited() && plan.getBaseDistance() > 0) {
                        double progress = updatedContract.getMonthlyDistance().doubleValue() / plan.getBaseDistance() * 100;
                        billStatus.put("usageProgress", Math.min(100.0, Math.round(progress * 100.0) / 100.0));
                        
                        if (progress > 80) {
                            billStatus.put("warningLevel", "HIGH");
                            billStatus.put("warningMessage", "Approaching distance limit");
                        } else if (progress > 60) {
                            billStatus.put("warningLevel", "MEDIUM");
                            billStatus.put("warningMessage", "Above 60% of monthly limit");
                        } else {
                            billStatus.put("warningLevel", "LOW");
                        }
                    } else if (plan != null && plan.isUnlimited()) {
                        billStatus.put("usageProgress", "UNLIMITED");
                        billStatus.put("warningLevel", "NONE");
                    }
                    
                    // Days remaining in current month
                    java.time.LocalDate now = java.time.LocalDate.now();
                    int daysInMonth = now.lengthOfMonth();
                    int currentDay = now.getDayOfMonth();
                    billStatus.put("daysRemainingInMonth", daysInMonth - currentDay);
                    
                    billStatuses.add(billStatus);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", billStatuses);
            response.put("totalActiveContracts", billStatuses.size());
            
            // Calculate total pending amount across all contracts
            double totalPending = billStatuses.stream()
                .mapToDouble(bill -> ((java.math.BigDecimal) bill.get("currentTotalFee")).doubleValue())
                .sum();
            response.put("totalPendingAmount", totalPending);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching bill status: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}