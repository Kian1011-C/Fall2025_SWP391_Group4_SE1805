package hsf302.fa25.s3.model;

import lombok.*;

import java.sql.Timestamp;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class Vehicle {
    private int vehicleId;
    private String userId; // Changed to String to match Users.user_id
    private String plateNumber;
    private String model;
    private String vinNumber;
    private String batteryType;
    private String compatibleBatteryTypes;
    private Integer currentBatteryId; // Pin hiện tại đang gắn vào xe
    private java.math.BigDecimal currentOdometer; // Số km hiện tại của xe
    private Timestamp createdAt;
}
