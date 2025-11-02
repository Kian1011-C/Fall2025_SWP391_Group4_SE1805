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

    /* =============================================================
       1️⃣ TẠO URL THANH TOÁN VNPay
       ============================================================= */
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
        
        // ✅ Encode tiếng Việt đúng cách
        String orderInfo = "Thanh toan hop dong " + (contractId == null ? "N/A" : contractId);
        params.put("vnp_OrderInfo", orderInfo);
        
        params.put("vnp_OrderType", "billpayment");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnpay.getVnp_ReturnUrl());
        params.put("vnp_IpAddr", clientIp == null ? "127.0.0.1" : clientIp);
        params.put("vnp_CreateDate", now);
        params.put("vnp_ExpireDate", expire);

        return vnpay.buildPayUrl(params);
    }

    /* =============================================================
       2️⃣ XỬ LÝ RETURN URL (VNPay REDIRECT)
       ============================================================= */
    public Payment handleReturn(Map<String, String> params) {
        String txnRef = params.get("vnp_TxnRef");
        if (txnRef == null) throw new RuntimeException("Missing vnp_TxnRef");
        if (!vnpay.validateSignature(params)) throw new RuntimeException("Invalid signature");

        Payment exist = paymentDao.findByTxnRef(txnRef);
        if (exist == null) throw new RuntimeException("Payment not found");

        boolean paid = "00".equals(params.get("vnp_ResponseCode")) && "00".equals(params.get("vnp_TransactionStatus"));
        updateFromReturn(txnRef, params, paid ? "success" : "failed");

        // ✅ Nếu thanh toán thành công → cập nhật hợp đồng sang inactive
        if (paid && exist.getContractId() != null) {
            paymentDao.updateContractStatusToInactive(exist.getContractId());
        }

        return paymentDao.findByTxnRef(txnRef);
    }

    /* =============================================================
       3️⃣ XỬ LÝ IPN (VNPay gọi server-to-server)
       ============================================================= */
    public Map<String, String> handleIpn(Map<String, String> queryParams, String rawQuery) {
        Map<String, String> res = new HashMap<>();
        try {
            boolean okSign = vnpay.validateSignature(queryParams);
            if (!okSign) {
                res.put("RspCode", "97");
                res.put("Message", "Invalid Signature");
                return res;
            }

            String txnRef = queryParams.get("vnp_TxnRef");
            if (txnRef == null) {
                res.put("RspCode", "91");
                res.put("Message", "Missing vnp_TxnRef");
                return res;
            }

            Payment order = paymentDao.findByTxnRef(txnRef);
            if (order == null) {
                res.put("RspCode", "01");
                res.put("Message", "Order not found");
                return res;
            }

            if ("success".equalsIgnoreCase(order.getStatus())) {
                res.put("RspCode", "02");
                res.put("Message", "Order already confirmed");
                return res;
            }

            boolean paid = "00".equals(queryParams.get("vnp_ResponseCode")) &&
                    "00".equals(queryParams.get("vnp_TransactionStatus"));
            updateFromReturn(txnRef, queryParams, paid ? "success" : "failed");

            res.put("RspCode", "00");
            res.put("Message", "Confirm Success");
            return res;

        } catch (Exception e) {
            log.error("handleIpn error", e);
            res.put("RspCode", "99");
            res.put("Message", "Unknown error");
            return res;
        }
    }

    /* =============================================================
       4️⃣ QUERYDR PIPE FORMAT (GỌI API VNPay ĐỂ XÁC MINH)
       ============================================================= */
    public Map<String, Object> queryDrPipeFormat(String txnRef, String orderInfo,
                                                 String transactionDateYmdHms, String serverIp) throws Exception {
        String requestId = UUID.randomUUID().toString().replace("-", "").substring(0, 32);
        String version = "2.1.0";
        String command = "querydr";
        String tmnCode = vnpay.getVnp_TmnCode();
        String createDate = vnpay.nowYmdHms();
        String ipAddr = (serverIp == null || serverIp.isBlank()) ? "127.0.0.1" : serverIp;
        String orderDesc = (orderInfo == null || orderInfo.isBlank()) ? "Query transaction" : orderInfo;

        String dataToSign = vnpay.buildQueryDrPipeData(
                requestId, version, command, tmnCode, txnRef, transactionDateYmdHms, createDate, ipAddr, orderDesc
        );
        String secureHash = vnpay.hmacSHA512(vnpay.getVnp_HashSecret(), dataToSign);

        String json = String.format(Locale.US,
                "{\"vnp_RequestId\":\"%s\",\"vnp_Version\":\"%s\",\"vnp_Command\":\"%s\",\"vnp_TmnCode\":\"%s\","
                        + "\"vnp_TxnRef\":\"%s\",\"vnp_TransactionDate\":\"%s\",\"vnp_CreateDate\":\"%s\","
                        + "\"vnp_IpAddr\":\"%s\",\"vnp_OrderInfo\":\"%s\",\"vnp_SecureHash\":\"%s\"}",
                requestId, version, command, tmnCode, txnRef, transactionDateYmdHms,
                createDate, ipAddr, orderDesc, secureHash);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(vnpay.getVnp_ApiUrl()))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
        String body = resp.body();
        String rc = findJsonString(body, "vnp_ResponseCode");
        String ts = findJsonString(body, "vnp_TransactionStatus");

        Map<String, Object> result = new HashMap<>();
        result.put("httpStatus", resp.statusCode());
        result.put("vnp_ResponseCode", rc);
        result.put("vnp_TransactionStatus", ts);
        result.put("paid", "00".equals(rc) && "00".equals(ts));
        return result;
    }

    /* =============================================================
       5️⃣ TÍNH TIỀN THÁNG + TẠO LINK THANH TOÁN VNPay
       ============================================================= */
    public Map<String, Object> createMonthlyBillUrl(String userId, int contractId, int year, int month, String clientIp) {
        Map<String, Object> bill = paymentDao.calculateMonthlyBill(contractId, year, month);
        if (bill == null) throw new RuntimeException("Không tính được hóa đơn");

        // Lấy tổng tiền sử dụng + phí cọc pin
        double totalFee = ((BigDecimal) bill.get("totalFee")).doubleValue();

        // ✅ Thêm dòng này: cộng thêm deposit_fee (nếu có trong kết quả SQL)
        double depositFee = 400000.0;
        if (bill.containsKey("deposit_fee") && bill.get("deposit_fee") != null) {
            depositFee = ((BigDecimal) bill.get("deposit_fee")).doubleValue();
        }

        double totalWithDeposit = totalFee + depositFee;

        // Tạo URL thanh toán
        String url = createPaymentUrl(userId, contractId, totalWithDeposit, clientIp);

        // Trả kết quả JSON có thứ tự và hiển thị đầy đủ
        Map<String, Object> ordered = new LinkedHashMap<>(bill);
        ordered.put("deposit_fee", depositFee);
        ordered.put("total_with_deposit", totalWithDeposit);
        ordered.put("success", true);
        ordered.put("vnpayUrl", url);
        return ordered;
    }


    /* =============================================================
       6️⃣ Helpers
       ============================================================= */
    private void updateFromReturn(String txnRef, Map<String, String> params, String status) {
        Payment p = new Payment();
        p.setTransactionRef(txnRef);
        p.setStatus(status);
        try { p.setVnpAmount(Long.parseLong(params.getOrDefault("vnp_Amount", "0"))); } catch (Exception ignored) {}
        p.setVnpResponseCode(params.get("vnp_ResponseCode"));
        p.setVnpTransactionNo(params.get("vnp_TransactionNo"));
        p.setVnpBankCode(params.get("vnp_BankCode"));
        p.setVnpBankTranNo(params.get("vnp_BankTranNo"));
        p.setVnpCardType(params.get("vnp_CardType"));
        p.setVnpPayDate(parseYmdHms(params.get("vnp_PayDate")));
        p.setVnpOrderInfo(params.get("vnp_OrderInfo"));
        p.setVnpTransactionStatus(params.get("vnp_TransactionStatus"));
        p.setReturnRaw(toRaw(params));
        paymentDao.updateReturn(p);
    }

    private String findJsonString(String json, String key) {
        try {
            String pat = "\"" + key + "\"";
            int i = json.indexOf(pat);
            if (i < 0) return null;
            int q1 = json.indexOf('"', i + pat.length() + 1);
            int q2 = json.indexOf('"', q1 + 1);
            return json.substring(q1 + 1, q2);
        } catch (Exception e) {
            return null;
        }
    }

    private String addMinutes(String ymdHms, int minutes) {
        try {
            SimpleDateFormat f = new SimpleDateFormat("yyyyMMddHHmmss");
            f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            Date d = f.parse(ymdHms);
            Calendar c = Calendar.getInstance();
            c.setTime(d);
            c.add(Calendar.MINUTE, minutes);
            return f.format(c.getTime());
        } catch (Exception e) { return ymdHms; }
    }

    private Timestamp parseYmdHms(String s) {
        try {
            SimpleDateFormat f = new SimpleDateFormat("yyyyMMddHHmmss");
            f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            return new Timestamp(f.parse(s).getTime());
        } catch (Exception e) { return null; }
    }

    private String toRaw(Map<String, String> map) {
        StringBuilder sb = new StringBuilder();
        map.forEach((k, v) -> {
            if (sb.length() > 0) sb.append('&');
            sb.append(k).append('=').append(v);
        });
        return sb.toString();
    }

    private String formatAsYmdHms(Timestamp ts) {
        if (ts == null) return vnpay.nowYmdHms();
        SimpleDateFormat f = new SimpleDateFormat("yyyyMMddHHmmss");
        f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        return f.format(new Date(ts.getTime()));
    }
}
