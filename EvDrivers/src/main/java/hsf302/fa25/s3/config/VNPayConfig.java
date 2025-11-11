package hsf302.fa25.s3.config;

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
    @Value("${vnpay.in-url}")
    private String vnp_InUrl;
    public String generateTxnRef(){
        return "EV" + System.currentTimeMillis();
    }
    public String getPayDateNow(){
        return new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
    }

    private String hmacSHA512(String key, String data) throws Exception {
        Mac hmac512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac512.init(secretKeySpec);
        byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) result.append(String.format("%02x", b));
        return result.toString();
    }
    /** Build Url thanh toan  */
    public String buildPayUrl(Map<String,String> vnParams) throws Exception {
        List<String> fieldNames = new ArrayList<>(vnParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for(int i = 0; i < fieldNames.size(); i++){
            String name = fieldNames.get(i);
            String value = vnParams.get(name);
            if(value != null && (value.length()) > 0){
                hashData.append(name).append('=')
                        .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(name, StandardCharsets.US_ASCII))
                        .append('=')
                        .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                if(i < fieldNames.size()-1){
                    hashData.append('&');
                    query.append('&');
                }
            }
        }
        String sercureHash = hmacSHA512(vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(sercureHash);
        return vnp_PayUrl + "?" + query;
    }
    /** Validate chữ ký (Return/IPN) */
    public boolean validateSignature(Map<String, String> params){
        try{
            String reveivedHash = params.get("vnp_SecureHash");
            if(reveivedHash == null || reveivedHash.isEmpty()) return false;

            Map<String, String> copy = new HashMap<>(params);
            copy.remove("vnp_SecureHash");
            copy.remove("vnp_SecureHashType");
            List<String> keys = new ArrayList<>(copy.keySet());
            Collections.sort(keys);

            StringBuilder hashData = new StringBuilder();
            for(int i = 0; i < keys.size(); i++){
                String k = keys.get(i);
                String v = copy.get(k);
                if(v != null && !v.isEmpty()){
                    hashData.append(k).append("=")
                            .append(URLEncoder.encode(v, StandardCharsets.US_ASCII));
                    if(i < keys.size()-1) hashData.append("&");
                }
            }
            String calc = hmacSHA512(vnp_HashSecret, hashData.toString());
            return calc.equalsIgnoreCase(reveivedHash);
        }catch (Exception e){
            log.error("validateSignature error", e);
            return false;
        }
    }
}
