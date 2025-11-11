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
    private String plateNumber;
    private String vehicleModel;
    private String vinNumber;
    private String batteryType;
    private String compatibleBatteryTypes;
    private Timestamp createdAt;
    private int batteryId;
    private String batteryModel;
    private Double health;
    private Double currentOdometer; // Thêm field quãng đường hiện tại
}
