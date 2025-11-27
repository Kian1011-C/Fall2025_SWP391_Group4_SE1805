package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.service.ContractService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @PostMapping
    public ResponseEntity<?> createContract(@RequestBody Map<String, Object> body) {
        Map<String, Object> result = contractService.createContract(body);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<?> getAllContracts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) Integer planId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "50") int size) {

        Map<String, Object> result = contractService.getAllContracts(status, userId, planId, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getContracts(@PathVariable String userId) {
        // service trả List<Map<...>>
        List<Map<String, Object>> data = contractService.getUserContracts(userId);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", data);
        res.put("total", data.size());

        return ResponseEntity.ok(res);
    }

    @PutMapping("/{contractId}")
    public ResponseEntity<?> updateContract(@PathVariable Long contractId,
                                            @RequestBody Map<String, Object> updates) {
        Map<String, Object> result = contractService.updateContract(contractId, updates);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/plans")
    public ResponseEntity<?> getAvailablePlans() {
        // service trả List<Map<...>>
        List<Map<String, Object>> data = contractService.getAvailablePlans();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", data);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/{contractId}/billing")
    public ResponseEntity<?> processMonthlyBilling(@PathVariable Integer contractId) {
        Map<String, Object> result = contractService.processMonthlyBilling(contractId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/billing-report/{monthYear}")
    public ResponseEntity<?> getMonthlyBillingReport(@PathVariable String monthYear) {
        // service trả List<Map<...>> từ DAO
        List<Map<String, Object>> reports = contractService.getMonthlyBillingReport(monthYear);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", reports);
        res.put("month", monthYear);
        res.put("totalContracts", reports.size());

        BigDecimal totalRevenue = reports.stream()
                .map(r -> (BigDecimal) r.get("monthlyTotalFee"))
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        res.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/auto-reset-month")
    public ResponseEntity<?> autoResetMonth() {
        Map<String, Object> result = contractService.autoResetMonth();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/vehicle/{vehicleId}/plan")
    public ResponseEntity<?> getVehiclePlan(@PathVariable int vehicleId) {
        Map<String, Object> result = contractService.getVehiclePlan(vehicleId);
        return ResponseEntity.ok(result);
    }
}
