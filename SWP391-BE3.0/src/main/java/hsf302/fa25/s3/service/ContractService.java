package hsf302.fa25.s3.service;

import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface ContractService {

    ResponseEntity<?> createContract(Map<String, Object> body);

    ResponseEntity<?> getAllContracts(String status,
                                      String userId,
                                      Integer planId,
                                      int page,
                                      int size);

    ResponseEntity<?> getUserContracts(String userId);

    ResponseEntity<?> updateContract(Long contractId, Map<String, Object> updates);


    ResponseEntity<?> getAvailablePlans();

    ResponseEntity<?> processMonthlyBilling(Integer contractId);

    ResponseEntity<?> getMonthlyBillingReport(String monthYear);

    ResponseEntity<?> autoResetMonth();

    ResponseEntity<?> getVehiclePlan(int vehicleId);
}
