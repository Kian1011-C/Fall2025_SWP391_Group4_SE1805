package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Issue;
import hsf302.fa25.s3.repository.IssueRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueServiceImpl implements IssueService {

    private final IssueRepo issueRepo;

    @Override
    public boolean createIssue(String userId, int stationId, String description) {
        // Có thể thêm rule nghiệp vụ ở đây sau này
        return issueRepo.insert(userId, stationId, description);
    }

    @Override
    public List<Issue> listIssuesByVisibility(String role, String userIdIfDriver) {
        // Logic quyền vẫn nằm ở repo như cũ
        return issueRepo.listByVisibility(role, userIdIfDriver);
    }
}
