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

    private final IssueService issueService;

    /** 1) Tạo feedback (Driver gọi) */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateIssueRequest req) {
        try {
            boolean ok = issueService.createIssue(req.getUserId(), Long.valueOf(req.getStationId()), req.getDescription());
            return ResponseEntity.ok(Map.of("success", ok));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * 2) List feedback
     * - role=EV Driver => bắt buộc truyền userId (chỉ xem của mình)
     * - role=Staff/Admin => xem tất cả, không cần userId
     */
    @GetMapping
    public ResponseEntity<?> list(@RequestParam String role,
                                  @RequestParam(required = false) String userId) {
        try {
            List<Issue> items = issueService.listIssuesByVisibility(role, userId);

            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("items", items);
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}