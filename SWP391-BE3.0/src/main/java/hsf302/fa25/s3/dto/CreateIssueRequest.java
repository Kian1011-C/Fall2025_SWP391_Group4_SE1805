package hsf302.fa25.s3.dto;

import lombok.Data;

@Data
public class CreateIssueRequest {
    private String userId;      // ví dụ: "driver001"
    private Integer stationId;  // id trạm
    private String description; // nội dung phản ánh
}