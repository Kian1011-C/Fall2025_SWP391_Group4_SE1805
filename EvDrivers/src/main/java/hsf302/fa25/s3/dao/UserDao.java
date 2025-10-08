package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.context.ConnectDB;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

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
}

