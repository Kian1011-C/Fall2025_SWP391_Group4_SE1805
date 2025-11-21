package hsf302.fa25.s3.model;

import java.sql.Timestamp;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Battery {
    private int batteryId;
    private String model;
    private int capacity;
    private double stateOfHealth;
    private String status;
    private Integer slotId;
    private Timestamp lastMaintenanceDate;
    private int cycleCount;
    private java.math.BigDecimal totalDistance; // Tổng quãng đường pin đã đi (km)
}
