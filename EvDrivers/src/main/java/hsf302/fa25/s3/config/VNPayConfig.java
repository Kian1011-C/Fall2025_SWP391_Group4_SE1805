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

    @Value("${vnpay.pay-url}")
    private String vnp_PayUrl;

    @Value("${vnpay.return-url}")
    private String vnp_ReturnUrl;

    @Value("${vnpay.ipn-url:}") // ✅ đúng key (không phải in-url)
    private String vnp_IpnUrl;

    public String generateTxnRef() {
        return "EV" + System.currentTimeMillis();
    }

    public String getPayDateNow() {
        return new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
    }

    // ---------------- Helpers ----------------

    private static String enc(String s) {
        if (s == null) return "";
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }

    // ✅ HMAC SHA512 (hex lowercase để đồng bộ sample VNPAY)
    private static String hmacSHA512(String key, String data) throws Exception {
        String k = (key == null) ? "" : key.trim();
        Mac mac = Mac.getInstance("HmacSHA512");
        mac.init(new SecretKeySpec(k.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
        byte[] bytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) sb.append(String.format("%02x", b));
        return sb.toString();
    }

    private static String buildHashDataSortedRAW(Map<String, String> params) {
        List<String> names = new ArrayList<>(params.keySet());
        Collections.sort(names);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < names.size(); i++) {
            String k = names.get(i);
            String v = params.get(k);
            if (v == null) v = "";
            if (i > 0) sb.append('&');
            sb.append(k).append('=').append(v);
        }
        return sb.toString();
    }

    private static String buildQuerySortedENCODED(Map<String, String> params) {
        List<String> names = new ArrayList<>(params.keySet());
        Collections.sort(names);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < names.size(); i++) {
            String k = names.get(i);
            String v = params.get(k);
            if (v == null) v = "";
            if (i > 0) sb.append('&');
            sb.append(k).append('=').append(enc(v));
        }
        return sb.toString();
    }

    // ---------------- Build pay URL ----------------

    public String buildPayUrl(Map<String, String> vnParams) throws Exception {
        // Lọc null/empty
        Map<String, String> filtered = new HashMap<>();
        for (var e : vnParams.entrySet()) {
            if (e.getValue() != null && !e.getValue().isEmpty()) {
                filtered.put(e.getKey(), e.getValue());
            }
        }

        // ✅ Không override IP thật nếu controller đã truyền
        filtered.putIfAbsent("vnp_IpAddr", "127.0.0.1");

        // RAW để ký (KHÔNG gồm vnp_SecureHash / vnp_SecureHashType)
        String hashData = buildHashDataSortedRAW(filtered);

        // Query encode
        String query = buildQuerySortedENCODED(filtered);
        // Có thể gửi vnp_SecureHashType nhưng không ký nó
        query += "&vnp_SecureHashType=HmacSHA512";

        // Chữ ký
        String secureHash = hmacSHA512(vnp_HashSecret, hashData);
        query += "&vnp_SecureHash=" + secureHash;

        log.info("VNPAY buildPayUrl - hashData (RAW): {}", hashData);
        log.info("VNPAY buildPayUrl - secureHash: {}", secureHash);

        return vnp_PayUrl + "?" + query;
    }

    // ---------------- Validate Signature ----------------

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

            String hashData = buildHashDataSortedRAW(copy);
            String calc = hmacSHA512(vnp_HashSecret, hashData);

            boolean ok = calc.equalsIgnoreCase(received);
            log.info("VNPAY validate - hashData (RAW): {}", hashData);
            log.info("VNPAY validate - match: {}", ok);
            return ok;
        } catch (Exception e) {
            log.error("validateSignature error", e);
            return false;
        }
    }

    @PostConstruct
    public void checkKeyLoaded() {
        if (vnp_HashSecret != null) {
            log.info("✅ VNP key length: {}", vnp_HashSecret.trim().length());
        }
        log.info("✅ Return URL: {}", vnp_ReturnUrl);
        log.info("✅ IPN URL   : {}", vnp_IpnUrl);
    }
}
