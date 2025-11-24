package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.service.ServicePlanService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/serviceplan")
public class ServicePlanController {

    private final ServicePlanService servicePlanService;

    public ServicePlanController(ServicePlanService servicePlanService) {
        this.servicePlanService = servicePlanService;
    }

    // ============== LIST ==============
    @GetMapping("/list")
    public ResponseEntity<?> listActivePlans(HttpServletRequest req) {
        return servicePlanService.listActivePlans(req);
    }

    // ============== ADD ==============
    @PostMapping("/add")
    public ResponseEntity<?> addPlan(@RequestBody Map<String, Object> body) {
        return servicePlanService.addPlan(body);
    }

    // ============== UPDATE ==============
    @PostMapping("/update")
    public ResponseEntity<?> updatePlan(@RequestBody Map<String, Object> body) {
        return servicePlanService.updatePlan(body);
    }

    // ============== DELETE (soft) ==============
    @PostMapping("/delete")
    public ResponseEntity<?> deletePlan(@RequestBody Map<String, Object> body) {
        return servicePlanService.deletePlan(body);
    }
}
