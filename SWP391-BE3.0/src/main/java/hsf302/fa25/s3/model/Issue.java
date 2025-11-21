package hsf302.fa25.s3.model;

import java.sql.Timestamp;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Issue {
    private int issueId;
    private String userId;
    private int stationId;
    private String description;
    private String status;
    private Timestamp createdAt;
}
