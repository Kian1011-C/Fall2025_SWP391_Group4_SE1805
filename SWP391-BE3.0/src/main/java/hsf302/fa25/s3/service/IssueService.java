package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Issue;
import java.util.List;

public interface IssueService {
    boolean createIssue(String userId, Long stationId, String description);
    List<Issue> listIssuesByVisibility(String role, String userId);
}
