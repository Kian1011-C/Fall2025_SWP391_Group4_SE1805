package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dto.CreateIssueRequest;
import hsf302.fa25.s3.model.Issue;
import hsf302.fa25.s3.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/issues")
public class IssueController {

    // Đổi từ IssueRepo -> IssueService
    private final IssueService issueService;

    /** 1) Tạo feedback (Driver gọi) */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateIssueRequest req) {
        // ✅ Giữ nguyên validate & status code như cũ
        if (req.getUserId() == null || req.getUserId().isBlank()
                || req.getStationId() == null
                || req.getDescription() == null || req.getDescription().isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", "Thiếu dữ liệu bắt buộc"
                    ));
        }

        boolean ok = issueService.createIssue(
                req.getUserId(),
                req.getStationId(),
                req.getDescription()
        );

        return ResponseEntity.ok(Map.of("success", ok));
    }

    /**
     * 2) List feedback
     * - role=EV Driver => bắt buộc truyền userId (chỉ xem của mình)
     * - role=Staff/Admin => xem tất cả, không cần userId
     */
    @GetMapping
    public ResponseEntity<?> list(@RequestParam String role,
                                  @RequestParam(required = false) String userId) {

        boolean isDriver = "EV Driver".equalsIgnoreCase(role);
        if (!(isDriver || "Staff".equalsIgnoreCase(role) || "Admin".equalsIgnoreCase(role))) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "role không hợp lệ")
            );
        }
        if (isDriver && (userId == null || userId.isBlank())) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "EV Driver phải truyền userId")
            );
        }


        List<Issue> items = issueService.listIssuesByVisibility(role, userId);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("items", items);
        return ResponseEntity.ok(res);
    }
}
