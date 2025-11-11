package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.ServicePlan;
import hsf302.fa25.s3.model.DistanceRateTier;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

public class ServicePlanDao {

    public List<ServicePlan> getAllActivePlans() {
        List<ServicePlan> plans = new ArrayList<>();
        String sql = "SELECT * FROM ServicePlans WHERE is_active = 1 ORDER BY base_price";
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                ServicePlan plan = createServicePlanFromResultSet(rs);
                plans.add(plan);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return plans;
    }

    public ServicePlan getPlanById(int planId) {
        String sql = "SELECT * FROM ServicePlans WHERE plan_id = ?";
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, planId);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                return createServicePlanFromResultSet(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public ServicePlan getPlanByName(String planName) {
        String sql = "SELECT * FROM ServicePlans WHERE plan_name = ? AND is_active = 1";
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, planName);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                return createServicePlanFromResultSet(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<DistanceRateTier> getDistanceRateTiers() {
        List<DistanceRateTier> tiers = new ArrayList<>();
        String sql = "SELECT * FROM DistanceRateTiers ORDER BY from_km";
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                DistanceRateTier tier = new DistanceRateTier();
                tier.setTierId(rs.getInt("tier_id"));
                tier.setFromKm(rs.getInt("from_km"));
                
                int toKmValue = rs.getInt("to_km");
                tier.setToKm(rs.wasNull() ? null : toKmValue);
                
                tier.setRatePerKm(rs.getBigDecimal("rate_per_km"));
                tier.setDescription(rs.getString("description"));
                
                tiers.add(tier);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return tiers;
    }

    public BigDecimal calculateOverageCharge(int usedDistance, int baseDistance) {
        if (usedDistance <= baseDistance) {
            return BigDecimal.ZERO; // No overage
        }

        List<DistanceRateTier> tiers = getDistanceRateTiers();
        BigDecimal totalCharge = BigDecimal.ZERO;
        int remainingDistance = usedDistance - baseDistance;

        for (DistanceRateTier tier : tiers) {
            if (remainingDistance <= 0) break;

            int tierFromKm = tier.getFromKm() - baseDistance; // Adjust for base distance
            if (tierFromKm < 0) tierFromKm = 0;

            if (remainingDistance > tierFromKm) {
                int tierToKm = tier.getToKm() != null ? tier.getToKm() - baseDistance : Integer.MAX_VALUE;
                if (tierToKm < 0) continue;

                int chargeableDistance = Math.min(remainingDistance - tierFromKm, tierToKm - tierFromKm);
                BigDecimal tierCharge = tier.getRatePerKm().multiply(new BigDecimal(chargeableDistance));
                totalCharge = totalCharge.add(tierCharge);
                
                remainingDistance -= chargeableDistance;
            }
        }

        return totalCharge;
    }

    private ServicePlan createServicePlanFromResultSet(ResultSet rs) throws Exception {
        ServicePlan plan = new ServicePlan();
        plan.setPlanId(rs.getInt("plan_id"));
        plan.setPlanName(rs.getString("plan_name"));
        plan.setBasePrice(rs.getBigDecimal("base_price"));
        plan.setBaseDistance(rs.getInt("base_distance"));
        plan.setDepositFee(rs.getBigDecimal("deposit_fee"));
        plan.setDescription(rs.getString("description"));
        plan.setActive(rs.getBoolean("is_active"));
        plan.setCreatedAt(rs.getTimestamp("created_at"));
        return plan;
    }
}