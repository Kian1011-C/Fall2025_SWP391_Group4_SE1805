package hsf302.fa25.s3.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface ServicePlanService {

    ResponseEntity<?> listActivePlans(HttpServletRequest req);

    ResponseEntity<?> addPlan(Map<String, Object> body);

    ResponseEntity<?> updatePlan(Map<String, Object> body);

    ResponseEntity<?> deletePlan(Map<String, Object> body);
}
