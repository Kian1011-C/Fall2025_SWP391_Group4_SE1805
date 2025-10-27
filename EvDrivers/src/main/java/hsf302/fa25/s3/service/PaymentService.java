package hsf302.fa25.s3.service;

import hsf302.fa25.s3.config.VNPayConfig;
import hsf302.fa25.s3.dao.PaymentDao;
import hsf302.fa25.s3.model.Payment;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {
    // TODO: nên chuyển PaymentDao thành Spring Bean và inject
    private final PaymentDao paymentDao = new PaymentDao();
    private final VNPayConfig vnpay;

    public PaymentService(VNPayConfig vnpay) {
        this.vnpay = vnpay;
    }

    private Timestamp parsePayDate(String ymdHMS) {
        if (ymdHMS == null || ymdHMS.isEmpty()) return null;
        try {
            var sdf = new SimpleDateFormat("yyyyMMddHHmmss");
            return new Timestamp(sdf.parse(ymdHMS).getTime());
        } catch (ParseException e) {
            return null;
        }
    }

    private String toRaw(Map<String, String> map) {
        StringBuilder sb = new StringBuilder();
        map.forEach((k, v) -> {
            if (sb.length() > 0) sb.append('&');
            sb.append(k).append('=').append(v);
        });
        return sb.toString();
    }

    /** Tạo URL thanh toán + lưu bản ghi PENDING */
    public String createPaymentUrl(String userId, Integer contractId, double amount, String clientIp) throws Exception {
        String txnRef = vnpay.generateTxnRef();

        Payment p = Payment.builder()
                .userId(userId)
                .contractId(contractId)
                .amount(amount)
                .method("QR")
                .status("failed") // ✅ pending
                .currency("VND")
                .transactionRef(txnRef)
                .build();
        paymentDao.insertPending(p);

        // ✅ VNP yêu cầu VND x 100 (integer)
        String vnpAmount = BigDecimal.valueOf(amount)
                .multiply(new BigDecimal("100"))
                .setScale(0, RoundingMode.UNNECESSARY)
                .toPlainString();

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnpay.getVnp_TmnCode());
        params.put("vnp_Amount", vnpAmount);
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh toan hop dong " + (contractId == null ? "khong xac dinh" : contractId));
        params.put("vnp_OrderType", "other");
        params.put("vnp_ReturnUrl", vnpay.getVnp_ReturnUrl());
        params.put("vnp_IpAddr", (clientIp == null || clientIp.isBlank()) ? "127.0.0.1" : clientIp);
        params.put("vnp_CreateDate", vnpay.getPayDateNow());
        params.put("vnp_Locale", "vn");
        // Optional: params.put("vnp_ExpireDate", ...);
        // Optional: params.put("vnp_BankCode", "NCB");

        return vnpay.buildPayUrl(params);
    }

    /** Xử lý trang Return (người dùng quay về) */
    public Payment handleReturn(Map<String, String> queryParams) {
        Map<String, String> params = new HashMap<>();
        queryParams.forEach((k, v) -> params.put(k, v == null ? null : URLDecoder.decode(v, StandardCharsets.UTF_8)));

        boolean okSign = vnpay.validateSignature(params);
        String txnRef = params.get("vnp_TxnRef");
        Payment exist = paymentDao.findByTxnRef(txnRef);
        if (exist == null) return null;

        String rspCode    = params.get("vnp_ResponseCode");      // "00" success
        String transStt   = params.get("vnp_TransactionStatus"); // "00" success (thường có)
        String status = (okSign && "00".equals(rspCode) && "00".equals(transStt)) ? "success" : "failed";

        Payment update = new Payment();
        update.setTransactionRef(txnRef);
        update.setStatus(status);

        String amountStr = params.get("vnp_Amount");
        if (amountStr != null && !amountStr.isEmpty()) {
            try { update.setVnpAmount(Long.parseLong(amountStr)); } catch (NumberFormatException ignored) {}
        }
        update.setVnpResponseCode(rspCode);
        update.setVnpTransactionNo(params.get("vnp_TransactionNo"));
        update.setVnpBankCode(params.get("vnp_BankCode"));
        update.setVnpBankTranNo(params.get("vnp_BankTranNo"));
        update.setVnpCardType(params.get("vnp_CardType"));
        update.setVnpPayDate(parsePayDate(params.get("vnp_PayDate")));
        update.setVnpOrderInfo(params.get("vnp_OrderInfo"));
        update.setVnpTransactionStatus(transStt);
        update.setReturnRaw(toRaw(queryParams));

        paymentDao.updateReturn(update);
        return paymentDao.findByTxnRef(txnRef);
    }

    /** Xử lý IPN (server-to-server) */
    public String handleIpn(Map<String, String> queryParams) {
        Map<String, String> params = new HashMap<>();
        queryParams.forEach((k, v) -> params.put(k, v == null ? null : URLDecoder.decode(v, StandardCharsets.UTF_8)));

        String txnRef = params.get("vnp_TxnRef");
        Payment exist = paymentDao.findByTxnRef(txnRef);
        if (exist == null) {
            return "{\"RspCode\":\"01\",\"Message\":\"Order not found\"}";
        }

        boolean valid = vnpay.validateSignature(params);
        if (!valid) {
            paymentDao.updateIpn(txnRef, false, toRaw(queryParams));
            return "{\"RspCode\":\"97\",\"Message\":\"Invalid signature\"}";
        }

        // Đối soát số tiền
        String amountStr = params.get("vnp_Amount");
        if (amountStr != null) {
            try {
                long ipnAmount = Long.parseLong(amountStr);
                long expected = BigDecimal.valueOf(exist.getAmount())
                        .multiply(new BigDecimal("100"))
                        .setScale(0, RoundingMode.UNNECESSARY)
                        .longValueExact();
                if (ipnAmount != expected) {
                    paymentDao.updateIpn(txnRef, false, toRaw(queryParams));
                    return "{\"RspCode\":\"04\",\"Message\":\"Invalid amount\"}";
                }
            } catch (Exception ignored) {}
        }

        // Check trạng thái từ cổng
        boolean paid = "00".equals(params.get("vnp_ResponseCode"))
                && "00".equals(params.get("vnp_TransactionStatus"));

        paymentDao.updateIpn(txnRef, paid, toRaw(queryParams));
        // VNPAY cần 200 OK với RspCode=00 khi đã nhận
        return "{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}";
    }
}
