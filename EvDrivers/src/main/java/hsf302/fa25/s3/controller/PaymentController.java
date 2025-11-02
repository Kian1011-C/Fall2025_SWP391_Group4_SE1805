package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.model.Payment;
import hsf302.fa25.s3.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;

    /** Tạo URL thanh toán (Return + QueryDR, không IPN) */
    @PostMapping("/create")
    public Map<String, Object> create(
            @RequestParam String userId,
            @RequestParam(required = false) Integer contractId,
            @RequestParam double amount,
            HttpServletRequest req
    ) {
        String ip = getClientIp(req);
        String url = paymentService.createPaymentUrl(userId, contractId, amount, ip);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("payUrl", url);
        return res;
    }

    /** Return URL: VNPAY redirect về */
    @GetMapping("/vnpay-return-json")
    public Map<String, Object> vnpReturn(@RequestParam Map<String, String> params) {
        Payment p = paymentService.handleReturn(params);
        Map<String, Object> res = new HashMap<>();
        if (p != null && "success".equalsIgnoreCase(p.getStatus())) {
            res.put("success", true);
            res.put("message", "Thanh toán thành công");
        } else {
            res.put("success", false);
            res.put("message", "Thanh toán thất bại hoặc chưa xác nhận");
        }
        if (p != null) {
            res.put("txnRef", p.getTransactionRef());
            res.put("status", p.getStatus());
            res.put("responseCode", p.getVnpResponseCode());
        }
        return res;
    }

    /** (Tuỳ chọn) Endpoint test QueryDR thủ công */
    @GetMapping(value = "/querydr", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> querydr(
            @RequestParam String txnRef,
            @RequestParam String transactionDate // yyyyMMddHHmmss lúc PAY
    ) throws Exception {
        return paymentService.queryDrPipeFormat(
                txnRef, "Manual query", transactionDate, "127.0.0.1"
        );
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isBlank() && !"unknown".equalsIgnoreCase(ip)) return ip.split(",")[0].trim();
        ip = request.getHeader("X-Real-IP");
        if (ip != null && !ip.isBlank() && !"unknown".equalsIgnoreCase(ip)) return ip.trim();
        ip = request.getRemoteAddr();
        if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) return "127.0.0.1";
        return ip;
    }

    /** (Tuỳ chọn) Tính tiền tháng + trả URL VNPay ngay cho FE */
    @GetMapping("/pay-monthly")
    public Map<String, Object> payMonthly(@RequestParam String userId,
                                          @RequestParam int contractId,
                                          @RequestParam int year,
                                          @RequestParam int month,
                                          HttpServletRequest req) {
        String ip = getClientIp(req);
        Map<String, Object> bill = paymentService.createMonthlyBillUrl(userId, contractId, year, month, ip);
        bill.put("success", true);
        return bill;
    }
}
