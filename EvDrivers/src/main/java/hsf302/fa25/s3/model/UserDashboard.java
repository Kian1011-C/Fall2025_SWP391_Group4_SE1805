package hsf302.fa25.s3.model;

import lombok.*;
import java.sql.Timestamp;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UserDashboard {
    // Thông tin người dùng
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;

    // Thông tin hợp đồng
    private String contractNumber;
    private String contractStatus;
    private Timestamp contractStartDate;
    private Timestamp contractEndDate;

    // Thông tin xe
    private String vehiclePlate;
    private String vehicleModel;

    // Thông tin pin
    private String batteryModel;
    private Double batteryHealth;
    private String batteryStatus;

    // Thống kê dashboard
    private Integer totalSwaps; // Tổng số lần đổi pin thành công
    private Double totalDistance; // Tổng quãng đường đã đi (km)

    private Timestamp lastUpdated; // để log thời điểm cập nhật dashboard
}
