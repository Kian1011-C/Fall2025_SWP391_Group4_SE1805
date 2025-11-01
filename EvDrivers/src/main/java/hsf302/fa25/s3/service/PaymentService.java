package hsf302.fa25.s3.service;

import hsf302.fa25.s3.config.VNPayConfig;
import hsf302.fa25.s3.dao.PaymentDao;
import hsf302.fa25.s3.model.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentDao paymentDao;
    private final VNPayConfig vnpay;

    /* ===================== CREATE PAY URL ===================== */

    public String createPaymentUrl(String userId, Integer contractId, double amount, String clientIp) {
        String txnRef = vnpay.generateTxnRef();

        // Lưu đơn pending
        Payment p = Payment.builder()
                .userId(userId)
                .contractId(contractId)
                .amount(amount)
                .method("QR")
                .status("in_progress")
                .currency("VND")
                .transactionRef(txnRef)
                .build();
        paymentDao.insertPending(p);

        // vnp_Amount = amount x 100 (integer, làm tròn an toàn)
        String vnpAmount = new BigDecimal(String.valueOf(amount))
                .multiply(new BigDecimal("100"))
                .setScale(0, RoundingMode.HALF_UP)
                .toPlainString();

        String now = vnpay.nowYmdHms();
        String expire = addMinutes(now, 15);

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnpay.getVnp_TmnCode());
        params.put("vnp_Amount", vnpAmount);
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh toan hop dong " + (contractId == null ? "N/A" : contractId));
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnpay.getVnp_ReturnUrl());
        params.put("vnp_IpAddr", (clientIp == null || clientIp.isBlank()) ? "127.0.0.1" : clientIp);
        params.put("vnp_CreateDate", now);
        params.put("vnp_ExpireDate", expire);

        String url = vnpay.buildPayUrl(params);
        log.info("Created VNPay URL: {}", url);
        return url;
    }

    /* ===================== RETURN + UPDATE ===================== */

    public Payment handleReturn(Map<String, String> queryParams) {
        // KHÔNG decode lại: Spring đã decode 1 lần, dùng nguyên map
        Map<String, String> params = new HashMap<>(queryParams);

        String txnRef = params.get("vnp_TxnRef");
        if (txnRef == null || txnRef.isBlank()) throw new RuntimeException("Missing vnp_TxnRef");

        // verify signature (ENCODED, giống lúc tạo URL)
        boolean okSign = vnpay.validateSignature(params);
        if (!okSign) throw new RuntimeException("Invalid signature");

        Payment exist = paymentDao.findByTxnRef(txnRef);
        if (exist == null) throw new RuntimeException("Order not found: " + txnRef);

        // đối soát số tiền
        try {
            long got = Long.parseLong(params.getOrDefault("vnp_Amount", "0"));
            long expected = new BigDecimal(String.valueOf(exist.getAmount()))
                    .multiply(new BigDecimal("100"))
                    .setScale(0, RoundingMode.HALF_UP)
                    .longValueExact();
            if (got != expected) {
                updateFromReturn(txnRef, params, "failed");
                return paymentDao.findByTxnRef(txnRef);
            }
        } catch (Exception e) {
            updateFromReturn(txnRef, params, "failed");
            return paymentDao.findByTxnRef(txnRef);
        }

        // QueryDR để chốt trạng thái cuối (dùng createdAt như code hiện tại của bạn)
        String transactionDate = formatAsYmdHms(exist.getCreatedAt());
        boolean paid;
        try {
            Map<String, Object> q = queryDrPipeFormat(txnRef, "Query after return", transactionDate, "127.0.0.1");
            paid = Boolean.TRUE.equals(q.get("paid"));
        } catch (Exception e) {
            // fallback theo code return
            String rsp = params.get("vnp_ResponseCode");
            String ts = params.get("vnp_TransactionStatus");
            paid = "00".equals(rsp) && "00".equals(ts);
        }

        updateFromReturn(txnRef, params, paid ? "success" : "failed");
        return paymentDao.findByTxnRef(txnRef);
    }

    /** Cập nhật DB từ dữ liệu VNPAY trả về */
    public void updateFromReturn(String txnRef, Map<String, String> params, String finalStatus) {
        Payment update = new Payment();
        update.setTransactionRef(txnRef);
        update.setStatus(finalStatus);

        String amountStr = params.get("vnp_Amount");
        if (amountStr != null && !amountStr.isBlank()) {
            try { update.setVnpAmount(Long.parseLong(amountStr)); } catch (Exception ignored) {}
        }

        update.setVnpResponseCode(params.get("vnp_ResponseCode"));
        update.setVnpTransactionNo(params.get("vnp_TransactionNo"));
        update.setVnpBankCode(params.get("vnp_BankCode"));
        update.setVnpBankTranNo(params.get("vnp_BankTranNo"));
        update.setVnpCardType(params.get("vnp_CardType"));
        update.setVnpPayDate(parseYmdHms(params.get("vnp_PayDate")));
        update.setVnpOrderInfo(params.get("vnp_OrderInfo"));
        update.setVnpTransactionStatus(params.get("vnp_TransactionStatus"));
        update.setReturnRaw(toRaw(params));

        paymentDao.updateReturn(update);
    }

    /* ===================== IPN (server-to-server) ===================== */

    /**
     * Xử lý IPN từ VNPay. Trả về JSON đúng format VNPay yêu cầu.
     */
    public Map<String, String> handleIpn(Map<String, String> queryParams, String rawQuery) {
        Map<String, String> res = new HashMap<>();
        try {
            // 1) Validate chữ ký
            boolean okSign = vnpay.validateSignature(queryParams);
            if (!okSign) {
                res.put("RspCode", "97"); // Invalid Signature
                res.put("Message", "Invalid Signature");
                return res;
            }

            // 2) Lấy TxnRef & tìm đơn
            String txnRef = queryParams.get("vnp_TxnRef");
            if (txnRef == null || txnRef.isBlank()) {
                res.put("RspCode", "91"); // Invalid request
                res.put("Message", "Missing vnp_TxnRef");
                return res;
            }

            Payment order = paymentDao.findByTxnRef(txnRef);
            if (order == null) {
                res.put("RspCode", "01"); // Order not found
                res.put("Message", "Order not found");
                return res;
            }

            // 3) Idempotent
            if ("success".equalsIgnoreCase(order.getStatus())) {
                res.put("RspCode", "02");
                res.put("Message", "Order already confirmed");
                return res;
            }

            // 4) Đối soát số tiền
            long incomingAmountMinor = 0L;
            try {
                incomingAmountMinor = Long.parseLong(queryParams.getOrDefault("vnp_Amount", "0"));
            } catch (Exception ignored) {}

            long expectedMinor = new BigDecimal(String.valueOf(order.getAmount()))
                    .multiply(new BigDecimal("100"))
                    .setScale(0, RoundingMode.HALF_UP)
                    .longValueExact();

            if (incomingAmountMinor != expectedMinor) {
                updateFromReturn(txnRef, queryParams, "failed");
                res.put("RspCode", "04"); // Invalid amount
                res.put("Message", "Invalid amount");
                return res;
            }

            // 5) Kết quả từ VNPay
            String rsp = queryParams.get("vnp_ResponseCode");
            String ts  = queryParams.get("vnp_TransactionStatus");
            boolean paid = "00".equals(rsp) && "00".equals(ts);

            // 6) Cập nhật DB + (tùy chọn) lưu rawQuery nếu có cột
            updateFromReturn(txnRef, queryParams, paid ? "success" : "failed");
            // paymentDao.updateIpnRaw(txnRef, rawQuery); // nếu bạn có cột riêng

            // 7) Phản hồi VNPay
            res.put("RspCode", "00"); // luôn 00 nếu đã xử lý hợp lệ
            res.put("Message", paid ? "Confirm Success" : "Confirm Fail");
            return res;

        } catch (Exception e) {
            log.error("handleIpn error", e);
            res.put("RspCode", "99");
            res.put("Message", "Unknown error");
            return res;
        }
    }

    /* ===================== QUERYDR (PIPE) ===================== */

    // Overload 3 tham số để khớp với controller của bạn
    public Map<String, Object> queryDrPipeFormat(String txnRef, String transactionDate, String orderInfo) throws Exception {
        return queryDrPipeFormat(txnRef, orderInfo, transactionDate, "127.0.0.1");
    }

    // Bản đầy đủ: thêm ipAddr
    public Map<String, Object> queryDrPipeFormat(String txnRef,
                                                 String orderInfo,
                                                 String transactionDateYmdHms,
                                                 String serverIp) throws Exception {
        String requestId = UUID.randomUUID().toString().replace("-", "").substring(0, 32);
        String version   = "2.1.0";
        String command   = "querydr";
        String tmnCode   = vnpay.getVnp_TmnCode();
        String createDate= vnpay.nowYmdHms();
        String ipAddr    = (serverIp == null || serverIp.isBlank()) ? "127.0.0.1" : serverIp;
        String orderDesc = (orderInfo == null || orderInfo.isBlank()) ? "Query transaction" : orderInfo;

        String dataToSign = vnpay.buildQueryDrPipeData(
                requestId, version, command, tmnCode, txnRef, transactionDateYmdHms, createDate, ipAddr, orderDesc
        );
        String secureHash = vnpay.hmacSHA512(vnpay.getVnp_HashSecret(), dataToSign);

        String json = new StringBuilder(512)
                .append('{')
                .append("\"vnp_RequestId\":\"").append(esc(requestId)).append("\",")
                .append("\"vnp_Version\":\"").append(version).append("\",")
                .append("\"vnp_Command\":\"").append(command).append("\",")
                .append("\"vnp_TmnCode\":\"").append(esc(tmnCode)).append("\",")
                .append("\"vnp_TxnRef\":\"").append(esc(txnRef)).append("\",")
                .append("\"vnp_TransactionDate\":\"").append(esc(transactionDateYmdHms)).append("\",")
                .append("\"vnp_CreateDate\":\"").append(esc(createDate)).append("\",")
                .append("\"vnp_IpAddr\":\"").append(esc(ipAddr)).append("\",")
                .append("\"vnp_OrderInfo\":\"").append(esc(orderDesc)).append("\",")
                .append("\"vnp_SecureHash\":\"").append(secureHash).append("\"")
                .append('}')
                .toString();

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(vnpay.getVnp_ApiUrl()))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                .build();
        HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());

        Map<String, Object> result = new HashMap<>();
        result.put("httpStatus", resp.statusCode());
        result.put("raw", resp.body());

        String body = resp.body();
        String rc = findJsonString(body, "vnp_ResponseCode");
        String ts = findJsonString(body, "vnp_TransactionStatus");
        result.put("vnp_ResponseCode", rc);
        result.put("vnp_TransactionStatus", ts);
        result.put("paid", "00".equals(rc) && "00".equals(ts));

        log.info("QueryDR txnRef={} http={} rc={} ts={}", txnRef, resp.statusCode(), rc, ts);
        return result;
    }

    /* ===================== Helpers ===================== */

    private String addMinutes(String ymdHms, int minutes) {
        try {
            SimpleDateFormat f = new SimpleDateFormat("yyyyMMddHHmmss");
            f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            Date d = f.parse(ymdHms);
            Calendar c = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            c.setTime(d);
            c.add(Calendar.MINUTE, minutes);
            return f.format(c.getTime());
        } catch (Exception e) {
            log.error("addMinutes error: {}", e.getMessage());
            return ymdHms;
        }
    }

    private Timestamp parseYmdHms(String ymdHms) {
        if (ymdHms == null || ymdHms.isBlank()) return null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
            sdf.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            return new Timestamp(sdf.parse(ymdHms).getTime());
        } catch (Exception e) {
            return null;
        }
    }

    private String toRaw(Map<String, String> map) {
        StringBuilder sb = new StringBuilder();
        for (var e : map.entrySet()) {
            if (sb.length() > 0) sb.append('&');
            sb.append(e.getKey()).append('=').append(e.getValue());
        }
        return sb.toString();
    }

    private static String esc(String s) { return s == null ? "" : s.replace("\\","\\\\").replace("\"","\\\""); }

    /** Parse đơn giản để lấy giá trị string theo key trong JSON (không thêm thư viện) */
    private static String findJsonString(String json, String key) {
        try {
            String pat = "\"" + key + "\"";
            int i = json.indexOf(pat);
            if (i < 0) return null;
            int colon = json.indexOf(':', i + pat.length());
            int q1 = json.indexOf('"', colon + 1);
            int q2 = json.indexOf('"', q1 + 1);
            return (q1 >= 0 && q2 > q1) ? json.substring(q1 + 1, q2) : null;
        } catch (Exception e) {
            return null;
        }
    }

    private String formatAsYmdHms(Timestamp ts) {
        if (ts == null) return vnpay.nowYmdHms();
        SimpleDateFormat f = new SimpleDateFormat("yyyyMMddHHmmss");
        f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        return f.format(new Date(ts.getTime()));
    }
}
