package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dao.UserDao;
import hsf302.fa25.s3.dao.VehicleDao;
import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.model.VehicleBatteryInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserDao userDao = new UserDao();
    private VehicleDao vehicleDao;

    public AdminController() {
        try {
            this.vehicleDao = new VehicleDao();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ==================== UNIFIED USER MANAGEMENT CRUD APIs ====================

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {
        try {
            List<User> allUsers = userDao.getAllUsers();

            // Normalize incoming role query param to match stored role values.
            // Frontend may send values like: "driver", "staff", "admin"
            // but DB stores values like: "EV Driver", "Staff", "Admin".
            String normalizedRole = null;
            if (role != null && !role.trim().isEmpty()) {
                String rp = role.trim().toLowerCase();
                if (rp.equals("driver") || rp.equals("drivers") || rp.equals("ev driver") || rp.equals("ev_driver")) {
                    normalizedRole = "EV Driver";
                } else if (rp.equals("staff") || rp.equals("staffs") || rp.equals("staff_member")) {
                    normalizedRole = "Staff";
                } else if (rp.equals("admin") || rp.equals("administrator")) {
                    normalizedRole = "Admin";
                } else {
                    // Unknown mapping: use raw value and rely on equalsIgnoreCase
                    normalizedRole = role.trim();
                }
            }

            // Filter by role when provided
            List<User> filtered = allUsers;
            if (normalizedRole != null) {
                final String roleToMatch = normalizedRole;
                filtered = filtered.stream()
                        .filter(u -> roleToMatch.equalsIgnoreCase(u.getRole()))
                        .collect(Collectors.toList());
            }

            // Apply status filter
            if (status != null && !status.isEmpty()) {
                filtered = filtered.stream()
                        .filter(u -> status.equalsIgnoreCase(u.getStatus()))
                        .collect(Collectors.toList());
            }

            // Apply search filter
            if (search != null && !search.trim().isEmpty()) {
                String searchLower = search.toLowerCase().trim();
                filtered = filtered.stream()
                        .filter(u ->
                                (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(searchLower)) ||
                                        (u.getLastName() != null && u.getLastName().toLowerCase().contains(searchLower)) ||
                                        (u.getEmail() != null && u.getEmail().toLowerCase().contains(searchLower)) ||
                                        (u.getPhone() != null && u.getPhone().contains(search)) ||
                                        (u.getCccd() != null && u.getCccd().contains(search))
                        )
                        .collect(Collectors.toList());
            }

            // Apply pagination
            int start = page * size;
            int end = Math.min(start + size, filtered.size());
            List<User> paginated = filtered.subList(Math.min(start, filtered.size()), Math.max(start, end));

            // Build response list (include vehicles for drivers)
            List<Map<String, Object>> usersWithExtras = new ArrayList<>();
            for (User u : paginated) {
                Map<String, Object> udata = new HashMap<>();
                udata.put("userId", u.getUserId());
                udata.put("firstName", u.getFirstName());
                udata.put("lastName", u.getLastName());
                udata.put("email", u.getEmail());
                udata.put("phone", u.getPhone());
                udata.put("cccd", u.getCccd());
                udata.put("status", u.getStatus());
                udata.put("role", u.getRole());
                udata.put("createdAt", u.getCreatedAt());
                udata.put("updatedAt", u.getUpdatedAt());

                if (u.getRole() != null && "EV Driver".equalsIgnoreCase(u.getRole())) {
                    try {
                        List<VehicleBatteryInfo> vehicles = vehicleDao.getVehiclesWithBatteryByUser(u.getUserId());
                        udata.put("vehicles", vehicles);
                        udata.put("vehicleCount", vehicles.size());
                    } catch (Exception e) {
                        udata.put("vehicles", new ArrayList<>());
                        udata.put("vehicleCount", 0);
                    }
                }

                usersWithExtras.add(udata);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", usersWithExtras);
            response.put("total", filtered.size());
            response.put("page", page);
            response.put("size", size);
            response.put("totalPages", (filtered.size() + size - 1) / size);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching users: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            User user = userDao.getUserById(userId);

            if (user == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", user.getUserId());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());
            userData.put("email", user.getEmail());
            userData.put("phone", user.getPhone());
            userData.put("cccd", user.getCccd());
            userData.put("status", user.getStatus());
            userData.put("role", user.getRole());
            userData.put("createdAt", user.getCreatedAt());
            userData.put("updatedAt", user.getUpdatedAt());

            if (user.getRole() != null && "EV Driver".equalsIgnoreCase(user.getRole())) {
                try {
                    List<VehicleBatteryInfo> vehicles = vehicleDao.getVehiclesWithBatteryByUser(userId);
                    userData.put("vehicles", vehicles);
                } catch (Exception e) {
                    userData.put("vehicles", new ArrayList<>());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userData);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching user: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Validate required fields
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.status(400).body(response);
            }

            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Password is required");
                return ResponseEntity.status(400).body(response);
            }

            // Check if email already exists
            List<User> existingUsers = userDao.getAllUsers();
            boolean emailExists = existingUsers.stream()
                    .anyMatch(u -> user.getEmail().equalsIgnoreCase(u.getEmail()));

            if (emailExists) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email already exists");
                return ResponseEntity.status(400).body(response);
            }

            // Set role and defaults
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("EV Driver");
            }
            if (user.getStatus() == null || user.getStatus().isEmpty()) {
                user.setStatus("active");
            }

            // Ensure DB non-nullable fields are not null
            if (user.getPhone() == null) user.setPhone("");
            if (user.getFirstName() == null) user.setFirstName("");
            if (user.getLastName() == null) user.setLastName("");

            // Generate user ID if not provided
            if (user.getUserId() == null || user.getUserId().isEmpty()) {
                user.setUserId(user.getEmail()); // Use email as user ID
            }

            boolean created = userDao.addUser(user);

            Map<String, Object> response = new HashMap<>();
            if (created) {
                response.put("success", true);
                response.put("message", "User created successfully");
                response.put("data", user);
            } else {
                response.put("success", false);
                response.put("message", "Failed to create user");
                return ResponseEntity.status(500).body(response);
            }

            return ResponseEntity.status(201).body(response);
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error creating staff member: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }

        // Staff-specific endpoints removed — manage staff via unified /users CRUD

        // ==================== VEHICLE MANAGEMENT APIs ====================

        @GetMapping("/users/{userId}/vehicles")
        public ResponseEntity<?> getUserVehicles(@PathVariable String userId) {
            try {
                // Check if driver exists
                User driver = userDao.getUserById(userId);
                if (driver == null) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "User not found");
                    return ResponseEntity.status(404).body(response);
                }

                if (!"EV Driver".equalsIgnoreCase(driver.getRole())) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "User is not a driver");
                    return ResponseEntity.status(400).body(response);
                }

                List<VehicleBatteryInfo> vehicles = vehicleDao.getVehiclesWithBatteryByUser(userId);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", vehicles);
                response.put("total", vehicles.size());

                return ResponseEntity.ok(response);
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error fetching driver vehicles: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }

        @GetMapping("/statistics")
        public ResponseEntity<?> getAdminStatistics() {
            try {
                List<User> allUsers = userDao.getAllUsers();

                long driverCount = allUsers.stream().filter(u -> "EV Driver".equalsIgnoreCase(u.getRole())).count();
                long staffCount = allUsers.stream().filter(u -> "Staff".equalsIgnoreCase(u.getRole())).count();
                long activeDrivers = allUsers.stream()
                        .filter(u -> "EV Driver".equalsIgnoreCase(u.getRole()) && "active".equalsIgnoreCase(u.getStatus()))
                        .count();
                long activeStaff = allUsers.stream()
                        .filter(u -> "Staff".equalsIgnoreCase(u.getRole()) && "active".equalsIgnoreCase(u.getStatus()))
                        .count();

                Map<String, Object> stats = new HashMap<>();
                stats.put("totalDrivers", driverCount);
                stats.put("totalStaff", staffCount);
                stats.put("activeDrivers", activeDrivers);
                stats.put("activeStaff", activeStaff);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", stats);

                return ResponseEntity.ok(response);
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error fetching statistics: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }
    }