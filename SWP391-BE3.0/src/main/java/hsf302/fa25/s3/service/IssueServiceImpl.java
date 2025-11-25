package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Issue;
import hsf302.fa25.s3.repository.IssueRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueServiceImpl implements IssueService {

    private final IssueRepo issueRepo;

    public IssueServiceImpl(IssueRepo issueRepo) {
        this.issueRepo = issueRepo;
    }

    @Override
    public boolean createIssue(String userId, Long stationId, String description) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (stationId == null) {
            throw new IllegalArgumentException("Station ID is required");
        }
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("Description is required");
        }
        
        return issueRepo.insert(userId, stationId.intValue(), description);
    }

    @Override
    public List<Issue> listIssuesByVisibility(String role, String userId) {
        boolean isDriver = "EV Driver".equalsIgnoreCase(role);
        
        if (!(isDriver || "Staff".equalsIgnoreCase(role) || "Admin".equalsIgnoreCase(role))) {
            throw new IllegalArgumentException("Invalid role");
        }
        
        if (isDriver && (userId == null || userId.isBlank())) {
            throw new IllegalArgumentException("EV Driver must provide userId");
        }

        return issueRepo.listByVisibility(role, userId);
    }
}
