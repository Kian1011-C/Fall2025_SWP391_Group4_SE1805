package hsf302.fa25.s3.service;
import java.util.Map;

public interface UserService {

    Map<String, Object> getUserDashboard(String userId);

    Map<String, Object> getUserProfile(String userId);

    Map<String, Object> getUserVehicles(String userId);

    Map<String, Object> register(String firstName,
                                 String lastName,
                                 String email,
                                 String phone,
                                 String password,
                                 String cccd);

    Map<String, Object> verifyOtp(String userId, String otp);

    Map<String, Object> forgotPassword(String email);

    Map<String, Object> verifyResetToken(String token);

    Map<String, Object> resetPassword(String token, String newPassword);

    Map<String, Object> registerVehicleForUser(String userId,
                                               String plateNumber,
                                               String model,
                                               String vinNumber);
}
