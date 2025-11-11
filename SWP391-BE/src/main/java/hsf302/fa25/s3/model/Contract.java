package hsf302.fa25.s3.model;

import java.sql.Timestamp;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class Contract {
    private int contractId;
    private int vehicleId;
    private int planId;
    private Timestamp startDate;
    private Timestamp endDate;
    private String status;
    private String contractNumber;
    private Timestamp signedDate;
    private String signedPlace;
    // Thông tin usage tháng hiện tại
    private String currentMonth; // Format: 'YYYY-MM'
    private java.math.BigDecimal monthlyDistance; // Tổng quãng đường tháng hiện tại (km)
    private java.math.BigDecimal monthlyBaseFee; // Phí cơ sở tháng hiện tại
    private java.math.BigDecimal monthlyOverageDistance; // Quãng đường vượt mức
    private java.math.BigDecimal monthlyOverageFee; // Phí vượt tháng hiện tại
    private java.math.BigDecimal monthlyTotalFee; // Tổng phí tháng hiện tại
    private Timestamp lastResetDate; // Lần cuối reset usage
    private Timestamp createdAt;
}
