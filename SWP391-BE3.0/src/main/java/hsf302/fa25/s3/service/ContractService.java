package hsf302.fa25.s3.service;

import java.util.List;
import java.util.Map;

public interface ContractService {

    Map<String, Object> createContract(Map<String, Object> body);

    Map<String, Object> getAllContracts(String status,
                                        String userId,
                                        Integer planId,
                                        int page,
                                        int size);

    List<Map<String, Object>> getUserContracts(String userId);

    Map<String, Object> updateContract(Long contractId, Map<String, Object> updates);

    List<Map<String, Object>> getAvailablePlans();

    Map<String, Object> processMonthlyBilling(Integer contractId);

    List<Map<String, Object>> getMonthlyBillingReport(String monthYear);

    Map<String, Object> autoResetMonth();

    Map<String, Object> getVehiclePlan(int vehicleId);
}
