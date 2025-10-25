package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.dao.StationDao;
import hsf302.fa25.s3.dao.UserDao;
import hsf302.fa25.s3.dao.UserDashboardDao;
import hsf302.fa25.s3.dao.VehicleDao;
import hsf302.fa25.s3.model.Station;
import hsf302.fa25.s3.model.VehicleBatteryInfo;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Controller
public class PageController {

    private final UserDao userDao;
    private final UserDashboardDao dashboardDao;
    private final VehicleDao vehicleDao;

    public PageController() throws Exception {
        this.userDao = new UserDao();
        this.dashboardDao = new UserDashboardDao();
        this.vehicleDao = new VehicleDao();
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/home")
    public String home(@RequestParam("id") String userId, Model model) throws Exception {
        var user = userDao.getUserById(userId);
        var dashboard = dashboardDao.getDashboardByUserId(userId);
        model.addAttribute("user", user);
        model.addAttribute("dashboard", dashboard);

        switch (user.getRole().toUpperCase()) {
            case "EV DRIVER": return "driver_home";
            case "STAFF": return "staff_home";
            case "ADMIN": return "admin_dashboard";
            default: return "error";
        }
    }

    @GetMapping("/driver/home")
    public String driverHome() {
        return "driver_home";
    }

    @GetMapping("/driver/stations")
    public String stations(@RequestParam int vehicleId,
                           @RequestParam String userId,
                           Model model) throws Exception {
        var user = userDao.getUserById(userId);
        model.addAttribute("user", user);
        model.addAttribute("userId", userId);
        model.addAttribute("vehicleId", vehicleId);

        List<VehicleBatteryInfo> vehicles = vehicleDao.getVehiclesWithBatteryByUser(userId);
        if (vehicles == null) vehicles = new ArrayList<>();
        model.addAttribute("vehicles", vehicles);

        VehicleBatteryInfo selectedVehicle = vehicles.stream()
                .filter(v -> v.getVehicleId() == vehicleId)
                .findFirst()
                .orElse(vehicles.isEmpty() ? null : vehicles.get(0));
        model.addAttribute("selectedVehicle", selectedVehicle);

        List<Station> stations = new StationDao().getAllStations();
        model.addAttribute("stations", stations); // thêm list stations vào model

        return "stations";
    }


    @GetMapping("/driver/towers")
    public String towers() {
        return "towers";
    }

    @GetMapping("/driver/slots")
    public String slots() {
        return "slots";
    }

    @GetMapping("/driver/battery")
    public String battery(@RequestParam int slotId,
                          @RequestParam int towerId,
                          @RequestParam int stationId,
                          @RequestParam int userId,
                          Model model) {
        model.addAttribute("slotId", slotId);
        model.addAttribute("towerId", towerId);
        model.addAttribute("stationId", stationId);
        model.addAttribute("userId", userId);
        return "battery";
    }

    @GetMapping("/driver/swap")
    public String swap(@RequestParam int batteryId,
                       @RequestParam("model") String batteryModel,
                       @RequestParam int capacity,
                       @RequestParam int soh,
                       @RequestParam int slotId,
                       @RequestParam int towerId,
                       @RequestParam int stationId,
                       @RequestParam int userId,
                       Model model) {
        model.addAttribute("batteryId", batteryId);
        model.addAttribute("batteryModel", batteryModel);
        model.addAttribute("capacity", capacity);
        model.addAttribute("soh", soh);
        model.addAttribute("slotId", slotId);
        model.addAttribute("towerId", towerId);
        model.addAttribute("stationId", stationId);
        model.addAttribute("userId", userId);
        return "swap";
    }
}
