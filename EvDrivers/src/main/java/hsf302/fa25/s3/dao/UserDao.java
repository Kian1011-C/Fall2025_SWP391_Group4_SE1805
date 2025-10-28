package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.context.ConnectDB;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.context.ConnectDB;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class UserDao {

    public List<User> getAllUsers() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT * FROM Users";

        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                User u = User.builder()
                        .userId(rs.getString("user_id"))
                        .firstName(rs.getString("first_name"))
                        .lastName(rs.getString("last_name"))
                        .email(rs.getString("email"))
                        .phone(rs.getString("phone"))
                        .password(rs.getString("password")) // ✅ Đổi lại cho đúng
                        .role(rs.getString("role"))
                        .cccd(rs.getString("cccd"))
                        .status(rs.getString("status"))
                        .createdAt(rs.getTimestamp("created_at"))
                        .updatedAt(rs.getTimestamp("updated_at"))
                        .build();
                list.add(u);
            }

        } catch (SQLException e) {
            System.err.println("Lỗi khi lấy danh sách user: " + e.getMessage());
        }
        return list;
    }

    public User checkLogin(String email, String password) {
        // ✅ Sửa lại: password (không phải password_hash)
        String sql = "SELECT * FROM Users WHERE email = ? AND password = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                String status = rs.getString("status");
                if (!"active".equalsIgnoreCase(status)) {
                    return null;
                }

                return User.builder()
                        .userId(rs.getString("user_id"))
                        .firstName(rs.getString("first_name"))
                        .lastName(rs.getString("last_name"))
                        .email(rs.getString("email"))
                        .phone(rs.getString("phone"))
                        .password(rs.getString("password"))
                        .role(rs.getString("role"))
                        .cccd(rs.getString("cccd"))
                        .status(status)
                        .createdAt(rs.getTimestamp("created_at"))
                        .updatedAt(rs.getTimestamp("updated_at"))
                        .build();
            }

        } catch (SQLException e) {
            System.err.println("Lỗi khi kiểm tra login: " + e.getMessage());
        }
        return null;
    }

    public boolean addUser(User user) {
        // ✅ Cũng đổi password_hash → password
        String sql = "INSERT INTO Users (first_name, last_name, email, phone, password, role, cccd, status, created_at, updated_at) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), GETDATE())";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, user.getFirstName());
            ps.setString(2, user.getLastName());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPhone());
            ps.setString(5, user.getPassword());
            ps.setString(6, user.getRole());
            ps.setString(7, user.getCccd());
            ps.setString(8, user.getStatus());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Lỗi khi thêm user: " + e.getMessage());
            return false;
        }
    }

    public boolean updateUser(User user) {
        // ✅ password_hash → password
        String sql = "UPDATE Users SET first_name=?, last_name=?, email=?, phone=?, password=?, role=?, cccd=?, status=?, updated_at=GETDATE() WHERE user_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, user.getFirstName());
            ps.setString(2, user.getLastName());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPhone());
            ps.setString(5, user.getPassword());
            ps.setString(6, user.getRole());
            ps.setString(7, user.getCccd());
            ps.setString(8, user.getStatus());
            ps.setString(9, user.getUserId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("❌ Lỗi khi cập nhật user: " + e.getMessage());
            return false;
        }
    }

    public boolean deleteUser(String userId) {
        String sql = "DELETE FROM Users WHERE user_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Lỗi khi xóa user: " + e.getMessage());
            return false;
        }
    }

    public User getUserById(String userId) {
        String sql = "SELECT * FROM Users WHERE user_id = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return User.builder()
                        .userId(rs.getString("user_id"))
                        .firstName(rs.getString("first_name"))
                        .lastName(rs.getString("last_name"))
                        .email(rs.getString("email"))
                        .phone(rs.getString("phone"))
                        .password(rs.getString("password"))
                        .role(rs.getString("role"))
                        .cccd(rs.getString("cccd"))
                        .status(rs.getString("status"))
                        .createdAt(rs.getTimestamp("created_at"))
                        .updatedAt(rs.getTimestamp("updated_at"))
                        .build();
            }

        } catch (SQLException e) {
            System.err.println("Lỗi khi lấy user theo ID: " + e.getMessage());
        }
        return null;
    }


    public boolean emailExists(String email) {
        String sql = "SELECT 1 FROM Users WHERE email = ?";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) { return rs.next(); }
        } catch (SQLException e) {
            System.err.println("emailExists err: " + e.getMessage());
            return false;
        }
    }

    public boolean phoneExists(String phone) {
        if (phone == null || phone.isBlank()) return false;
        String sql = "SELECT 1 FROM Users WHERE phone = ?";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, phone);
            try (ResultSet rs = ps.executeQuery()) { return rs.next(); }
        } catch (SQLException e) {
            System.err.println("phoneExists err: " + e.getMessage());
            return false;
        }
    }

    /** Thêm user mới ở trạng thái pending; trả về true nếu OK */
    public boolean addPending(User u) {
        String sql = """
            INSERT INTO Users
              (user_id, first_name, last_name, email, phone, password, role, cccd,
               otp_code, otp_expire, is_email_verified, status, created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,0,'inactive',GETDATE(),GETDATE())
        """;
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, u.getUserId());
            ps.setString(2, u.getFirstName());
            ps.setString(3, u.getLastName());
            ps.setString(4, u.getEmail());
            ps.setString(5, u.getPhone());
            ps.setString(6, u.getPassword());
            ps.setString(7, u.getRole());
            ps.setString(8, u.getCccd());
            ps.setString(9, u.getOtpCode());                     // có thể null
            ps.setTimestamp(10, u.getOtpExpire());                // có thể null

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("Lỗi khi thêm user: " + e.getMessage());
            return false;
        }
    }

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM Users WHERE email = ?";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(map(rs));
            }
        } catch (SQLException e) {
            System.err.println("findByEmail err: " + e.getMessage());
        }
        return Optional.empty();
    }

    public Optional<User> findById(String userId) {
        String sql = "SELECT * FROM Users WHERE user_id = ?";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(map(rs));
            }
        } catch (SQLException e) {
            System.err.println("findById err: " + e.getMessage());
        }
        return Optional.empty();
    }

    public boolean saveOtpForUser(String userId, String otp, Timestamp expire) {
        String sql = "UPDATE Users SET otp_code=?, otp_expire=? WHERE user_id=?";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, otp);
            ps.setTimestamp(2, expire);
            ps.setString(3, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("saveOtp err: " + e.getMessage());
            return false;
        }
    }

    /** Đúng OTP & còn hạn -> active + is_email_verified = 1, xóa OTP */
    public boolean verifyOtp(String userId, String otp) {
        String sql = "SELECT otp_code, otp_expire FROM Users WHERE user_id=?";
        try (Connection c = ConnectDB.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return false;
                String dbOtp = rs.getString("otp_code");
                Timestamp exp = rs.getTimestamp("otp_expire");
                boolean valid = (dbOtp != null && dbOtp.equals(otp) &&
                        exp != null && exp.after(new Timestamp(System.currentTimeMillis())));
                if (!valid) return false;
            }
            try (PreparedStatement ps2 = c.prepareStatement(
                    "UPDATE Users SET status='active', is_email_verified=1, otp_code=NULL, otp_expire=NULL, updated_at=GETDATE() WHERE user_id=?")) {
                ps2.setString(1, userId);
                return ps2.executeUpdate() > 0;
            }
        } catch (SQLException e) {
            System.err.println("verifyOtp err: " + e.getMessage());
            return false;
        }
    }

    private User map(ResultSet rs) throws SQLException {
        return User.builder()
                .userId(rs.getString("user_id"))
                .firstName(rs.getString("first_name"))
                .lastName(rs.getString("last_name"))
                .email(rs.getString("email"))
                .phone(rs.getString("phone"))
                .password(rs.getString("password"))
                .role(rs.getString("role"))
                .cccd(rs.getString("cccd"))
                .status(rs.getString("status"))
                .otpCode(rs.getString("otp_code"))
                .otpExpire(rs.getTimestamp("otp_expire"))
                .isEmailVerified(rs.getBoolean("is_email_verified"))
                .createdAt(rs.getTimestamp("created_at"))
                .updatedAt(rs.getTimestamp("updated_at"))
                .build();
    }
    // Lưu token reset
    public boolean saveResetToken(String userId, String token, Timestamp expire){
        String sql="UPDATE Users SET reset_token=?, reset_expire=?, updated_at=GETDATE() WHERE user_id=?";
        try(Connection c=ConnectDB.getConnection();
            PreparedStatement ps=c.prepareStatement(sql)){
            ps.setString(1,token);
            ps.setTimestamp(2,expire);
            ps.setString(3,userId);
            return ps.executeUpdate()>0;
        }catch(Exception e){ e.printStackTrace(); }
        return false;
    }

    // Tìm user theo token
    public User findByResetToken(String token){
        String sql="SELECT * FROM Users WHERE reset_token = ?";
        try(Connection c=ConnectDB.getConnection();
            PreparedStatement ps=c.prepareStatement(sql)){
            ps.setString(1,token);
            try(ResultSet rs=ps.executeQuery()){
                if(rs.next()) return map(rs);
            }
        }catch(Exception e){ e.printStackTrace(); }
        return null;
    }

    // Token còn hạn không?
    public boolean isResetTokenValid(String token){
        String sql="SELECT 1 FROM Users WHERE reset_token=? AND reset_expire > GETDATE()";
        try(Connection c=ConnectDB.getConnection();
            PreparedStatement ps=c.prepareStatement(sql)){
            ps.setString(1,token);
            try(ResultSet rs=ps.executeQuery()){
                return rs.next();
            }
        }catch(Exception e){ e.printStackTrace(); }
        return false;
    }

    // Cập nhật mật khẩu (NHỚ mã hoá ở môi trường thật!)
    public boolean updatePassword(String userId, String newPassword){
        String sql="UPDATE Users SET password=?, updated_at=GETDATE() WHERE user_id=?";
        try(Connection c=ConnectDB.getConnection();
            PreparedStatement ps=c.prepareStatement(sql)){
            ps.setString(1,newPassword);
            ps.setString(2,userId);
            return ps.executeUpdate()>0;
        }catch(Exception e){ e.printStackTrace(); }
        return false;
    }

    // Xoá token sau khi dùng
    public boolean clearResetToken(String userId){
        String sql="UPDATE Users SET reset_token=NULL, reset_expire=NULL, updated_at=GETDATE() WHERE user_id=?";
        try(Connection c=ConnectDB.getConnection();
            PreparedStatement ps=c.prepareStatement(sql)){
            ps.setString(1,userId);
            return ps.executeUpdate()>0;
        }catch(Exception e){ e.printStackTrace(); }
        return false;
    }

}