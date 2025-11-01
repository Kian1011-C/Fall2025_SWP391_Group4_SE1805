package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dao.UserDao;
import hsf302.fa25.s3.dao.UserDashboardDao;
import hsf302.fa25.s3.model.VehicleBatteryInfo;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

import hsf302.fa25.s3.dao.VehicleDao;
import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.model.UserDashboard;
import hsf302.fa25.s3.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserDao userDao = new UserDao();
    private final UserDashboardDao dashboardDao;
    private final VehicleDao vehicleDao;

    @Autowired
    private EmailService emailService;

    public UserController() throws Exception {
        this.dashboardDao = new UserDashboardDao();
        this.vehicleDao = new VehicleDao();
    }

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
            response.put("vehicles", vehicles); // 🔥 thêm dòng này
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
                userProfile.put("name", user.getLastName() + " " + user.getFirstName()); // Vietnamese name format: Họ + Tên
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
        // Mock data - Notification table not implemented yet
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", new java.util.ArrayList<>());
        response.put("unreadCount", 0);
        response.put("note", "Mock data - Notification table not implemented");
        return response;
    }

    @GetMapping("/{userId}/statistics")
    public Map<String, Object> getUserStatistics(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: Implement real statistics calculation from Swaps and Contracts tables
            // For now, return mock data based on user data
            Map<String, Object> stats = new HashMap<>();
            stats.put("monthlySwaps", 12);
            stats.put("totalDistance", 324);
            stats.put("totalSavings", 156000);
            stats.put("batteryLevel", 75);
            stats.put("batteryHealth", 92);
            
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
        Map<String, Object> response = new HashMap<>();
        try {
            // TODO: Implement real subscription lookup from Contracts table
            // For now, return mock data
            Map<String, Object> subscription = new HashMap<>();
            subscription.put("planName", "Gói Cơ Bản");
            subscription.put("monthlyFee", 270000);
            subscription.put("maxDistance", 400);
            subscription.put("startDate", "2024-01-01");
            subscription.put("endDate", "2024-12-31");
            subscription.put("status", "ACTIVE");
            
            response.put("success", true);
            response.put("data", subscription);
            response.put("note", "Mock data - Real subscription lookup not implemented yet");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }

    @PostMapping("/register")
    public Map<String,Object> register(@RequestParam String firstName,
                                       @RequestParam String lastName,
                                       @RequestParam String email,
                                       @RequestParam(required = false) String phone,
                                       @RequestParam String password,
                                       @RequestParam(required = false) String cccd ) {
        Map<String,Object> res = new HashMap<>();
        try {
            // validate tồn tại
            if (userDao.emailExists(email)) {
                res.put("success", false);
                res.put("message", "Email đã tồn tại.");
                return res;
            }
            if (phone != null && !phone.isBlank() && userDao.phoneExists(phone)) {
                res.put("success", false);
                res.put("message", "Số điện thoại đã tồn tại.");
                return res;
            }

            // Tạo user_id chuỗi ngắn gọn
            String userId = "U" + UUID.randomUUID().toString().replace("-", "").substring(0, 11);

            // Sinh OTP và hạn
            String otp = String.valueOf((int)(Math.random()*900000 + 100000)); // 6 số
            Timestamp expire = Timestamp.from(Instant.now().plusSeconds(5*60));

            User u = User.builder()
                    .userId(userId)
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(email)
                    .phone(phone)
                    .password(password)
                    .role("EV Driver")     // bạn có thể để cố định EV Driver khi tự đăng ký
                    .cccd(cccd)
                    .status("inactive")
                    .otpCode(otp)
                    .otpExpire(expire)
                    .isEmailVerified(false)
                    .build();

            boolean ok = userDao.addPending(u);
            if (!ok) {
                res.put("success", false);
                res.put("message", "Đăng ký thất bại.");
                return res;
            }

            // Gửi mail OTP
            try {
                emailService.sendOtpEmail(email, otp);
            } catch (Exception e) {
                // Nếu mail lỗi vẫn cho đi verify page (dev có thể in OTP ở log)
                System.err.println("Send OTP mail failed: " + e.getMessage());
            }

            res.put("success", true);
            res.put("userId", userId);
            res.put("redirect", "/verify-otp?userId=" + userId);
            res.put("message", "Đăng ký thành công! Vui lòng kiểm tra email để nhập OTP.");
            return res;

        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "Lỗi khi đăng ký: " + e.getMessage());
            return res;
        }
    }

    // --- VERIFY OTP: kích hoạt tài khoản ---
    @PostMapping("/verify-otp")
    public Map<String,Object> verifyOtp(@RequestParam String userId, @RequestParam String otp) {
        Map<String,Object> res = new HashMap<>();
        boolean ok = userDao.verifyOtp(userId, otp);
        if (ok) {
            res.put("success", true);
            res.put("message", "Xác thực thành công. Tài khoản đã được kích hoạt.");
            res.put("redirect", "/api/users" + userId);
        } else {
            res.put("success", false);
            res.put("message", "OTP không đúng hoặc đã hết hạn.");
        }
        return res;
    }

    // (login & các API khác của bạn giữ nguyên)

    // Quen mat khau - gui mail reset
    @PostMapping("/forgot")
    public Map<String,Object> forgot(@RequestParam String email){
        Map<String,Object> res=new HashMap<>();
        try{
            Optional<User> u = userDao.findByEmail(email);
            // Trả message chung để tránh dò email
            if (u.isEmpty()) {
                res.put("success", true);
                res.put("message", "Nếu email tồn tại, hệ thống đã gửi liên kết đặt lại.");
                return res;
            }
            // Tạo token + hạn 15 phút
            String token = java.util.UUID.randomUUID().toString();
            Timestamp expire = new Timestamp(System.currentTimeMillis() + 15*60*1000);
            userDao.saveResetToken(u.get().getUserId(), token, expire);

            // Link reset
            String link = "http://localhost:8080/reset?token=" + token;
            emailService.sendResetEmail(u.get().getEmail(), link);

            res.put("success", true);
            res.put("message", "Nếu email tồn tại, hệ thống đã gửi liên kết đặt lại.");
            return res;
        }catch(Exception e){
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "Lỗi: " + e.getMessage());
            return res;
        }
    }

    @GetMapping("/reset/verify")
    public Map<String,Object> verifyResetToken(@RequestParam String token){
        Map<String,Object> res = new HashMap<>();
        try{
            boolean ok = userDao.isResetTokenValid(token);
            res.put("success", ok);
            res.put("message", ok ? "Token hợp lệ." : "Link đã hết hạn hoặc không hợp lệ.");
            return res;
        }catch(Exception e){
            res.put("success", false);
            res.put("message", "Lỗi: " + e.getMessage());
            return res;
        }
    }

    // 2) Đặt lại mật khẩu
    @PostMapping("/reset")
    public Map<String,Object> doReset(@RequestParam String token,
                                      @RequestParam String newPassword){
        Map<String,Object> res = new HashMap<>();
        try{
            if (newPassword == null || newPassword.length() < 8){
                res.put("success", false);
                res.put("message", "Mật khẩu tối thiểu 8 ký tự.");
                return res;
            }
            if (!userDao.isResetTokenValid(token)){
                res.put("success", false);
                res.put("message", "Link đã hết hạn hoặc không hợp lệ.");
                return res;
            }
            User u = userDao.findByResetToken(token);
            if (u == null){
                res.put("success", false);
                res.put("message", "Token không hợp lệ.");
                return res;
            }

            // (Dev hiện tại dùng plain; production nên BCrypt)
            boolean ok1 = userDao.updatePassword(u.getUserId(), newPassword);
            boolean ok2 = userDao.clearResetToken(u.getUserId());
            if (ok1 && ok2){
                res.put("success", true);
                res.put("message", "Đặt lại mật khẩu thành công. Hãy đăng nhập bằng mật khẩu mới.");
            }else{
                res.put("success", false);
                res.put("message", "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
            }
            return res;
        }catch(Exception e){
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "Lỗi: " + e.getMessage());
            return res;
        }
    }

    // ==================== API ĐĂNG KÝ XE (CHỈ 3 TRƯỜNG) ====================

    /**
     * Đăng ký xe cho user (form/x-www-form-urlencoded hoặc form-data).
     * Endpoint: POST /api/users/{userId}/vehicles
     * Params: plateNumber, model, vinNumber
     */
    @PostMapping("/{userId}/vehicles")
    public Map<String, Object> registerVehicleForUser(
            @PathVariable String userId,
            @RequestParam String plateNumber,
            @RequestParam String model,
            @RequestParam String vinNumber
    ) {
        Map<String, Object> res = new HashMap<>();
        try {
            // 1) Validate input
            if (isBlank(plateNumber) || isBlank(model) || isBlank(vinNumber)) {
                res.put("success", false);
                res.put("message", "Thiếu thông tin: biển số, model hoặc VIN.");
                return res;
            }

            // 2) User phải tồn tại & active
            User u = userDao.getUserById(userId);
            if (u == null || !"active".equalsIgnoreCase(u.getStatus())) {
                res.put("success", false);
                res.put("message", "Tài khoản không tồn tại hoặc chưa kích hoạt.");
                return res;
            }

            // 3) Chống trùng
            if (vehicleDao.existsByPlate(plateNumber)) {
                res.put("success", false);
                res.put("message", "Biển số đã tồn tại.");
                return res;
            }
            if (vehicleDao.existsByVin(vinNumber)) {
                res.put("success", false);
                res.put("message", "VIN đã tồn tại.");
                return res;
            }

            // 4) Tạo vehicle tối giản (battery fields = NULL, odometer=0)
            boolean ok = vehicleDao.createVehicleMinimal(userId, plateNumber, model, vinNumber);
            if (!ok) {
                res.put("success", false);
                res.put("message", "Đăng ký xe thất bại (DB lỗi hoặc dữ liệu trùng).");
                return res;
            }

            // 5) Thành công → trả danh sách xe mới nhất
            res.put("success", true);
            res.put("message", "Đăng ký xe thành công!");
            res.put("data", vehicleDao.getVehiclesWithBatteryByUser(userId));
            return res;

        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "Lỗi hệ thống: " + e.getMessage());
            return res;
        }
    }

    // ==================== Helper ====================

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}


