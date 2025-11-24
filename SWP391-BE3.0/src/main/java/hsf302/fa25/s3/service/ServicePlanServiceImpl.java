package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.ServicePlan;
import hsf302.fa25.s3.repository.ServicePlanRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class ServicePlanServiceImpl implements ServicePlanService {

    private final ServicePlanRepo planDao = new ServicePlanRepo();

    // ===== Helpers =====
    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }

    private static Integer asInt(Object o) {
        if (o == null) return null;
        if (o instanceof Integer i) return i;
        if (o instanceof Number n) return n.intValue();
        try { return Integer.parseInt(String.valueOf(o)); } catch (Exception e) { return null; }
    }

    private static BigDecimal asBigDecimal(Object o) {
        if (o == null) return null;
        if (o instanceof BigDecimal bd) return bd;
        try { return new BigDecimal(String.valueOf(o)); } catch (Exception e) { return null; }
    }

    // ============== LIST ==============
    @Override
    public ResponseEntity<?> listActivePlans(HttpServletRequest req) {
        try {
            List<ServicePlan> plans = planDao.getAllActivePlans();
            List<Map<String, Object>> data = new ArrayList<>();

            for (ServicePlan p : plans) {
                Map<String, Object> m = new HashMap<>();
                m.put("planId", p.getPlanId());
                m.put("planName", p.getPlanName());
                m.put("basePrice", p.getBasePrice());
                m.put("baseDistance", p.getBaseDistance());
                m.put("depositFee", p.getDepositFee());
                m.put("description", p.getDescription());
                m.put("isActive", p.isActive());
                m.put("isUnlimited", p.isUnlimited());
                data.add(m);
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "total", data.size(),
                    "data", data
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error: " + e.getMessage()
            ));
        }
    }

    // ============== ADD ==============
    @Override
    public ResponseEntity<?> addPlan(Map<String, Object> body) {
        try {
            String planName = body.get("planName") == null ? null : String.valueOf(body.get("planName"));
            BigDecimal basePrice = asBigDecimal(body.get("basePrice"));
            Integer baseDistance = asInt(body.get("baseDistance"));
            BigDecimal depositFee = asBigDecimal(body.get("depositFee"));
            String description = body.getOrDefault("description", null) == null
                    ? null : String.valueOf(body.get("description"));
            boolean active = body.get("active") == null
                    || Boolean.parseBoolean(String.valueOf(body.get("active")));

            // validate
            String error = null;
            if (isBlank(planName)) error = "planName is required";
            if (basePrice == null) error = "basePrice is invalid";
            if (baseDistance == null) error = "baseDistance is invalid";
            if (depositFee == null) error = "depositFee is invalid";
            if (error != null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", error
                ));
            }

            // tên trùng?
            if (planDao.existsByName(planName)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Plan name already exists"
                ));
            }

            ServicePlan p = new ServicePlan(planName, basePrice, baseDistance, depositFee, description);
            p.setActive(active);

            int newId = planDao.create(p);
            if (newId <= 0) {
                return ResponseEntity.status(500).body(Map.of(
                        "success", false,
                        "message", "Create failed"
                ));
            }

            Map<String, Object> data = new HashMap<>();
            data.put("planId", newId);
            data.put("planName", planName);
            data.put("basePrice", basePrice);
            data.put("baseDistance", baseDistance);
            data.put("depositFee", depositFee);
            data.put("description", description);
            data.put("isActive", active);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Created",
                    "data", data
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error: " + e.getMessage()
            ));
        }
    }

    // ============== UPDATE ==============
    @Override
    public ResponseEntity<?> updatePlan(Map<String, Object> body) {
        try {
            Integer planId = asInt(body.get("planId"));
            if (planId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "planId is required"
                ));
            }

            ServicePlan existing = planDao.getPlanById(planId);
            if (existing == null) {
                return ResponseEntity.status(404).body(Map.of(
                        "success", false,
                        "message", "Plan not found"
                ));
            }

            String planName = body.get("planName") == null
                    ? existing.getPlanName()
                    : String.valueOf(body.get("planName"));

            BigDecimal basePrice = body.get("basePrice") == null
                    ? existing.getBasePrice()
                    : asBigDecimal(body.get("basePrice"));

            Integer baseDistance = body.get("baseDistance") == null
                    ? existing.getBaseDistance()
                    : asInt(body.get("baseDistance"));

            BigDecimal depositFee = body.get("depositFee") == null
                    ? existing.getDepositFee()
                    : asBigDecimal(body.get("depositFee"));

            String description = body.get("description") == null
                    ? existing.getDescription()
                    : String.valueOf(body.get("description"));

            boolean active = body.get("active") == null
                    ? existing.isActive()
                    : Boolean.parseBoolean(String.valueOf(body.get("active")));

            // validate nhẹ
            String error = null;
            if (isBlank(planName)) error = "planName is required";
            if (basePrice == null) error = "basePrice is invalid";
            if (baseDistance == null) error = "baseDistance is invalid";
            if (depositFee == null) error = "depositFee is invalid";
            if (error != null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", error
                ));
            }

            ServicePlan toUpdate = new ServicePlan();
            toUpdate.setPlanId(planId);
            toUpdate.setPlanName(planName);
            toUpdate.setBasePrice(basePrice);
            toUpdate.setBaseDistance(baseDistance);
            toUpdate.setDepositFee(depositFee);
            toUpdate.setDescription(description);
            toUpdate.setActive(active);

            boolean ok = planDao.update(toUpdate);
            if (!ok) {
                return ResponseEntity.status(500).body(Map.of(
                        "success", false,
                        "message", "Update failed"
                ));
            }

            Map<String, Object> data = new HashMap<>();
            data.put("planId", planId);
            data.put("planName", planName);
            data.put("basePrice", basePrice);
            data.put("baseDistance", baseDistance);
            data.put("depositFee", depositFee);
            data.put("description", description);
            data.put("isActive", active);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Updated",
                    "data", data
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error: " + e.getMessage()
            ));
        }
    }

    // ============== DELETE (soft) ==============
    @Override
    public ResponseEntity<?> deletePlan(Map<String, Object> body) {
        try {
            Integer id = asInt(body.get("planId"));
            if (id == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "id is required"
                ));
            }

            ServicePlan existing = planDao.getPlanById(id);
            if (existing == null) {
                return ResponseEntity.status(404).body(Map.of(
                        "success", false,
                        "message", "Plan not found"
                ));
            }

            boolean ok = planDao.deactivate(id);
            if (!ok) {
                return ResponseEntity.status(500).body(Map.of(
                        "success", false,
                        "message", "Delete failed"
                ));
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Deactivated"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Error: " + e.getMessage()
            ));
        }
    }
}
