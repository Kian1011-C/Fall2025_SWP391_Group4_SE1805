package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dao.UserDao;
import hsf302.fa25.s3.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final UserDao userDao = new UserDao();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        Map<String, Object> response = new HashMap<>();
        User user = userDao.checkLogin(email, password);

        if (user == null) {
            response.put("success", false);
            response.put("message", "Email, mật khẩu sai hoặc tài khoản bị khóa!");
            return ResponseEntity.status(401).body(response);
        }

        // Đăng nhập thành công
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", "jwt-token-" + System.currentTimeMillis());
        response.put("user", Map.of(
            "id", user.getUserId(),
            "email", user.getEmail(),
            "name", user.getLastName() + " " + user.getFirstName(),
            "role", user.getRole(),
            "phone", user.getPhone(),
            "status", user.getStatus()
        ));
        
        String redirectUrl;
        switch (user.getRole().toUpperCase()) {
            case "ADMIN":
                redirectUrl = "/admin/dashboard?id=" + user.getUserId();
                break;
            case "STAFF":
                redirectUrl = "/staff/home?id=" + user.getUserId();
                break;
            case "EV DRIVER":
                redirectUrl = "/driver/home?id=" + user.getUserId();
                break;
            default:
                redirectUrl = "/";
                break;
        }
        response.put("redirect", redirectUrl);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String token) {
        // TODO: Implement token invalidation
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout successful");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> registerRequest) {
        // TODO: Implement actual registration logic with UserDao
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Registration feature is not implemented yet");
        
        return ResponseEntity.status(501).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "Unauthorized"
            ));
        }
        
        // TODO: Implement actual JWT token validation and extract user ID
        // For now, return mock data until token validation is implemented
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", Map.of(
            "id", 1,
            "email", "test@example.com",
            "name", "Test User", 
            "role", "DRIVER",
            "phone", "0123456789",
            "status", "ACTIVE"
        ));
        response.put("note", "Mock data - JWT token validation not implemented yet");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuthentication(@RequestHeader(value = "Authorization", required = false) String token) {
        Map<String, Object> response = new HashMap<>();
        
        if (token != null && !token.isEmpty()) {
            // TODO: Validate JWT token and get real user data
            response.put("authenticated", true);
            response.put("user", Map.of(
                "id", 1,
                "email", "test@example.com",
                "name", "Test User",
                "role", "DRIVER"
            ));
            response.put("note", "Mock data - JWT validation not implemented");
        } else {
            response.put("authenticated", false);
        }
        
        return ResponseEntity.ok(response);
    }
}