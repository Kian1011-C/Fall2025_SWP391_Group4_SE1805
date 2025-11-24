package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Issue;

import java.util.List;

public interface IssueService {

    /** Tạo issue mới, trả về true/false giống insert() cũ */
    boolean createIssue(String userId, int stationId, String description);

    /**
     * Lấy danh sách issue theo quyền:
     * - role = EV Driver -> cần userId, chỉ xem của mình
     * - Staff/Admin      -> xem tất cả
     */
    List<Issue> listIssuesByVisibility(String role, String userIdIfDriver);
}
