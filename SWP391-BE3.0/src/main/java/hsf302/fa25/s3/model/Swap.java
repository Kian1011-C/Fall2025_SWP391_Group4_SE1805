package hsf302.fa25.s3.model;

import java.sql.Timestamp;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Swap {
    private Integer swapId;
    private String userId;
    private Integer contractId;
    private Integer vehicleId;
    private Integer stationId;
    private Integer towerId;
    private String staffId;
    private Integer oldBatteryId;
    private Integer newBatteryId;
    private Double odometerBefore;
    private Double odometerAfter;
    private Double distanceUsed;
    // prefer explicit swapDate matching DB column swap_date
    private Timestamp swapDate;
    private String swapStatus;
}
