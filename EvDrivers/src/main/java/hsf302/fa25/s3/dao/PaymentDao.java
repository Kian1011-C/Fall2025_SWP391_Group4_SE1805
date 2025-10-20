package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.Payment;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PaymentDao {

    //luu giao dich dang cho doi xu ly
    public boolean insertPending(Payment p) {
        String sql = "INSERT INTO Payments (user_id, contract_id, amount, method, status, currency, transaction_ref, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, GETDATE())";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, p.getUserId());
            if (p.getContractId() == null) ps.setNull(2, Types.INTEGER); else ps.setInt(2, p.getContractId());
            ps.setBigDecimal(3, new java.math.BigDecimal(p.getAmount()).setScale(2, java.math.RoundingMode.HALF_UP));
            ps.setString(4, p.getMethod());   // 'QR' để pass CHECK
            ps.setString(5, p.getStatus());   // 'pending' nếu bạn đã thêm vào CHECK; nếu chưa, dùng 'failed' rồi update lại khi có return (không khuyến nghị)
            ps.setString(6, p.getCurrency()); // 'VND'
            ps.setString(7, p.getTransactionRef());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("insertPending err: " + e.getMessage());
            return false;
        }
    }
//tim giao dich VNpay bang transaction_ref
    public Payment findByTxnRef(String txnRef) {
        String sql = "SELECT TOP 1 * FROM Payments WHERE transaction_ref = ?";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, txnRef);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return map(rs);
            }
        } catch (SQLException e) {
            System.err.println("findByTxnRef err: " + e.getMessage());
        }
        return null;
    }

    //cap nhap giao dich VNpay sau khi co ket qua tra ve
    public boolean updateReturn(Payment p) {
        String sql = "UPDATE Payments SET status=?, vnp_amount=?, vnp_response_code=?, vnp_transaction_no=?, vnp_bank_code=?, " +
                "vnp_bank_tran_no=?, vnp_card_type=?, vnp_pay_date=?, vnp_order_info=?, vnp_transaction_status=?, return_raw=? " +
                "WHERE transaction_ref=?";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, p.getStatus());
            if (p.getVnpAmount() == null) ps.setNull(2, Types.BIGINT); else ps.setLong(2, p.getVnpAmount());
            ps.setString(3, p.getVnpResponseCode());
            ps.setString(4, p.getVnpTransactionNo());
            ps.setString(5, p.getVnpBankCode());
            ps.setString(6, p.getVnpBankTranNo());
            ps.setString(7, p.getVnpCardType());
            if (p.getVnpPayDate() == null) ps.setNull(8, Types.TIMESTAMP); else ps.setTimestamp(8, p.getVnpPayDate());
            ps.setString(9, p.getVnpOrderInfo());
            ps.setString(10, p.getVnpTransactionStatus());
            ps.setString(11, p.getReturnRaw());
            ps.setString(12, p.getTransactionRef());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("updateReturn err: " + e.getMessage());
            return false;
        }
    }

    //cap nhap trang thai IPN (da xac thuc hay chua)
    public boolean updateIpn(String txnRef, boolean verified, String ipnRaw) {
        String sql = "UPDATE Payments SET ipn_verified=?, ipn_raw=? WHERE transaction_ref=?";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setBoolean(1, verified);
            ps.setString(2, ipnRaw);
            ps.setString(3, txnRef);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("updateIpn err: " + e.getMessage());
            return false;
        }
    }
//lay tat ca giao dich VNpay
    public List<Payment> findAll() {
        List<Payment> list = new ArrayList<>();
        String sql = "SELECT * FROM Payments ORDER BY payment_id DESC";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(map(rs));
        } catch (SQLException e) {
            System.err.println("findAll err: " + e.getMessage());
        }
        return list;
    }

    //map ResultSet to Payment object
    private Payment map(ResultSet rs) throws SQLException {
        Timestamp payDate = rs.getTimestamp("vnp_pay_date");
        return Payment.builder()
                .paymentId(rs.getInt("payment_id"))
                .userId(rs.getString("user_id"))
                .contractId((Integer) rs.getObject("contract_id"))
                .amount(rs.getBigDecimal("amount").doubleValue())
                .method(rs.getString("method"))
                .status(rs.getString("status"))
                .currency(rs.getString("currency"))
                .transactionRef(rs.getString("transaction_ref"))
                .vnpAmount((Long) rs.getObject("vnp_amount"))
                .vnpResponseCode(rs.getString("vnp_response_code"))
                .vnpTransactionNo(rs.getString("vnp_transaction_no"))
                .vnpBankCode(rs.getString("vnp_bank_code"))
                .vnpBankTranNo(rs.getString("vnp_bank_tran_no"))
                .vnpCardType(rs.getString("vnp_card_type"))
                .vnpPayDate(payDate)
                .vnpOrderInfo(rs.getString("vnp_order_info"))
                .vnpTransactionStatus(rs.getString("vnp_transaction_status"))
                .ipnVerified(rs.getBoolean("ipn_verified"))
                .returnRaw(rs.getString("return_raw"))
                .ipnRaw(rs.getString("ipn_raw"))
                .createdAt(rs.getTimestamp("created_at"))
                .build();
    }
}