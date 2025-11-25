package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.model.Station;
import hsf302.fa25.s3.model.VehicleBatteryInfo;
import hsf302.fa25.s3.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {
        try {
            List<User> allUsers = adminService.getAllUsers();

            // Normalize role
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
                    normalizedRole = role.trim();
                }
            }

            // Filter by role
            List<User> filtered = allUsers;
            if (normalizedRole != null) {
                final String roleToMatch = normalizedRole;
                filtered = filtered.stream()
                        .filter(u -> roleToMatch.equalsIgnoreCase(u.getRole()))
                        .collect(Collectors.toList());
            }

            // Filter by status
            if (status != null && !status.isEmpty()) {
                filtered = filtered.stream()
                        .filter(u -> status.equalsIgnoreCase(u.getStatus()))
                        .collect(Collectors.toList());
            }

            // Apply search
            if (search != null && !search.trim().isEmpty()) {
                String searchLower = search.toLowerCase().trim();
                filtered = filtered.stream()
                        .filter(u ->
                                (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(searchLower)) ||
                                (u.getLastName() != null && u.getLastName().toLowerCase().contains(searchLower)) ||
                                (u.getEmail() != null && u.getEmail().toLowerCase().contains(searchLower)) ||
                                (u.getPhone() != null && u.getPhone().contains(search)) ||
                                (u.getCccd() != null && u.getCccd().contains(search))
                        ).collect(Collectors.toList());
            }

            // Pagination
            int start = page * size;
            int end = Math.min(start + size, filtered.size());
            List<User> paginated = filtered.subList(Math.min(start, filtered.size()), Math.max(start, end));

            // Build response
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
                        List<VehicleBatteryInfo> vehicles = adminService.getVehiclesByUserId(u.getUserId());
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
            User user = adminService.getUserById(userId);

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
                    List<VehicleBatteryInfo> vehicles = adminService.getVehiclesByUserId(userId);
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
            User created = adminService.createUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User created successfully");
            response.put("data", created);
            
            return ResponseEntity.status(201).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        } catch (IllegalStateException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(409).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error creating user: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User user) {
        try {
            User updated = adminService.updateUser(userId, user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User updated successfully");
            response.put("data", updated);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error updating user: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            adminService.deleteUser(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error deleting user: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/users/statistics")
    public ResponseEntity<?> getUserStatistics() {
        try {
            Map<String, Integer> stats = adminService.getUserStatistics();
            
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

    // ==================== STATION MANAGEMENT ====================

    @GetMapping("/stations")
    public ResponseEntity<?> getAllStations() {
        try {
            List<Station> stations = adminService.getAllStations();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stations);
            response.put("total", stations.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching stations: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/stations/{stationId}")
    public ResponseEntity<?> getStationById(@PathVariable Long stationId) {
        try {
            Station station = adminService.getStationById(stationId);
            
            if (station == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Station not found");
                return ResponseEntity.status(404).body(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", station);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching station: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/stations")
    public ResponseEntity<?> createStation(@RequestBody Station station) {
        try {
            Station created = adminService.createStation(station);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Station created successfully");
            response.put("data", created);
            
            return ResponseEntity.status(201).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error creating station: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/stations/{stationId}")
    public ResponseEntity<?> updateStation(@PathVariable Long stationId, @RequestBody Station station) {
        try {
            Station updated = adminService.updateStation(stationId, station);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Station updated successfully");
            response.put("data", updated);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error updating station: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/stations/{stationId}")
    public ResponseEntity<?> deleteStation(@PathVariable Long stationId) {
        try {
            adminService.deleteStation(stationId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Station deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error deleting station: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ==================== VEHICLE MANAGEMENT ====================

    @GetMapping("/vehicles")
    public ResponseEntity<?> getAllVehicles() {
        try {
            List<VehicleBatteryInfo> vehicles = adminService.getAllVehicles();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", vehicles);
            response.put("total", vehicles.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching vehicles: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/vehicles/{vehicleId}")
    public ResponseEntity<?> getVehicleById(@PathVariable int vehicleId) {
        try {
            VehicleBatteryInfo vehicle = adminService.getVehicleById(vehicleId);
            
            if (vehicle == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Vehicle not found");
                return ResponseEntity.status(404).body(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", vehicle);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching vehicle: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/vehicles")
    public ResponseEntity<?> createVehicle(@RequestBody VehicleBatteryInfo vehicle) {
        try {
            VehicleBatteryInfo created = adminService.createVehicle(vehicle);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehicle created successfully");
            response.put("data", created);
            
            return ResponseEntity.status(201).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error creating vehicle: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/vehicles/{vehicleId}")
    public ResponseEntity<?> updateVehicle(@PathVariable int vehicleId, @RequestBody VehicleBatteryInfo vehicle) {
        try {
            VehicleBatteryInfo updated = adminService.updateVehicle(vehicleId, vehicle);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehicle updated successfully");
            response.put("data", updated);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error updating vehicle: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/vehicles/{vehicleId}")
    public ResponseEntity<?> deleteVehicle(@PathVariable int vehicleId) {
        try {
            adminService.deleteVehicle(vehicleId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehicle deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error deleting vehicle: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
