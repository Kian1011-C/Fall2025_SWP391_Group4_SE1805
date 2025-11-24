package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.service.ContractService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @PostMapping
    public ResponseEntity<?> createContract(@RequestBody Map<String, Object> body) {
        return contractService.createContract(body);
    }

    @GetMapping
    public ResponseEntity<?> getAllContracts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) Integer planId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "50") int size) {
        return contractService.getAllContracts(status, userId, planId, page, size);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getContracts(@PathVariable String userId) {
        return contractService.getUserContracts(userId);
    }

    @PutMapping("/{contractId}")
    public ResponseEntity<?> updateContract(@PathVariable Long contractId,
                                            @RequestBody Map<String, Object> updates) {
        return contractService.updateContract(contractId, updates);
    }

    @GetMapping("/plans")
    public ResponseEntity<?> getAvailablePlans() {
        return contractService.getAvailablePlans();
    }

    @PostMapping("/{contractId}/billing")
    public ResponseEntity<?> processMonthlyBilling(@PathVariable Integer contractId) {
        return contractService.processMonthlyBilling(contractId);
    }

    @GetMapping("/billing-report/{monthYear}")
    public ResponseEntity<?> getMonthlyBillingReport(@PathVariable String monthYear) {
        return contractService.getMonthlyBillingReport(monthYear);
    }

    @PostMapping("/auto-reset-month")
    public ResponseEntity<?> autoResetMonth() {
        return contractService.autoResetMonth();
    }

    @GetMapping("/vehicle/{vehicleId}/plan")
    public ResponseEntity<?> getVehiclePlan(@PathVariable int vehicleId) {
        return contractService.getVehiclePlan(vehicleId);
    }
}
