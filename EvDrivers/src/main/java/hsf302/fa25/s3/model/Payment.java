package hsf302.fa25.s3.model;

import java.sql.Timestamp;
import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    private int paymentId;
    private String userId;
    private int contractId;
    private double amount;
    private String method;
    private String status;
    private String currency;
    private String transactionRef;
    private Timestamp createdAt;
}
