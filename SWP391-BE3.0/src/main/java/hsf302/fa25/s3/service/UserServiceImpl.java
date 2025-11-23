package hsf302.fa25.s3.service;

import hsf302.fa25.s3.repository.UserRepo;
import hsf302.fa25.s3.repository.UserDashboardRepo;
import hsf302.fa25.s3.repository.VehicleRepo;
import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.model.UserDashboard;
import hsf302.fa25.s3.model.VehicleBatteryInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepo userDao;
    private final UserDashboardRepo dashboardDao;
    private final VehicleRepo vehicleDao;

    @Autowired
    private EmailService emailService;

    public UserServiceImpl() throws Exception {
        this.userDao = new UserRepo();
        this.dashboardDao = new UserDashboardRepo();
        this.vehicleDao = new VehicleRepo();
    }

    // ================== DASHBOARD / PROFILE / VEHICLES ==================

    @Override
    public Map<String, Object> getUserDashboard(String id) {
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

    @Override
    public Map<String, Object> getUserProfile(String userId) {
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

    @Override
    public Map<String, Object> getUserVehicles(String userId) {
        System.out.println("🚗 UserService: getUserVehicles called with userId = " + userId);
        Map<String, Object> response = new HashMap<>();
        try {
            List<VehicleBatteryInfo> vehicles = vehicleDao.getVehiclesWithBatteryByUser(userId);
            System.out.println("🚗 UserService: VehicleDao returned " + vehicles.size() + " vehicles");

            response.put("success", true);
            response.put("data", vehicles);
            response.put("total", vehicles.size());
        } catch (Exception e) {
            System.err.println("🚗 UserService: Exception - " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }

    // ================== REGISTER + OTP ==================

    @Override
    public Map<String, Object> register(String firstName,
                                        String lastName,
                                        String email,
                                        String phone,
                                        String password,
                                        String cccd) {
        Map<String, Object> res = new HashMap<>();
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
            String otp = String.valueOf((int) (Math.random() * 900000 + 100000)); // 6 số
            Timestamp expire = Timestamp.from(Instant.now().plusSeconds(5 * 60));

            User u = User.builder()
                    .userId(userId)
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(email)
                    .phone(phone)
                    .password(password)
                    .role("EV Driver")
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
                System.err.println("Send OTP mail failed: " + e.getMessage());
            }

            res.put("success", true);
            res.put("data", u);
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

    @Override
    public Map<String, Object> verifyOtp(String userId, String otp) {
        Map<String, Object> res = new HashMap<>();
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

    // ================== FORGOT / RESET PASSWORD ==================

    @Override
    public Map<String, Object> forgotPassword(String email) {
        Map<String, Object> res = new HashMap<>();
        try {
            Optional<User> u = userDao.findByEmail(email);
            // Trả message chung để tránh dò email
            if (u.isEmpty()) {
                res.put("success", true);
                res.put("message", "Nếu email tồn tại, hệ thống đã gửi liên kết đặt lại.");
                return res;
            }
            // Tạo token + hạn 15 phút
            String token = UUID.randomUUID().toString();
            Timestamp expire = new Timestamp(System.currentTimeMillis() + 15 * 60 * 1000);
            userDao.saveResetToken(u.get().getUserId(), token, expire);

            String link = "http://localhost:3000/reset?token=" + token;
            emailService.sendResetEmail(u.get().getEmail(), link);

            res.put("success", true);
            res.put("message", "Nếu email tồn tại, hệ thống đã gửi liên kết đặt lại.");
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "Lỗi: " + e.getMessage());
            return res;
        }
    }

    @Override
    public Map<String, Object> verifyResetToken(String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            boolean ok = userDao.isResetTokenValid(token);
            res.put("success", ok);
            res.put("message", ok ? "Token hợp lệ." : "Link đã hết hạn hoặc không hợp lệ.");
            return res;
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Lỗi: " + e.getMessage());
            return res;
        }
    }

    @Override
    public Map<String, Object> resetPassword(String token, String newPassword) {
        Map<String, Object> res = new HashMap<>();
        try {
            if (newPassword == null || newPassword.length() < 8) {
                res.put("success", false);
                res.put("message", "Mật khẩu tối thiểu 8 ký tự.");
                return res;
            }
            if (!userDao.isResetTokenValid(token)) {
                res.put("success", false);
                res.put("message", "Link đã hết hạn hoặc không hợp lệ.");
                return res;
            }
            User u = userDao.findByResetToken(token);
            if (u == null) {
                res.put("success", false);
                res.put("message", "Token không hợp lệ.");
                return res;
            }

            boolean ok1 = userDao.updatePassword(u.getUserId(), newPassword);
            boolean ok2 = userDao.clearResetToken(u.getUserId());
            if (ok1 && ok2) {
                res.put("success", true);
                res.put("message", "Đặt lại mật khẩu thành công. Hãy đăng nhập bằng mật khẩu mới.");
            } else {
                res.put("success", false);
                res.put("message", "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
            }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "Lỗi: " + e.getMessage());
            return res;
        }
    }

    // ================== REGISTER VEHICLE ==================

    @Override
    public Map<String, Object> registerVehicleForUser(String userId,
                                                      String plateNumber,
                                                      String model,
                                                      String vinNumber) {
        Map<String, Object> res = new HashMap<>();
        try {
            if (isBlank(plateNumber) || isBlank(model) || isBlank(vinNumber)) {
                res.put("success", false);
                res.put("message", "Thiếu thông tin: biển số, model hoặc VIN.");
                return res;
            }

            User u = userDao.getUserById(userId);
            if (u == null || !"active".equalsIgnoreCase(u.getStatus())) {
                res.put("success", false);
                res.put("message", "Tài khoản không tồn tại hoặc chưa kích hoạt.");
                return res;
            }

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

            boolean ok = vehicleDao.createVehicleMinimal(userId, plateNumber, model, vinNumber);
            if (!ok) {
                res.put("success", false);
                res.put("message", "Đăng ký xe thất bại (DB lỗi hoặc dữ liệu trùng).");
                return res;
            }

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

    // ================== Helper ==================

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}