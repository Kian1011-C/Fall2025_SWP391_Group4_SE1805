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
    private int swapId;
    private String userId;
    private int contractId;
    private int stationId;
    private int towerId;
    private int staffId;
    private int oldBatteryId;
    private int newBatteryId;
    private double odometerBefore;
    private double odometerAfter;
    private double distanceUsed;
    private Timestamp swapTime;
    private String swapStatus;
    private int paymentId;
}
