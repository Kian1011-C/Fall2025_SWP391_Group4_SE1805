package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.model.Station;
import hsf302.fa25.s3.model.VehicleBatteryInfo;
import hsf302.fa25.s3.repository.UserRepo;
import hsf302.fa25.s3.repository.StationRepo;
import hsf302.fa25.s3.repository.VehicleRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class AdminServiceImpl implements AdminService {
    
    private final UserRepo userRepo;
    private final StationRepo stationRepo;
    private final VehicleRepo vehicleRepo;
    
    public AdminServiceImpl() {
        this.userRepo = new UserRepo();
        this.stationRepo = new StationRepo();
        try {
            this.vehicleRepo = new VehicleRepo();
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize VehicleRepo", e);
        }
    }
    
    // ==================== USER MANAGEMENT ====================
    
    @Override
    public List<User> getAllUsers() {
        return userRepo.getAllUsers();
    }
    
    @Override
    public User getUserById(String userId) {
        return userRepo.getUserById(userId);
    }
    
    @Override
    public User createUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        // Check if email already exists
        List<User> existingUsers = userRepo.getAllUsers();
        boolean emailExists = existingUsers.stream()
                .anyMatch(u -> user.getEmail().equalsIgnoreCase(u.getEmail()));
        if (emailExists) {
            throw new IllegalStateException("Email already exists");
        }
        
        boolean created = userRepo.addUser(user);
        if (!created) {
            throw new RuntimeException("Failed to create user");
        }
        
        return user;
    }
    
    @Override
    public User updateUser(String userId, User user) {
        User existing = userRepo.getUserById(userId);
        if (existing == null) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
        
        // Validate and set fields
        if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) {
            existing.setFirstName(user.getFirstName());
        }
        if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) {
            existing.setLastName(user.getLastName());
        }
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            existing.setEmail(user.getEmail());
        }
        if (user.getPhone() != null) {
            existing.setPhone(user.getPhone());
        }
        if (user.getRole() != null && !user.getRole().trim().isEmpty()) {
            existing.setRole(user.getRole());
        }
        if (user.getStatus() != null && !user.getStatus().trim().isEmpty()) {
            existing.setStatus(user.getStatus());
        }
        if (user.getCccd() != null) {
            existing.setCccd(user.getCccd());
        }
        
        boolean updated = userRepo.updateUser(existing);
        if (!updated) {
            throw new RuntimeException("Failed to update user");
        }
        
        return existing;
    }
    
    @Override
    public boolean deleteUser(String userId) {
        User existing = userRepo.getUserById(userId);
        if (existing == null) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
        
        return userRepo.deleteUser(userId);
    }
    
    @Override
    public Map<String, Integer> getUserStatistics() {
        List<User> allUsers = userRepo.getAllUsers();
        
        Map<String, Integer> stats = new HashMap<>();
        stats.put("total", allUsers.size());
        stats.put("drivers", (int) allUsers.stream().filter(u -> "EV Driver".equalsIgnoreCase(u.getRole())).count());
        stats.put("staff", (int) allUsers.stream().filter(u -> "Staff".equalsIgnoreCase(u.getRole())).count());
        stats.put("admins", (int) allUsers.stream().filter(u -> "Admin".equalsIgnoreCase(u.getRole())).count());
        stats.put("active", (int) allUsers.stream().filter(u -> "active".equalsIgnoreCase(u.getStatus())).count());
        stats.put("inactive", (int) allUsers.stream().filter(u -> "inactive".equalsIgnoreCase(u.getStatus())).count());
        
        return stats;
    }
    
    // ==================== STATION MANAGEMENT ====================
    
    @Override
    public List<Station> getAllStations() {
        return stationRepo.getAllStations();
    }
    
    @Override
    public Station getStationById(Long stationId) {
        return stationRepo.getStationById(stationId.intValue());
    }
    
    @Override
    public Station createStation(Station station) {
        if (station == null) {
            throw new IllegalArgumentException("Station cannot be null");
        }
        if (station.getName() == null || station.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Station name is required");
        }
        
        int stationId = stationRepo.createStation(station);
        if (stationId <= 0) {
            throw new RuntimeException("Failed to create station");
        }
        station.setStationId(stationId);
        
        return station;
    }
    
    @Override
    public Station updateStation(Long stationId, Station station) {
        Station existing = stationRepo.getStationById(stationId.intValue());
        if (existing == null) {
            throw new IllegalArgumentException("Station not found with ID: " + stationId);
        }
        
        if (station.getName() != null && !station.getName().trim().isEmpty()) {
            existing.setName(station.getName());
        }
        if (station.getLocation() != null) {
            existing.setLocation(station.getLocation());
        }
        if (station.getLatitude() != null) {
            existing.setLatitude(station.getLatitude());
        }
        if (station.getLongitude() != null) {
            existing.setLongitude(station.getLongitude());
        }
        if (station.getStatus() != null) {
            existing.setStatus(station.getStatus());
        }
        
        boolean updated = stationRepo.updateStation(existing);
        if (!updated) {
            throw new RuntimeException("Failed to update station");
        }
        
        return existing;
    }
    
    @Override
    public boolean deleteStation(Long stationId) {
        Station existing = stationRepo.getStationById(stationId.intValue());
        if (existing == null) {
            throw new IllegalArgumentException("Station not found with ID: " + stationId);
        }
        
        return stationRepo.deleteStation(stationId.intValue());
    }
    
    // ==================== VEHICLE MANAGEMENT ====================
    
    @Override
    public List<VehicleBatteryInfo> getAllVehicles() {
        return vehicleRepo.getAllVehicles();
    }
    
    @Override
    public VehicleBatteryInfo getVehicleById(int vehicleId) {
        return vehicleRepo.getVehicleById(vehicleId);
    }
    
    @Override
    public List<VehicleBatteryInfo> getVehiclesByUserId(String userId) {
        return vehicleRepo.getVehiclesWithBatteryByUser(userId);
    }
    
    @Override
    public VehicleBatteryInfo createVehicle(VehicleBatteryInfo vehicle) {
        if (vehicle == null) {
            throw new IllegalArgumentException("Vehicle cannot be null");
        }
        if (vehicle.getPlateNumber() == null || vehicle.getPlateNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("License plate is required");
        }
        
        boolean created = vehicleRepo.createVehicle(vehicle);
        if (!created) {
            throw new RuntimeException("Failed to create vehicle");
        }
        
        return vehicle;
    }
    
    @Override
    public VehicleBatteryInfo updateVehicle(int vehicleId, VehicleBatteryInfo vehicle) {
        VehicleBatteryInfo existing = vehicleRepo.getVehicleById(vehicleId);
        if (existing == null) {
            throw new IllegalArgumentException("Vehicle not found with ID: " + vehicleId);
        }
        
        if (vehicle.getPlateNumber() != null && !vehicle.getPlateNumber().trim().isEmpty()) {
            existing.setPlateNumber(vehicle.getPlateNumber());
        }
        if (vehicle.getVehicleModel() != null) {
            existing.setVehicleModel(vehicle.getVehicleModel());
        }
        
        boolean updated = vehicleRepo.updateVehicle(existing);
        if (!updated) {
            throw new RuntimeException("Failed to update vehicle");
        }
        
        return existing;
    }
    
    @Override
    public boolean deleteVehicle(int vehicleId) {
        VehicleBatteryInfo existing = vehicleRepo.getVehicleById(vehicleId);
        if (existing == null) {
            throw new IllegalArgumentException("Vehicle not found with ID: " + vehicleId);
        }
        
        return vehicleRepo.deleteVehicle(vehicleId);
    }
}
