package hsf302.fa25.s3.model;

import lombok.*;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString

public class VehicleBatteryInfo {
    private int vehicleId;
    private String userId; // Add userId field for admin management
    private String plateNumber;
    private String vehicleModel;
    private String vinNumber;
    private String batteryType;
    private String compatibleBatteryTypes;
    private Timestamp createdAt;
    private Integer batteryId; // Change to Integer to allow null values
    private String batteryModel;
    private Double health;
    private Double currentOdometer;
    private Integer contractId;// Thêm field quãng đường hiện tại
}
