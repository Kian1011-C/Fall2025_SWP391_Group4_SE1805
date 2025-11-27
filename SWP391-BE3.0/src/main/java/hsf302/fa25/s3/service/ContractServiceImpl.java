package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Contract;
import hsf302.fa25.s3.model.ServicePlan;
import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.repository.ContractRepo;
import hsf302.fa25.s3.repository.ServicePlanRepo;
import hsf302.fa25.s3.repository.UserRepo;
import hsf302.fa25.s3.utils.ConnectDB;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
public class ContractServiceImpl implements ContractService {

    private final ContractRepo contractDao = new ContractRepo();
    private final ServicePlanRepo servicePlanDao = new ServicePlanRepo();
    private final UserRepo userDao = new UserRepo();

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
        try {
            return Integer.parseInt(String.valueOf(o));
        } catch (Exception e) {
            return null;
        }
    }

    // ==================== CREATE CONTRACT ====================
    @Override
    public Map<String, Object> createContract(Map<String, Object> body) {
        Map<String, Object> res = new HashMap<>();
        try {
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
                return res;
            }

            LocalDate s, e;
            try {
                s = LocalDate.parse(startDate);
                e = LocalDate.parse(endDate);
            } catch (DateTimeParseException ex) {
                res.put("success", false);
                res.put("message", "Định dạng ngày không hợp lệ. Dùng yyyy-MM-dd.");
                return res;
            }
            if (e.isBefore(s)) {
                res.put("success", false);
                res.put("message", "endDate phải >= startDate.");
                return res;
            }

            // User phải tồn tại & active
            User u = userDao.getUserById(userId);
            if (u == null || !"active".equalsIgnoreCase(u.getStatus())) {
                res.put("success", false);
                res.put("message", "Tài khoản không tồn tại hoặc chưa kích hoạt.");
                return res;
            }

            // Xe phải thuộc user
            if (!contractDao.vehicleBelongsToUser(vehicleId, userId)) {
                res.put("success", false);
                res.put("message", "Xe không thuộc về người dùng " + userId + ".");
                return res;
            }

            // Xác định planId (ưu tiên planId, fallback planName)
            Integer finalPlanId = planId;
            if (finalPlanId == null) {
                if (isBlank(planName)) {
                    res.put("success", false);
                    res.put("message", "Thiếu planId hoặc planName.");
                    return res;
                }
                finalPlanId = contractDao.getPlanIdByName(planName);
                if (finalPlanId == null) {
                    res.put("success", false);
                    res.put("message", "Không tìm thấy gói dịch vụ đang active: " + planName);
                    return res;
                }
            }

            // Chặn overlap với hợp đồng active
            java.sql.Date ds = java.sql.Date.valueOf(s);
            java.sql.Date de = java.sql.Date.valueOf(e);
            if (contractDao.hasActiveOverlap(vehicleId, ds, de)) {
                res.put("success", false);
                res.put("message", "Xe đã có hợp đồng active trùng/đè khoảng thời gian này.");
                return res;
            }

            // Tạo hợp đồng
            int contractId = contractDao.createContract(
                    vehicleId, finalPlanId, ds, de,
                    isBlank(signedPlace) ? "Hà Nội" : signedPlace
            );
            if (contractId <= 0) {
                res.put("success", false);
                res.put("message", "Tạo hợp đồng thất bại.");
                return res;
            }

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
            return res;

        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "Lỗi hệ thống: " + e.getMessage());
            return res;
        }
    }

    // ==================== GET ALL CONTRACTS (filter + paging) ====================
    @Override
    public Map<String, Object> getAllContracts(String status,
                                               String userId,
                                               Integer planId,
                                               int page,
                                               int size) {
        Map<String, Object> response = new HashMap<>();
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
            if (!isBlank(status)) {
                sql.append(" AND c.status = ?");
                params.add(status);
            }
            if (!isBlank(userId)) {
                sql.append(" AND v.user_id = ?");
                params.add(userId);
            }
            if (planId != null) {
                sql.append(" AND c.plan_id = ?");
                params.add(planId);
            }
            sql.append(" ORDER BY c.contract_id DESC");

            List<Map<String, Object>> allContracts = new ArrayList<>();

            try (Connection conn = ConnectDB.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql.toString())) {

                for (int i = 0; i < params.size(); i++) {
                    ps.setObject(i + 1, params.get(i));
                }

                java.sql.ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> contractMap = new LinkedHashMap<>();

                    contractMap.put("contractId", rs.getInt("contract_id"));
                    contractMap.put("contractNumber", rs.getString("contract_number"));
                    contractMap.put("status", rs.getString("status"));
                    contractMap.put("startDate", rs.getDate("start_date"));
                    contractMap.put("endDate", rs.getDate("end_date"));
                    contractMap.put("signedPlace", rs.getString("signed_place"));
                    contractMap.put("monthlyDistance", rs.getBigDecimal("monthly_distance"));
                    contractMap.put("monthlyBaseFee", rs.getBigDecimal("monthly_base_fee"));

                    contractMap.put("planId", rs.getInt("plan_id"));
                    contractMap.put("planName", rs.getString("plan_name"));

                    contractMap.put("vehicleId", rs.getInt("vehicle_id"));
                    contractMap.put("plateNumber", rs.getString("plate_number"));
                    contractMap.put("vehicleModel", rs.getString("vehicle_model"));

                    contractMap.put("userId", rs.getString("user_id"));
                    contractMap.put("firstName", rs.getString("first_name"));
                    contractMap.put("lastName", rs.getString("last_name"));
                    contractMap.put("email", rs.getString("email"));
                    contractMap.put("phone", rs.getString("phone"));

                    allContracts.add(contractMap);
                }
            }

            int start = page * size;
            int end = Math.min(start + size, allContracts.size());
            List<Map<String, Object>> paginatedContracts =
                    start >= allContracts.size() ? List.of() : allContracts.subList(start, end);

            response.put("success", true);
            response.put("data", paginatedContracts);
            response.put("total", allContracts.size());
            response.put("page", page);
            response.put("size", size);
            response.put("totalPages", (allContracts.size() + size - 1) / size);

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Error fetching contracts: " + e.getMessage());
            return response;
        }
    }

    // ==================== GET CONTRACTS BY USER ====================
    @Override
    public List<Map<String, Object>> getUserContracts(String userId) {
        List<Map<String, Object>> contractMaps = new ArrayList<>();
        try {
            List<Contract> contracts = contractDao.getContractsByUserId(userId);

            for (Contract contract : contracts) {
                ServicePlan plan = servicePlanDao.getPlanById(contract.getPlanId());

                Map<String, Object> contractMap = new HashMap<>();
                contractMap.put("contractId", contract.getContractId());
                contractMap.put("vehicleId", contract.getVehicleId());
                contractMap.put("contractNumber", contract.getContractNumber());
                contractMap.put("status", contract.getStatus());
                contractMap.put("startDate", contract.getStartDate());
                contractMap.put("endDate", contract.getEndDate());

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
                    contractMap.put("planType", "UNKNOWN");
                    contractMap.put("planName", "Unknown Plan");
                    contractMap.put("monthlyFee", 0);
                }

                contractMap.put("usedSwaps", 0); // TODO: nếu có bảng Swaps
                contractMap.put("usedDistance", contract.getMonthlyDistance());
                contractMap.put("monthlyBaseFee", contract.getMonthlyBaseFee());
                contractMap.put("monthlyOverageFee", contract.getMonthlyOverageFee());
                contractMap.put("monthlyTotalFee", contract.getMonthlyTotalFee());
                contractMap.put("currentMonth", contract.getCurrentMonth());

                contractMaps.add(contractMap);
            }
        } catch (Exception e) {
            e.printStackTrace();
            // có thể log, hiện tại trả về danh sách rỗng khi lỗi
        }
        return contractMaps;
    }

    // ==================== UPDATE  ====================
    @Override
    public Map<String, Object> updateContract(Long contractId, Map<String, Object> updates) {
        // TODO: sau này implement thật với DB
        Map<String, Object> updatedContract = new HashMap<>();
        updatedContract.put("contractId", contractId);
        updatedContract.putAll(updates);
        updatedContract.put("updatedAt", new Date());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Contract updated successfully");
        response.put("data", updatedContract);

        return response;
    }

    // ==================== PLANS ====================
    @Override
    public List<Map<String, Object>> getAvailablePlans() {
        List<Map<String, Object>> plans = new ArrayList<>();
        try {
            List<ServicePlan> servicePlans = servicePlanDao.getAllActivePlans();

            for (ServicePlan plan : servicePlans) {
                Map<String, Object> planMap = new HashMap<>();
                planMap.put("planId", plan.getPlanId());
                planMap.put("planName", plan.getPlanName());
                planMap.put("name", plan.getPlanName() + " Plan");
                planMap.put("basePrice", plan.getBasePrice());
                planMap.put("monthlyFee", plan.getBasePrice());
                planMap.put("baseDistance", plan.getBaseDistance());
                planMap.put("depositFee", plan.getDepositFee());
                planMap.put("description", plan.getDescription());
                planMap.put("isUnlimited", plan.isUnlimited());

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
        } catch (Exception e) {
            e.printStackTrace();
        }
        return plans;
    }

    // ==================== BILLING / REPORT / RESET ====================
    @Override
    public Map<String, Object> processMonthlyBilling(Integer contractId) {
        Map<String, Object> response = new HashMap<>();
        try {
            contractDao.calculateAndUpdateMonthlyFees(contractId);
            boolean success = contractDao.processMonthlyBilling(contractId);

            response.put("success", success);
            response.put("message", success ?
                    "Monthly billing processed successfully" :
                    "Failed to process monthly billing");
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error processing monthly billing: " + e.getMessage());
            return response;
        }
    }

    @Override
    public List<Map<String, Object>> getMonthlyBillingReport(String monthYear) {
        try {
            // Trả thẳng danh sách report từ DAO
            return contractDao.getMonthlyBillingReport(monthYear);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Override
    public Map<String, Object> autoResetMonth() {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean success = contractDao.checkAndResetIfNewMonth();
            response.put("success", success);
            response.put("message", success ?
                    "All contracts reset to new month successfully" :
                    "Some contracts failed to reset");
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error resetting contracts: " + e.getMessage());
            return response;
        }
    }

    // ==================== VEHICLE PLAN ====================
    @Override
    public Map<String, Object> getVehiclePlan(int vehicleId) {
        Map<String, Object> result = new HashMap<>();
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

            try (Connection conn = ConnectDB.getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {
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

                    int baseDistance = rs.getInt("base_distance");
                    if (baseDistance == -1) {
                        planInfo.put("isUnlimited", true);
                        planInfo.put("limitInfo", "Không giới hạn");
                    } else {
                        planInfo.put("isUnlimited", false);
                        planInfo.put("limitInfo", baseDistance + " km/tháng");
                    }

                    result.put("success", true);
                    result.put("data", planInfo);
                } else {
                    result.put("success", false);
                    result.put("message", "Không tìm thấy gói thuê pin cho xe này");
                }
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error: " + e.getMessage());
        }
        return result;
    }
}
