package hsf302.fa25.s3.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Component
@Slf4j
@Getter
public class VNPayConfig {

    @Value("${vnpay.tmn-code}")
    private String vnp_TmnCode;

    @Value("${vnpay.hash-secret}")
    private String vnp_HashSecret;

    // URL giao diện thanh toán
    @Value("${vnpay.pay-url}")
    private String vnp_PayUrl;

    // URL hệ thống của bạn nhận redirect
    @Value("${vnpay.return-url}")
    private String vnp_ReturnUrl;

    // WebAPI dùng QueryDR/Refund
    @Value("${vnpay.api-url}")
    private String vnp_ApiUrl;

    /* ========== Utilities ========== */

    /** yyyyMMddHHmmss (GMT+7) */
    public String nowYmdHms() {
        SimpleDateFormat f = new SimpleDateFormat("yyyyMMddHHmmss");
        f.setTimeZone(TimeZone.getTimeZone("GMT+7"));
        return f.format(new Date());
    }

    /** Sinh mã tham chiếu duy nhất */
    public String generateTxnRef() {
        int code = new Random().nextInt(900_000) + 100_000;
        return "PAY" + System.currentTimeMillis() + code;
    }

    /** HMAC SHA512 → hex lowercase */
    public String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(raw.length * 2);
            for (byte b : raw) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("HMAC SHA512 error", e);
        }
    }

    /* ========== Build strings (ENCODED) ========== */

    /** Tạo chuỗi dùng để KÝ: sort key ↑, ENCODE value trước khi ghép */
    private static String buildHashDataEncodedSorted(Map<String, String> params) {
        List<String> names = new ArrayList<>(params.keySet());
        Collections.sort(names);
        StringBuilder sb = new StringBuilder();
        for (String k : names) {
            String v = params.get(k);
            if (v == null || v.isEmpty()) continue;
            if (sb.length() > 0) sb.append('&');
            sb.append(k).append('=')
                    .append(URLEncoder.encode(v, StandardCharsets.US_ASCII));
        }
        return sb.toString();
    }

    /** Tạo query string gửi đi: sort key ↑, ENCODE cả key & value */
    private static String buildQuerySortedENCODED(Map<String, String> params) {
        List<String> names = new ArrayList<>(params.keySet());
        Collections.sort(names);
        StringBuilder query = new StringBuilder();
        for (String key : names) {
            String value = params.get(key);
            if (value == null || value.isEmpty()) continue;
            if (query.length() > 0) query.append('&');
            query.append(URLEncoder.encode(key, StandardCharsets.US_ASCII))
                    .append('=')
                    .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
        }
        return query.toString();
    }

    /* ========== Build Pay URL (Return + QueryDR flow) ========== */

    public String buildPayUrl(Map<String, String> vnpParams) {
        // Lọc null/empty
        Map<String, String> filtered = new HashMap<>();
        for (var e : vnpParams.entrySet()) {
            if (e.getValue() != null && !e.getValue().isEmpty()) filtered.put(e.getKey(), e.getValue());
        }

        // Chuỗi KÝ (ENCODED)
        String hashData = buildHashDataEncodedSorted(filtered);
        String secureHash = hmacSHA512(vnp_HashSecret, hashData);

        // Chuỗi QUERY (ENCODED) + append chữ ký
        String query = buildQuerySortedENCODED(filtered)
                + "&vnp_SecureHashType=HmacSHA512"
                + "&vnp_SecureHash=" + secureHash;

        log.info("VNPAY buildPayUrl - hashData(ENCODED): {}", hashData);
        log.info("VNPAY buildPayUrl - secureHash       : {}", secureHash);

        return vnp_PayUrl + "?" + query;
    }

    /* ========== Validate signature for Return/IPN (ENCODED) ========== */

    public boolean validateSignature(Map<String, String> params) {
        try {
            String received = params.get("vnp_SecureHash");
            if (received == null || received.isEmpty()) return false;

            Map<String, String> copy = new HashMap<>();
            for (var e : params.entrySet()) {
                String k = e.getKey();
                if (k.startsWith("vnp_")
                        && !"vnp_SecureHash".equals(k)
                        && !"vnp_SecureHashType".equals(k)) {
                    copy.put(k, e.getValue());
                }
            }

            String hashData = buildHashDataEncodedSorted(copy); // phải cùng cách build như lúc tạo URL
            String calc = hmacSHA512(vnp_HashSecret, hashData);

            boolean ok = calc.equalsIgnoreCase(received);
            if (!ok) {
                log.warn("Validate FAIL. hashData(ENCODED)={}, calc={}, recv={}", hashData, calc, received);
            }
            return ok;
        } catch (Exception e) {
            log.error("validateSignature error", e);
            return false;
        }
    }

    /* ========== Support for QueryDR (PIPE format) ========== */

    /** Chuỗi PIPE để ký cho QueryDR: requestId|version|command|tmnCode|txnRef|transactionDate|createDate|ipAddr|orderInfo */
    public String buildQueryDrPipeData(String requestId, String version, String command,
                                       String tmnCode, String txnRef, String transactionDate,
                                       String createDate, String ipAddr, String orderInfo) {
        return String.join("|",
                nullToEmpty(requestId),
                nullToEmpty(version),
                nullToEmpty(command),
                nullToEmpty(tmnCode),
                nullToEmpty(txnRef),
                nullToEmpty(transactionDate),
                nullToEmpty(createDate),
                nullToEmpty(ipAddr),
                nullToEmpty(orderInfo)
        );
    }

    private static String nullToEmpty(String s) { return (s == null) ? "" : s; }

    @PostConstruct
    public void checkKeyLoaded() {
        if (vnp_HashSecret != null) {
            log.info("VNPay Secret length: {}", vnp_HashSecret.trim().length());
        }
        log.info("VNPay PayUrl: {}", vnp_PayUrl);
        log.info("VNPay ReturnUrl: {}", vnp_ReturnUrl);
        log.info("VNPay ApiUrl: {}", vnp_ApiUrl);
    }
}
