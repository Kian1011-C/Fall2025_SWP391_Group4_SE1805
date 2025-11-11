package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.ServicePlan;
import hsf302.fa25.s3.model.DistanceRateTier;

import java.sql.*;
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

    /**
     * Thêm mới. Trả về id sinh ra (>=1) hoặc -1 nếu lỗi.
     */
    public int create(ServicePlan plan) {
        String sql = "INSERT INTO ServicePlans "
                + "(plan_name, base_price, base_distance, deposit_fee, description, is_active, created_at) "
                + "VALUES (?,?,?,?,?,?, GETDATE())";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, plan.getPlanName());
            ps.setBigDecimal(2, plan.getBasePrice());
            ps.setInt(3, plan.getBaseDistance());
            ps.setBigDecimal(4, plan.getDepositFee());

            if (plan.getDescription() == null) {
                ps.setNull(5, Types.NVARCHAR);
            } else {
                ps.setString(5, plan.getDescription());
            }

            ps.setBoolean(6, plan.isActive());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) return rs.getInt(1);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return -1;
    }

    /**
     * Cập nhật theo plan_id. Trả về true nếu thành công.
     */
    public boolean update(ServicePlan plan) {
        String sql = "UPDATE ServicePlans SET "
                + "plan_name=?, base_price=?, base_distance=?, deposit_fee=?, description=?, is_active=? "
                + "WHERE plan_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, plan.getPlanName());
            ps.setBigDecimal(2, plan.getBasePrice());
            ps.setInt(3, plan.getBaseDistance());
            ps.setBigDecimal(4, plan.getDepositFee());

            if (plan.getDescription() == null) {
                ps.setNull(5, Types.NVARCHAR);
            } else {
                ps.setString(5, plan.getDescription());
            }

            ps.setBoolean(6, plan.isActive());
            ps.setInt(7, plan.getPlanId());

            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Xoá mềm (deactivate): set is_active = 0 theo plan_id.
     */
    public boolean deactivate(int planId) {
        String sql = "UPDATE ServicePlans SET is_active = 0 WHERE plan_id = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, planId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // tranh trung ten
    public boolean existsByName(String planName) {
        String sql = "SELECT 1 FROM ServicePlans WHERE plan_name = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, planName);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}