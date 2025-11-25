package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.model.Station;
import hsf302.fa25.s3.model.VehicleBatteryInfo;
import java.util.List;
import java.util.Map;

public interface AdminService {
    
    // User management
    List<User> getAllUsers();
    User getUserById(String userId);
    User createUser(User user);
    User updateUser(String userId, User user);
    boolean deleteUser(String userId);
    Map<String, Integer> getUserStatistics();
    
    // Station management (delegated to StationService)
    List<Station> getAllStations();
    Station getStationById(Long stationId);
    Station createStation(Station station);
    Station updateStation(Long stationId, Station station);
    boolean deleteStation(Long stationId);
    
    // Vehicle management
    List<VehicleBatteryInfo> getAllVehicles();
    VehicleBatteryInfo getVehicleById(int vehicleId);
    List<VehicleBatteryInfo> getVehiclesByUserId(String userId);
    VehicleBatteryInfo createVehicle(VehicleBatteryInfo vehicle);
    VehicleBatteryInfo updateVehicle(int vehicleId, VehicleBatteryInfo vehicle);
    boolean deleteVehicle(int vehicleId);
}
