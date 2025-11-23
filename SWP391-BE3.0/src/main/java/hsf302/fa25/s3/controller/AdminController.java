package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.repository.UserRepo;
import hsf302.fa25.s3.repository.VehicleRepo;
import hsf302.fa25.s3.repository.StationRepo;
import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.model.Station;
import hsf302.fa25.s3.model.VehicleBatteryInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepo userDao = new UserRepo();
    private final StationRepo stationDao = new StationRepo();
    private VehicleRepo vehicleDao;

    public AdminController() {
        try {
            this.vehicleDao = new VehicleRepo();
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

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User user) {
        try {
            User existing = userDao.getUserById(userId);
            if (existing == null) {
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", false);
                resp.put("message", "User not found");
                return ResponseEntity.status(404).body(resp);
            }

            // Validate email uniqueness if changed
            if (user.getEmail() != null && !user.getEmail().equalsIgnoreCase(existing.getEmail())) {
                if (userDao.emailExists(user.getEmail())) {
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("success", false);
                    resp.put("message", "Email already in use");
                    return ResponseEntity.status(400).body(resp);
                }
            }

            // Validate phone uniqueness if provided and changed
            if (user.getPhone() != null && !user.getPhone().isBlank() && !user.getPhone().equals(existing.getPhone())) {
                if (userDao.phoneExists(user.getPhone())) {
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("success", false);
                    resp.put("message", "Phone already in use");
                    return ResponseEntity.status(400).body(resp);
                }
            }

            // Merge incoming fields (preserve existing values when omitted)
            user.setUserId(userId);
            if (user.getFirstName() == null) user.setFirstName(existing.getFirstName());
            if (user.getLastName() == null) user.setLastName(existing.getLastName());
            if (user.getEmail() == null) user.setEmail(existing.getEmail());
            if (user.getPhone() == null) user.setPhone(existing.getPhone());
            if (user.getPassword() == null) user.setPassword(existing.getPassword());
            if (user.getRole() == null) user.setRole(existing.getRole());
            if (user.getCccd() == null) user.setCccd(existing.getCccd());
            if (user.getStatus() == null) user.setStatus(existing.getStatus());

            boolean ok = userDao.updateUser(user);
            Map<String, Object> resp = new HashMap<>();
            if (ok) {
                resp.put("success", true);
                resp.put("message", "User updated successfully");
                resp.put("data", userDao.getUserById(userId));
                return ResponseEntity.ok(resp);
            } else {
                resp.put("success", false);
                resp.put("message", "Failed to update user");
                return ResponseEntity.status(500).body(resp);
            }
        } catch (Exception e) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", false);
            resp.put("message", "Error updating user: " + e.getMessage());
            return ResponseEntity.status(500).body(resp);
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            User existing = userDao.getUserById(userId);
            if (existing == null) {
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", false);
                resp.put("message", "User not found");
                return ResponseEntity.status(404).body(resp);
            }

            boolean deleted = userDao.deleteUser(userId);
            Map<String, Object> resp = new HashMap<>();
            if (deleted) {
                resp.put("success", true);
                resp.put("message", "User deleted successfully");
                return ResponseEntity.ok(resp);
            } else {
                resp.put("success", false);
                resp.put("message", "Failed to delete user");
                return ResponseEntity.status(500).body(resp);
            }
        } catch (Exception e) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", false);
            resp.put("message", "Error deleting user: " + e.getMessage());
            return ResponseEntity.status(500).body(resp);
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

        // ==================== STATION MANAGEMENT APIs ====================

        @GetMapping("/stations")
        public ResponseEntity<?> getAllStations(
                @RequestParam(required = false) String status) {
            try {
                List<Station> stations;
                if (status != null && !status.isEmpty()) {
                    stations = stationDao.getStationsByStatus(status);
                } else {
                    stations = stationDao.getAllStations();
                }

                // Thêm thông tin chi tiết cho mỗi station
                List<Map<String, Object>> stationsWithDetails = new ArrayList<>();
                for (Station station : stations) {
                    Map<String, Object> stationData = new HashMap<>();
                    stationData.put("stationId", station.getStationId());
                    stationData.put("name", station.getName());
                    stationData.put("location", station.getLocation());
                    stationData.put("status", station.getStatus());

                    // Lấy thống kê chi tiết
                    Map<String, Object> details = stationDao.getStationDetails(station.getStationId());
                    stationData.putAll(details);

                    stationsWithDetails.add(stationData);
                }

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", stationsWithDetails);
                response.put("total", stationsWithDetails.size());

                return ResponseEntity.ok(response);
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error fetching stations: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }

        @GetMapping("/stations/{stationId}")
        public ResponseEntity<?> getStationById(@PathVariable int stationId) {
            try {
                Station station = stationDao.getStationById(stationId);
                if (station == null) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Station not found");
                    return ResponseEntity.status(404).body(response);
                }

                Map<String, Object> stationData = new HashMap<>();
                stationData.put("stationId", station.getStationId());
                stationData.put("name", station.getName());
                stationData.put("location", station.getLocation());
                stationData.put("status", station.getStatus());

                // Lấy thông tin chi tiết
                Map<String, Object> details = stationDao.getStationDetails(stationId);
                stationData.putAll(details);

                // Lấy danh sách towers
                List<Map<String, Object>> towers = stationDao.getTowersByStation(stationId);
                stationData.put("towers", towers);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", stationData);

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
                // Validate required fields
                if (station.getName() == null || station.getName().trim().isEmpty()) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Station name is required");
                    return ResponseEntity.status(400).body(response);
                }

                if (station.getLocation() == null || station.getLocation().trim().isEmpty()) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Station location is required");
                    return ResponseEntity.status(400).body(response);
                }

                // Set default status if not provided
                if (station.getStatus() == null || station.getStatus().isEmpty()) {
                    station.setStatus("active");
                }

                // Tạo station với 1 tower và 8 slots tự động
                int stationId = stationDao.createStationWithTower(station, 8);

                if (stationId > 0) {
                    Station createdStation = stationDao.getStationById(stationId);
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Station created successfully with 1 tower and 8 slots");
                    response.put("data", createdStation);
                    return ResponseEntity.status(201).body(response);
                } else {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Failed to create station");
                    return ResponseEntity.status(500).body(response);
                }
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error creating station: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }

        @PutMapping("/stations/{stationId}")
        public ResponseEntity<?> updateStation(@PathVariable int stationId, @RequestBody Station station) {
            try {
                Station existing = stationDao.getStationById(stationId);
                if (existing == null) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Station not found");
                    return ResponseEntity.status(404).body(response);
                }

                // Merge fields
                station.setStationId(stationId);
                if (station.getName() == null) station.setName(existing.getName());
                if (station.getLocation() == null) station.setLocation(existing.getLocation());
                if (station.getStatus() == null) station.setStatus(existing.getStatus());

                boolean updated = stationDao.updateStation(station);

                Map<String, Object> response = new HashMap<>();
                if (updated) {
                    response.put("success", true);
                    response.put("message", "Station updated successfully");
                    response.put("data", stationDao.getStationById(stationId));
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Failed to update station");
                    return ResponseEntity.status(500).body(response);
                }
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error updating station: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }

        @DeleteMapping("/stations/{stationId}")
        public ResponseEntity<?> deleteStation(@PathVariable int stationId) {
            try {
                Station existing = stationDao.getStationById(stationId);
                if (existing == null) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Station not found");
                    return ResponseEntity.status(404).body(response);
                }

                boolean deleted = stationDao.deleteStation(stationId);

                Map<String, Object> response = new HashMap<>();
                if (deleted) {
                    response.put("success", true);
                    response.put("message", "Station marked as maintenance (soft delete)");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Failed to delete station");
                    return ResponseEntity.status(500).body(response);
                }
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error deleting station: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }

        // ==================== TOWER MANAGEMENT APIs ====================

        @GetMapping("/stations/{stationId}/towers")
        public ResponseEntity<?> getStationTowers(@PathVariable int stationId) {
            try {
                Station station = stationDao.getStationById(stationId);
                if (station == null) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Station not found");
                    return ResponseEntity.status(404).body(response);
                }

                List<Map<String, Object>> towers = stationDao.getTowersByStation(stationId);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", towers);
                response.put("total", towers.size());

                return ResponseEntity.ok(response);
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error fetching towers: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }

        @PostMapping("/stations/{stationId}/towers")
        public ResponseEntity<?> addTowerToStation(
                @PathVariable int stationId,
                @RequestParam(required = false, defaultValue = "8") int numberOfSlots) {
            try {
                Station station = stationDao.getStationById(stationId);
                if (station == null) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Station not found");
                    return ResponseEntity.status(404).body(response);
                }

                int towerId = stationDao.addTowerToStation(stationId, numberOfSlots);

                Map<String, Object> response = new HashMap<>();
                if (towerId > 0) {
                    response.put("success", true);
                    response.put("message", "Tower added successfully with " + numberOfSlots + " slots");
                    response.put("data", Map.of("towerId", towerId));
                    return ResponseEntity.status(201).body(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Failed to add tower");
                    return ResponseEntity.status(500).body(response);
                }
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error adding tower: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }

        @PutMapping("/towers/{towerId}")
        public ResponseEntity<?> updateTower(
                @PathVariable int towerId,
                @RequestBody Map<String, String> body) {
            try {
                String status = body.get("status");
                if (status == null || status.isEmpty()) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Status is required");
                    return ResponseEntity.status(400).body(response);
                }

                boolean updated = stationDao.updateTower(towerId, status);

                Map<String, Object> response = new HashMap<>();
                if (updated) {
                    response.put("success", true);
                    response.put("message", "Tower updated successfully");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Failed to update tower");
                    return ResponseEntity.status(500).body(response);
                }
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error updating tower: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }

        @DeleteMapping("/towers/{towerId}")
        public ResponseEntity<?> deleteTower(@PathVariable int towerId) {
            try {
                // Kiểm tra tower có tồn tại không
                Map<String, Object> tower = stationDao.getTowerById(towerId);
                if (tower == null) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Tower not found");
                    return ResponseEntity.status(404).body(response);
                }

                // Kiểm tra tower có batteries không
                int fullSlots = (int) tower.getOrDefault("fullSlots", 0);
                int chargingSlots = (int) tower.getOrDefault("chargingSlots", 0);
                
                if (fullSlots > 0 || chargingSlots > 0) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Cannot delete tower with batteries. Please remove all batteries first.");
                    response.put("fullSlots", fullSlots);
                    response.put("chargingSlots", chargingSlots);
                    return ResponseEntity.status(400).body(response);
                }

                boolean deleted = stationDao.deleteTower(towerId);

                Map<String, Object> response = new HashMap<>();
                if (deleted) {
                    response.put("success", true);
                    response.put("message", "Tower and its slots deleted successfully");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Failed to delete tower");
                    return ResponseEntity.status(500).body(response);
                }
            } catch (Exception e) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Error deleting tower: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }
    }