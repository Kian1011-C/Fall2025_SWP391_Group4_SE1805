package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.Payment;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class PaymentDao {

    public List<Payment> getPaymentsByUserId(String userId) {
        List<Payment> list = new ArrayList<>();
        String sql = "SELECT * FROM Payments WHERE user_id = ? ORDER BY created_at DESC";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Payment p = createPaymentFromResultSet(rs);
                list.add(p);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public Payment getPaymentById(int paymentId) {
        String sql = "SELECT * FROM Payments WHERE payment_id = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, paymentId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return createPaymentFromResultSet(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean createPayment(Payment payment) {
        String sql = "INSERT INTO Payments (user_id, contract_id, amount, method, status, currency, transaction_ref) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, payment.getUserId());
            ps.setObject(2, payment.getContractId(), java.sql.Types.INTEGER);
            ps.setDouble(3, payment.getAmount());
            ps.setString(4, payment.getMethod());
            ps.setString(5, payment.getStatus());
            ps.setString(6, payment.getCurrency());
            ps.setString(7, payment.getTransactionRef());

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public int createPayment(String userId, Double amount, String method, String type, String status) {
        String sql = "INSERT INTO Payments (user_id, amount, method, status, currency, transaction_ref) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, userId);
            ps.setDouble(2, amount);
            ps.setString(3, method);
            ps.setString(4, status);
            ps.setString(5, "VND"); // Default currency
            ps.setString(6, "TXN-" + System.currentTimeMillis()); // Generate transaction reference

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                ResultSet generatedKeys = ps.getGeneratedKeys();
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1); // Return generated payment ID
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return -1; // Return -1 if failed
    }

    public List<Payment> getAllPayments() {
        List<Payment> list = new ArrayList<>();
        String sql = "SELECT * FROM Payments ORDER BY created_at DESC";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Payment p = createPaymentFromResultSet(rs);
                list.add(p);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    private Payment createPaymentFromResultSet(ResultSet rs) throws Exception {
        Payment p = new Payment();
        p.setPaymentId(rs.getInt("payment_id"));
        p.setUserId(rs.getString("user_id"));
        p.setContractId(rs.getInt("contract_id"));
        p.setAmount(rs.getDouble("amount"));
        p.setMethod(rs.getString("method"));
        p.setStatus(rs.getString("status"));
        p.setCurrency(rs.getString("currency"));
        p.setTransactionRef(rs.getString("transaction_ref"));
        p.setCreatedAt(rs.getTimestamp("created_at"));
        return p;
    }
}