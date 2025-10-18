package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dao.UserDao;
import hsf302.fa25.s3.dao.UserDashboardDao;
import hsf302.fa25.s3.model.VehicleBatteryInfo;
import java.util.List;
import hsf302.fa25.s3.dao.VehicleDao;
import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.model.UserDashboard;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserDao userDao = new UserDao();
    private final UserDashboardDao dashboardDao;
    private final VehicleDao vehicleDao;

    public UserController() throws Exception {
        this.dashboardDao = new UserDashboardDao();
        this.vehicleDao = new VehicleDao();
    }

    // --- API MỚI ĐỂ LẤY TẤT CẢ USER (FIX LỖI 404) ---
    /**
     * Lấy danh sách tất cả người dùng (cho Admin).
     */
    @GetMapping
    public Map<String, Object> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Gọi hàm DAO bạn đã có
            List<User> users = userDao.getAllUsers();

            response.put("success", true);
            response.put("data", users);
            response.put("total", users.size());

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách người dùng: " + e.getMessage());
        }
        return response;
    }

    // --- CÁC API CŨ CỦA BẠN (GIỮ NGUYÊN) ---

    @GetMapping("/{id}")
    public Map<String, Object> getUserDashboard(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userDao.getUserById(id);
            if (user == null) {
                response.put("success", false);
                response.put("message", "Không tìm thấy user id " + id);
                return response;
            }

            UserDashboard dashboard = dashboardDao.getDashboardByUserId(id);
            List<VehicleBatteryInfo> vehicles = vehicleDao.getVehiclesWithBatteryByUser(id);

            response.put("success", true);
            response.put("user", user);
            response.put("dashboard", dashboard);
            response.put("vehicles", vehicles);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy dữ liệu: " + e.getMessage());
        }
        return response;
    }

    @GetMapping("/{userId}/profile")
    public Map<String, Object> getUserProfile(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userDao.getUserById(userId);
            if (user != null) {
                Map<String, Object> userProfile = new HashMap<>();
                userProfile.put("id", user.getUserId());
                userProfile.put("email", user.getEmail());
                userProfile.put("name", user.getLastName() + " " + user.getFirstName());
                userProfile.put("phone", user.getPhone());
                userProfile.put("role", user.getRole());
                userProfile.put("status", user.getStatus());
                userProfile.put("avatar", "https://via.placeholder.com/150");
                userProfile.put("cccd", user.getCccd());
                userProfile.put("joinDate", user.getCreatedAt());

                response.put("success", true);
                response.put("data", userProfile);
            } else {
                response.put("success", false);
                response.put("message", "User not found");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }

    @GetMapping("/{userId}/vehicles")
    public Map<String, Object> getUserVehicles(@PathVariable String userId) {
        System.out.println("🚗 UserController: getUserVehicles called with userId = " + userId);
        Map<String, Object> response = new HashMap<>();
        try {
            List<VehicleBatteryInfo> vehicles = vehicleDao.getVehiclesWithBatteryByUser(userId);
            System.out.println("🚗 UserController: VehicleDao returned " + vehicles.size() + " vehicles");

            response.put("success", true);
            response.put("data", vehicles);
            response.put("total", vehicles.size());
        } catch (Exception e) {
            System.err.println("🚗 UserController: Exception - " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }

    @GetMapping("/{userId}/notifications")
    public Map<String, Object> getUserNotifications(@PathVariable String userId) {
        // Mock data
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", new java.util.ArrayList<>());
        response.put("unreadCount", 0);
        response.put("note", "Mock data - Notification table not implemented");
        return response;
    }

    @GetMapping("/{userId}/statistics")
    public Map<String, Object> getUserStatistics(@PathVariable String userId) {
        // Mock data
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("monthlySwaps", 12);
            stats.put("totalDistance", 324);
            // ...
            response.put("success", true);
            response.put("data", stats);
            response.put("note", "Mock data - Real statistics calculation not implemented yet");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }

    @GetMapping("/{userId}/subscription")
    public Map<String, Object> getUserSubscription(@PathVariable String userId) {
        // Mock data
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> subscription = new HashMap<>();
            subscription.put("planName", "Gói Cơ Bản");
            // ...
            response.put("success", true);
            response.put("data", subscription);
            response.put("note", "Mock data - Real subscription lookup not implemented yet");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }
}