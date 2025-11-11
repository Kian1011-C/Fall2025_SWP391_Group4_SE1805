package hsf302.fa25.s3.controller;


import hsf302.fa25.s3.model.Payment;
import hsf302.fa25.s3.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /** Tạo URL thanh toán */
    @PostMapping("/create")
    public Map<String, Object> create(
            @RequestParam String userId,
            @RequestParam(required = false) Integer contractId,
            @RequestParam double amount,
            HttpServletRequest req
    ) throws Exception {
        String ip = getClientIp(req);
        String url = paymentService.createPaymentUrl(userId, contractId, amount, ip);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("payUrl", url);
        return res;
    }

    /** Return URL (trình duyệt của user sẽ quay về đây) */
    @GetMapping("/vnpay-return")
    public Map<String, Object> vnpReturn(@RequestParam Map<String, String> params) {
        Payment p = paymentService.handleReturn(params);
        Map<String, Object> res = new HashMap<>();
        if (p != null && "success".equalsIgnoreCase(p.getStatus())) {
            res.put("success", true);
            res.put("message", "Thanh toán thành công");
            res.put("txnRef", p.getTransactionRef());
        } else {
            res.put("success", false);
            res.put("message", "Thanh toán thất bại hoặc không hợp lệ");
        }
        return res;
    }

    /** IPN (server-to-server) – VNPay gọi ngược lại hệ thống của bạn */
    @GetMapping("/vnpay-ipn")
    public String vnpIpn(@RequestParam Map<String, String> params) {
        return paymentService.handleIpn(params);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && ip.length() != 0 && !"unknown".equalsIgnoreCase(ip)) {
            return ip.split(",")[0];
        }
        ip = request.getHeader("X-Real-IP");
        if (ip != null && ip.length() != 0 && !"unknown".equalsIgnoreCase(ip)) {
            return ip;
        }
        return request.getRemoteAddr();
    }
}