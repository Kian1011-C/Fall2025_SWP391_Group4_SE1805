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
    private String userId;          // FK -> Users.user_id (VARCHAR(50))
    private Integer contractId;     // nullable
    private double amount;          // DECIMAL(10,2)
    private String method;          // 'QR' (dùng tạm cho VNPay)
    private String status;          // 'success' | 'failed' | 'refund' | (nếu thêm 'pending' thì dùng pending)
    private String currency;        // 'VND'
    private String transactionRef;  // NVARCHAR(100)

    private Long   vnpAmount;           // BIGINT raw *100
    private String vnpResponseCode;     // 00
    private String vnpTransactionNo;
    private String vnpBankCode;
    private String vnpBankTranNo;
    private String vnpCardType;
    private Timestamp vnpPayDate;       // convert yyyyMMddHHmmss
    private String vnpOrderInfo;
    private String vnpTransactionStatus; // 00
    private boolean ipnVerified;
    private String returnRaw;
    private String ipnRaw;

    private Timestamp createdAt;
}