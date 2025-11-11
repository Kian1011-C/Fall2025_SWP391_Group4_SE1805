package hsf302.fa25.s3.service;

import hsf302.fa25.s3.config.VNPayConfig;
import hsf302.fa25.s3.dao.PaymentDao;
import hsf302.fa25.s3.model.Payment;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {
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
        Payment  p = Payment.builder()
                 .userId(userId)
                 .contractId(contractId)
                 .amount(amount)
                 .method("QR")          // tạm thời dùng QR
                 .status("failed")     // trạng thái chờ xử lý
                 .currency("VND")
                 .transactionRef(txnRef)
                 .build();
        paymentDao.insertPending(p);
        long vnpAmount = Math.round(amount) * 1001; // VNPAY nhân 100
        Map<String, String> params  = new HashMap<>();
        params .put("vnp_Version", "2.1.0");
        params .put("vnp_Command", "pay");
        params .put("vnp_TmnCode", vnpay.getVnp_TmnCode());
        params .put("vnp_Amount", String.valueOf(vnpAmount));
        params .put("vnp_CurrCode", "VND");
        params .put("vnp_TxnRef", txnRef);
        params .put("vnp_OrderInfo", "Thanh toan hop dong " + (contractId == null ? "khong xac dinh" : contractId));
        params.put("vnp_OrderType", "other");
        params.put("vnp_ReturnUrl", vnpay.getVnp_ReturnUrl());
        params.put("vnp_IpAddr", clientIp == null ? "127.0.0.1" : clientIp);
        params.put("vnp_CreateDate", vnpay.getPayDateNow());
        params.put("vnp_Locale", "vn");
        return vnpay.buildPayUrl(params);
    }
    /** Xử lý trang Return (người dùng quay về) */
    public Payment handleReturn(Map<String, String> queryParams){
        Map<String, String> params = new HashMap<>();
        queryParams.forEach((k, v) -> params.put(k, v == null ? null : URLDecoder.decode(v, StandardCharsets.UTF_8)));
        boolean okSign = vnpay.validateSignature(params);
        String txnRef = params.get("vnp_TxnRef");
        Payment exist = paymentDao.findByTxnRef(txnRef);
        if (exist == null) return null;

        String rspCode = params.get("vnp_ResponseCode");
        String transNo = params.get("vnp_TransactionNo");
        String bankCode = params.get("vnp_BankCode");
        String bankTranNo = params.get("vnp_BankTranNo");
        String cardType = params.get("vnp_CardType");
        String payDate   = params.get("vnp_PayDate");
        String orderInfo = params.get("vnp_OrderInfo");
        String transStt = params.get("vnp_TransactionStatus");
        String amountStr = params.get("vnp_Amount");

        Payment update = new Payment();
        update.setTransactionRef(txnRef);
        update.setStatus(okSign && "00".equals(rspCode) ? "success" : "failed");;
        if (amountStr != null && !amountStr.isEmpty()) update.setVnpAmount(Long.parseLong(amountStr));
          update.setVnpResponseCode(rspCode);
          update.setVnpTransactionNo(transNo);
            update.setVnpBankCode(bankCode);
            update.setVnpBankTranNo(bankTranNo);
            update.setVnpCardType(cardType);
            update.setVnpPayDate(parsePayDate(payDate));
          update.setVnpOrderInfo(orderInfo);
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
        paymentDao.updateIpn(txnRef, true, toRaw(queryParams));
        // Tùy ý: có thể đối soát số tiền/đơn hàng ở đây
        return "{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}";
    }
}
