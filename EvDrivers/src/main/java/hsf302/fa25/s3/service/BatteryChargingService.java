package hsf302.fa25.s3.service;

import hsf302.fa25.s3.context.ConnectDB;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class BatteryChargingService {

    // Run every 10 minutes (600,000 ms). Initial delay 10s to allow app start.
    @Scheduled(initialDelay = 10000L, fixedDelay = 60000L)
    public void runChargingCycle() {
        System.out.println("[BatteryChargingScheduler] Starting charging cycle...");

        String selectSql = "SELECT battery_id, state_of_health, slot_id, status, capacity, cycle_count FROM Batteries WHERE status = 'charging' or status = 'in_stock'";
        String updateBatterySql = "UPDATE Batteries SET state_of_health = ?, status = ?, cycle_count = ?, capacity = ? WHERE battery_id = ?";
        String updateSlotSql = "UPDATE Slots SET status = ? WHERE slot_id = ?";

        try (Connection conn = ConnectDB.getConnection()) {
            // We'll handle each battery in its own small transaction block
            try (PreparedStatement ps = conn.prepareStatement(selectSql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    int batteryId = rs.getInt("battery_id");
                    double soh = rs.getDouble("state_of_health");
                    Integer slotId = rs.getObject("slot_id") != null ? rs.getInt("slot_id") : null;
                    String currentStatus = rs.getString("status");
                    int currentCapacity = rs.getInt("capacity");
                    int currentCycleCount = rs.getInt("cycle_count");

                    double newSoh = Math.min(100.0, soh + 10.0);
                    String newBatteryStatus = currentStatus;
                    String newSlotStatus = null;
                    int newCycleCount = currentCycleCount;
                    int newCapacity = currentCapacity;

                    // Check if battery just reached full charge (100%)
                    boolean justReachedFull = (soh < 100.0 && newSoh >= 100.0);

                    if (newBatteryStatus .equals("in_stock")) {
                        // Battery is in stock, so we charge it but keep it in stock
                        newBatteryStatus = "in_stock";
                        if (justReachedFull) {
                            newCycleCount = currentCycleCount + 1;
                            // Reduce capacity by 0.00667% per cycle (reaches 80% after ~3000 cycles)
                            newCapacity = (int) Math.max(0, currentCapacity - (currentCapacity * 0.0000667));
                        }
                    }else {
                        if (newSoh >= 100.0) {
                            newBatteryStatus = "available";
                            newSlotStatus = "full";
                            // If battery just reached 100%, increment cycle and degrade capacity
                            if (justReachedFull) {
                                newCycleCount = currentCycleCount + 1;
                                // Reduce capacity by 0.00667% per cycle (reaches 80% after ~3000 cycles)
                                newCapacity = (int) Math.max(0, currentCapacity - (currentCapacity * 0.0000667));
                            }
                        } else {
                            // still charging
                            newBatteryStatus = "charging";
                            newSlotStatus = "charging";
                        }
                    }

                    // Update battery
                    try (PreparedStatement ups = conn.prepareStatement(updateBatterySql)) {
                        ups.setDouble(1, newSoh);
                        ups.setString(2, newBatteryStatus);
                        ups.setInt(3, newCycleCount);
                        ups.setInt(4, newCapacity);
                        ups.setInt(5, batteryId);
                        int updated = ups.executeUpdate();
                    }

                    // Update slot if present
                    if (slotId != null) {
                        try (PreparedStatement ups = conn.prepareStatement(updateSlotSql)) {
                            ups.setString(1, newSlotStatus);
                            ups.setInt(2, slotId);
                            int updated = ups.executeUpdate();
                        }
                    }
                }
            }

        } catch (SQLException e) {
            System.err.println("[BatteryChargingScheduler] SQL error during charging cycle: " + e.getMessage());
            e.printStackTrace();
        } catch (Throwable t) {
            System.err.println("[BatteryChargingScheduler] Unexpected error: " + t.getMessage());
            t.printStackTrace();
        }

        System.out.println("[BatteryChargingScheduler] Charging cycle completed.");
    }
}
