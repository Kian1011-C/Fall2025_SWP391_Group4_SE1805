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

    // ==================== DRIVER MANAGEMENT CRUD APIs ====================

    @GetMapping("/drivers")
    public ResponseEntity<?> getAllDrivers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {
        try {
            List<User> allUsers = userDao.getAllUsers();

            // Filter only drivers
            List<User> drivers = allUsers.stream()
                    .filter(user -> "EV Driver".equalsIgnoreCase(user.getRole()))
                    .collect(Collectors.toList());

            // Apply status filter
            if (status != null && !status.isEmpty()) {
                drivers = drivers.stream()
                        .filter(driver -> status.equalsIgnoreCase(driver.getStatus()))
                        .collect(Collectors.toList());
            }

            // Apply search filter
            if (search != null && !search.trim().isEmpty()) {
                String searchLower = search.toLowerCase().trim();
                drivers = drivers.stream()
                        .filter(driver ->
                                (driver.getFirstName() != null && driver.getFirstName().toLowerCase().contains(searchLower)) ||
                                        (driver.getLastName() != null && driver.getLastName().toLowerCase().contains(searchLower)) ||
                                        (driver.getEmail() != null && driver.getEmail().toLowerCase().contains(searchLower)) ||
                                        (driver.getPhone() != null && driver.getPhone().contains(search)) ||
                                        (driver.getCccd() != null && driver.getCccd().contains(search))
                        )
                        .collect(Collectors.toList());
            }

            // Apply pagination
            int start = page * size;
            int end = Math.min(start + size, drivers.size());
            List<User> paginatedDrivers = drivers.subList(start, end);

            // Get vehicle information for each driver
            List<Map<String, Object>> driversWithVehicles = new ArrayList<>();
            for (User driver : paginatedDrivers) {
                Map<String, Object> driverData = new HashMap<>();
                driverData.put("userId", driver.getUserId());
                driverData.put("firstName", driver.getFirstName());
                driverData.put("lastName", driver.getLastName());
                driverData.put("email", driver.getEmail());
                driverData.put("phone", driver.getPhone());
                driverData.put("cccd", driver.getCccd());
                driverData.put("status", driver.getStatus());
                driverData.put("createdAt", driver.getCreatedAt());
                driverData.put("updatedAt", driver.getUpdatedAt());

                // Get vehicles for this driver
                try {
                    List<VehicleBatteryInfo> vehicles = vehicleDao.getVehiclesWithBatteryByUser(driver.getUserId());
                    driverData.put("vehicles", vehicles);
                    driverData.put("vehicleCount", vehicles.size());
                } catch (Exception e) {
                    driverData.put("vehicles", new ArrayList<>());
                    driverData.put("vehicleCount", 0);
                }

                driversWithVehicles.add(driverData);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", driversWithVehicles);
            response.put("total", drivers.size());
            response.put("page", page);
            response.put("size", size);
            response.put("totalPages", (drivers.size() + size - 1) / size);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching drivers: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/drivers/{userId}")
    public ResponseEntity<?> getDriverById(@PathVariable String userId) {
        try {
            User driver = userDao.getUserById(userId);

            if (driver == null || !"EV Driver".equalsIgnoreCase(driver.getRole())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Driver not found");
                return ResponseEntity.status(404).body(response);
            }

            Map<String, Object> driverData = new HashMap<>();
            driverData.put("userId", driver.getUserId());
            driverData.put("firstName", driver.getFirstName());
            driverData.put("lastName", driver.getLastName());
            driverData.put("email", driver.getEmail());
            driverData.put("phone", driver.getPhone());
            driverData.put("cccd", driver.getCccd());
            driverData.put("status", driver.getStatus());
            driverData.put("createdAt", driver.getCreatedAt());
            driverData.put("updatedAt", driver.getUpdatedAt());

            // Get vehicles for this driver
            try {
                List<VehicleBatteryInfo> vehicles = vehicleDao.getVehiclesWithBatteryByUser(userId);
                driverData.put("vehicles", vehicles);
            } catch (Exception e) {
                driverData.put("vehicles", new ArrayList<>());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", driverData);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching driver: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/drivers")
    public ResponseEntity<?> createDriver(@RequestBody User driver) {
        try {
            // Validate required fields
            if (driver.getEmail() == null || driver.getEmail().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.status(400).body(response);
            }

            if (driver.getPassword() == null || driver.getPassword().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Password is required");
                return ResponseEntity.status(400).body(response);
            }

            // Check if email already exists
            List<User> existingUsers = userDao.getAllUsers();
            boolean emailExists = existingUsers.stream()
                    .anyMatch(user -> driver.getEmail().equalsIgnoreCase(user.getEmail()));

            if (emailExists) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email already exists");
                return ResponseEntity.status(400).body(response);
            }

            // Set driver role and defaults
            driver.setRole("EV Driver");
            if (driver.getStatus() == null || driver.getStatus().isEmpty()) {
                driver.setStatus("active");
            }

            // Generate user ID if not provided
            if (driver.getUserId() == null || driver.getUserId().isEmpty()) {
                driver.setUserId(driver.getEmail()); // Use email as user ID
            }

            boolean created = userDao.addUser(driver);

            Map<String, Object> response = new HashMap<>();
            if (created) {
                response.put("success", true);
                response.put("message", "Driver created successfully");
                response.put("data", driver);
            } else {
                response.put("success", false);
                response.put("message", "Failed to create driver");
                return ResponseEntity.status(500).body(response);
            }

            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error creating driver: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/drivers/{userId}")
    public ResponseEntity<?> updateDriver(@PathVariable String userId, @RequestBody User driver) {
        try {
            // Check if driver exists
            User existingDriver = userDao.getUserById(userId);
            if (existingDriver == null || !"EV Driver".equalsIgnoreCase(existingDriver.getRole())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Driver not found");
                return ResponseEntity.status(404).body(response);
            }

            // Set the user ID for update
            driver.setUserId(userId);
            driver.setRole("EV Driver"); // Ensure role remains EV Driver

            // Keep existing values if not provided
            if (driver.getFirstName() == null) driver.setFirstName(existingDriver.getFirstName());
            if (driver.getLastName() == null) driver.setLastName(existingDriver.getLastName());
            if (driver.getEmail() == null) driver.setEmail(existingDriver.getEmail());
            if (driver.getPhone() == null) driver.setPhone(existingDriver.getPhone());
            if (driver.getPassword() == null) driver.setPassword(existingDriver.getPassword());
            if (driver.getCccd() == null) driver.setCccd(existingDriver.getCccd());
            if (driver.getStatus() == null) driver.setStatus(existingDriver.getStatus());

            boolean updated = userDao.updateUser(driver);

            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("success", true);
                response.put("message", "Driver updated successfully");
                response.put("data", driver);
            } else {
                response.put("success", false);
                response.put("message", "Failed to update driver");
                return ResponseEntity.status(500).body(response);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error updating driver: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/drivers/{userId}")
    public ResponseEntity<?> deleteDriver(@PathVariable String userId) {
        try {
            // Check if driver exists
            User existingDriver = userDao.getUserById(userId);
            if (existingDriver == null || !"EV Driver".equalsIgnoreCase(existingDriver.getRole())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Driver not found");
                return ResponseEntity.status(404).body(response);
            }

            // Check if driver has active vehicles/contracts
            try {
                List<VehicleBatteryInfo> vehicles = vehicleDao.getVehiclesWithBatteryByUser(userId);
                if (!vehicles.isEmpty()) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Cannot delete driver with registered vehicles. Remove vehicles first.");
                    return ResponseEntity.status(400).body(response);
                }
            } catch (Exception e) {
                // Continue with deletion even if vehicle check fails
            }

            boolean deleted = userDao.deleteUser(userId);

            Map<String, Object> response = new HashMap<>();
            if (deleted) {
                response.put("success", true);
                response.put("message", "Driver deleted successfully");
            } else {
                response.put("success", false);
                response.put("message", "Failed to delete driver");
                return ResponseEntity.status(500).body(response);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error deleting driver: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ==================== STAFF MANAGEMENT CRUD APIs ====================

    @GetMapping("/staff")
    public ResponseEntity<?> getAllStaff(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {
        try {
            List<User> allUsers = userDao.getAllUsers();

            // Filter only staff
            List<User> staff = allUsers.stream()
                    .filter(user -> "Staff".equalsIgnoreCase(user.getRole()))
                    .collect(Collectors.toList());

            // Apply status filter
            if (status != null && !status.isEmpty()) {
                staff = staff.stream()
                        .filter(s -> status.equalsIgnoreCase(s.getStatus()))
                        .collect(Collectors.toList());
            }

            // Apply search filter
            if (search != null && !search.trim().isEmpty()) {
                String searchLower = search.toLowerCase().trim();
                staff = staff.stream()
                        .filter(s ->
                                (s.getFirstName() != null && s.getFirstName().toLowerCase().contains(searchLower)) ||
                                        (s.getLastName() != null && s.getLastName().toLowerCase().contains(searchLower)) ||
                                        (s.getEmail() != null && s.getEmail().toLowerCase().contains(searchLower)) ||
                                        (s.getPhone() != null && s.getPhone().contains(search)) ||
                                        (s.getCccd() != null && s.getCccd().contains(search))
                        )
                        .collect(Collectors.toList());
            }

            // Apply pagination
            int start = page * size;
            int end = Math.min(start + size, staff.size());
            List<User> paginatedStaff = staff.subList(start, end);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", paginatedStaff);
            response.put("total", staff.size());
            response.put("page", page);
            response.put("size", size);
            response.put("totalPages", (staff.size() + size - 1) / size);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching staff: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/staff/{userId}")
    public ResponseEntity<?> getStaffById(@PathVariable String userId) {
        try {
            User staff = userDao.getUserById(userId);

            if (staff == null || !"Staff".equalsIgnoreCase(staff.getRole())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Staff member not found");
                return ResponseEntity.status(404).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", staff);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching staff member: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/staff")
    public ResponseEntity<?> createStaff(@RequestBody User staff) {
        try {
            // Validate required fields
            if (staff.getEmail() == null || staff.getEmail().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.status(400).body(response);
            }

            if (staff.getPassword() == null || staff.getPassword().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Password is required");
                return ResponseEntity.status(400).body(response);
            }

            // Check if email already exists
            List<User> existingUsers = userDao.getAllUsers();
            boolean emailExists = existingUsers.stream()
                    .anyMatch(user -> staff.getEmail().equalsIgnoreCase(user.getEmail()));

            if (emailExists) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email already exists");
                return ResponseEntity.status(400).body(response);
            }

            // Set staff role and defaults
            staff.setRole("Staff");
            if (staff.getStatus() == null || staff.getStatus().isEmpty()) {
                staff.setStatus("active");
            }

            // Generate user ID if not provided
            if (staff.getUserId() == null || staff.getUserId().isEmpty()) {
                staff.setUserId(staff.getEmail()); // Use email as user ID
            }

            boolean created = userDao.addUser(staff);

            Map<String, Object> response = new HashMap<>();
            if (created) {
                response.put("success", true);
                response.put("message", "Staff member created successfully");
                response.put("data", staff);
            } else {
                response.put("success", false);
                response.put("message", "Failed to create staff member");
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

    @PutMapping("/staff/{userId}")
    public ResponseEntity<?> updateStaff(@PathVariable String userId, @RequestBody User staff) {
        try {
            // Check if staff exists
            User existingStaff = userDao.getUserById(userId);
            if (existingStaff == null || !"Staff".equalsIgnoreCase(existingStaff.getRole())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Staff member not found");
                return ResponseEntity.status(404).body(response);
            }

            // Set the user ID for update
            staff.setUserId(userId);
            staff.setRole("Staff"); // Ensure role remains Staff

            // Keep existing values if not provided
            if (staff.getFirstName() == null) staff.setFirstName(existingStaff.getFirstName());
            if (staff.getLastName() == null) staff.setLastName(existingStaff.getLastName());
            if (staff.getEmail() == null) staff.setEmail(existingStaff.getEmail());
            if (staff.getPhone() == null) staff.setPhone(existingStaff.getPhone());
            if (staff.getPassword() == null) staff.setPassword(existingStaff.getPassword());
            if (staff.getCccd() == null) staff.setCccd(existingStaff.getCccd());
            if (staff.getStatus() == null) staff.setStatus(existingStaff.getStatus());

            boolean updated = userDao.updateUser(staff);

            Map<String, Object> response = new HashMap<>();
            if (updated) {
                response.put("success", true);
                response.put("message", "Staff member updated successfully");
                response.put("data", staff);
            } else {
                response.put("success", false);
                response.put("message", "Failed to update staff member");
                return ResponseEntity.status(500).body(response);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error updating staff member: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/staff/{userId}")
    public ResponseEntity<?> deleteStaff(@PathVariable String userId) {
        try {
            // Check if staff exists
            User existingStaff = userDao.getUserById(userId);
            if (existingStaff == null || !"Staff".equalsIgnoreCase(existingStaff.getRole())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Staff member not found");
                return ResponseEntity.status(404).body(response);
            }

            boolean deleted = userDao.deleteUser(userId);

            Map<String, Object> response = new HashMap<>();
            if (deleted) {
                response.put("success", true);
                response.put("message", "Staff member deleted successfully");
            } else {
                response.put("success", false);
                response.put("message", "Failed to delete staff member");
                return ResponseEntity.status(500).body(response);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error deleting staff member: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ==================== VEHICLE MANAGEMENT APIs ====================

    @GetMapping("/drivers/{userId}/vehicles")
    public ResponseEntity<?> getDriverVehicles(@PathVariable String userId) {
        try {
            // Check if driver exists
            User driver = userDao.getUserById(userId);
            if (driver == null || !"EV Driver".equalsIgnoreCase(driver.getRole())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Driver not found");
                return ResponseEntity.status(404).body(response);
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