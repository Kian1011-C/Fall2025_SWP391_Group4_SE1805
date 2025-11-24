package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    //  Spring sẽ inject AuthServiceImpl vào đây
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Map<String, Object> response = new HashMap<>();


        User user = authService.login(email, password);

        if (user == null) {
            response.put("success", false);
            response.put("message", "Email, mật khẩu sai hoặc tài khoản bị khóa!");
            return ResponseEntity.status(401).body(response);
        }


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
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader(value = "Authorization", required = false) String token) {

        Map<String, Object> response = new HashMap<>();


        boolean ok = authService.logout(token);

        if (!ok) {
            response.put("success", false);
            response.put("message", "No token provided");
            return ResponseEntity.status(400).body(response);
        }

        response.put("success", true);
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }
}
