package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // Constructor injection
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =============== DASHBOARD ===============

    @GetMapping("/{id}")
    public Map<String, Object> getUserDashboard(@PathVariable String id) {
        return userService.getUserDashboard(id);
    }

    // =============== PROFILE ===============

    @GetMapping("/{userId}/profile")
    public Map<String, Object> getUserProfile(@PathVariable String userId) {
        return userService.getUserProfile(userId);
    }

    // =============== VEHICLES ===============

    @GetMapping("/{userId}/vehicles")
    public Map<String, Object> getUserVehicles(@PathVariable String userId) {
        return userService.getUserVehicles(userId);
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestParam String firstName,
                                        @RequestParam String lastName,
                                        @RequestParam String email,
                                        @RequestParam(required = false) String phone,
                                        @RequestParam String password,
                                        @RequestParam(required = false) String cccd) {
        return userService.register(firstName, lastName, email, phone, password, cccd);
    }

    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestParam String userId,
                                         @RequestParam String otp) {
        return userService.verifyOtp(userId, otp);
    }

    // =============== FORGOT / RESET PASSWORD ===============

    @PostMapping("/forgot")
    public Map<String, Object> forgot(@RequestParam String email) {
        return userService.forgotPassword(email);
    }

    @GetMapping("/reset/verify")
    public Map<String, Object> verifyResetToken(@RequestParam String token) {
        return userService.verifyResetToken(token);
    }

    @PostMapping("/reset")
    public Map<String, Object> doReset(@RequestParam String token,
                                       @RequestParam String newPassword) {
        return userService.resetPassword(token, newPassword);
    }

    // =============== REGISTER VEHICLE ===============

    @PostMapping("/{userId}/vehicles")
    public Map<String, Object> registerVehicleForUser(
            @PathVariable String userId,
            @RequestParam String plateNumber,
            @RequestParam String model,
            @RequestParam String vinNumber
    ) {
        return userService.registerVehicleForUser(userId, plateNumber, model, vinNumber);
    }
}
