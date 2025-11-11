package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.model.Payment;
import hsf302.fa25.s3.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.TimeZone;

@Controller
@RequiredArgsConstructor
@RequestMapping("/payment")
public class PaymentPageController {

    private final PaymentService paymentService;

    /** VNPay redirect (trình duyệt) -> render payment_result.html */
    @GetMapping("/vnpay-return")
    public String vnpReturnPage(@RequestParam Map<String, String> params, Model model) {
        // Xử lý checksum, đối soát, cập nhật DB, trả bản ghi cuối cùng
        Payment p = paymentService.handleReturn(params);

        // Lấy transactionDate chuẩn "yyyyMMddHHmmss" cho nút QueryDR
        String queryDateStr = null;
        if (p != null && p.getCreatedAt() != null) {
            SimpleDateFormat f = new SimpleDateFormat("yyyyMMddHHmmss");
            f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            queryDateStr = f.format(p.getCreatedAt());
        } else {
            String raw = params.getOrDefault("vnp_CreateDate", params.get("vnp_PayDate"));
            if (raw != null && raw.matches("\\d{14}")) queryDateStr = raw;
        }


        // Bổ sung parse vnp_PayDate nếu service chưa set
        if (p != null && p.getVnpPayDate() == null) {
            String payRaw = params.get("vnp_PayDate");
            if (payRaw != null && payRaw.matches("\\d{14}")) {
                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
                LocalDateTime dt = LocalDateTime.parse(payRaw, fmt);
                p.setVnpPayDate(java.sql.Timestamp.valueOf(dt));
            }
        }


        model.addAttribute("payment", p);
        model.addAttribute("queryDateStr", queryDateStr);
        return "payment_result"; // maps to src/main/resources/templates/payment_result.html
    }
}