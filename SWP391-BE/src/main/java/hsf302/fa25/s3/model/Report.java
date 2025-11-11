package hsf302.fa25.s3.model;

import java.sql.Timestamp;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    private int reportId;
    private int stationId;
    private Timestamp date;
    private int totalSwaps;
    private double revenue;
    private String issues;
}
