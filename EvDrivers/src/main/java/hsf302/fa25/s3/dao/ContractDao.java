package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.Contract;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class ContractDao {

    public List<Contract> getContractsByVehicleId(int vehicleId) {
        List<Contract> list = new ArrayList<>();
        String sql = "SELECT * FROM Contracts WHERE vehicle_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, vehicleId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Contract c = createContractFromResultSet(rs);
                list.add(c);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public Contract getContractById(int contractId) {
        String sql = "SELECT * FROM Contracts WHERE contract_id = ?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, contractId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return createContractFromResultSet(rs);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Contract> getContractsByUserId(String userId) {
        String sql = """
            SELECT c.* FROM Contracts c
            INNER JOIN Vehicles v ON c.vehicle_id = v.vehicle_id
            WHERE v.user_id = ? AND c.status = 'active'
        """;
        
        List<Contract> list = new ArrayList<>();
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Contract c = createContractFromResultSet(rs);
                list.add(c);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean updateMonthlyUsage(int contractId, java.math.BigDecimal additionalDistance) {
        String updateSql = """
            UPDATE Contracts 
            SET monthly_distance = monthly_distance + ?,
                updated_at = GETDATE()
            WHERE contract_id = ?
        """;
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(updateSql)) {
            
            ps.setBigDecimal(1, additionalDistance);
            ps.setInt(2, contractId);
            
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean calculateAndUpdateMonthlyFees(int contractId) {
        String sql = """
            SELECT c.*, sp.base_distance, sp.base_price 
            FROM Contracts c 
            INNER JOIN ServicePlans sp ON c.plan_id = sp.plan_id 
            WHERE c.contract_id = ?
        """;
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, contractId);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                java.math.BigDecimal monthlyDistance = rs.getBigDecimal("monthly_distance");
                int baseDistance = rs.getInt("base_distance");
                java.math.BigDecimal basePrice = rs.getBigDecimal("base_price");
                
                java.math.BigDecimal baseFee = basePrice;
                java.math.BigDecimal overageDistance = java.math.BigDecimal.ZERO;
                java.math.BigDecimal overageFee = java.math.BigDecimal.ZERO;
                
                // Calculate overage if not unlimited plan
                if (baseDistance > 0 && monthlyDistance.compareTo(new java.math.BigDecimal(baseDistance)) > 0) {
                    overageDistance = monthlyDistance.subtract(new java.math.BigDecimal(baseDistance));
                    // Use ServicePlanDao to calculate overage fee
                    hsf302.fa25.s3.dao.ServicePlanDao servicePlanDao = new hsf302.fa25.s3.dao.ServicePlanDao();
                    overageFee = servicePlanDao.calculateOverageCharge(monthlyDistance.intValue(), baseDistance);
                }
                
                java.math.BigDecimal totalFee = baseFee.add(overageFee);
                
                // Update contract with calculated fees
                String updateSql = """
                    UPDATE Contracts 
                    SET monthly_base_fee = ?, 
                        monthly_overage_distance = ?,
                        monthly_overage_fee = ?,
                        monthly_total_fee = ?
                    WHERE contract_id = ?
                """;
                
                try (PreparedStatement updatePs = conn.prepareStatement(updateSql)) {
                    updatePs.setBigDecimal(1, baseFee);
                    updatePs.setBigDecimal(2, overageDistance);
                    updatePs.setBigDecimal(3, overageFee);
                    updatePs.setBigDecimal(4, totalFee);
                    updatePs.setInt(5, contractId);
                    
                    return updatePs.executeUpdate() > 0;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean processMonthlyBilling(int contractId) {
        // Lấy thông tin contract hiện tại trước khi reset
        Contract contract = getContractById(contractId);
        if (contract == null) return false;

        try (Connection conn = ConnectDB.getConnection()) {
            // 1. Tạo payment record cho tháng vừa kết thúc
            String insertPaymentSql = """
                INSERT INTO Payments (user_id, contract_id, amount, method, status, currency, transaction_ref)
                SELECT v.user_id, ?, ?, 'Subscription', 'success', 'VND', 
                       CONCAT('MONTHLY-', ?, '-', FORMAT(GETDATE(), 'yyyyMMdd'))
                FROM Contracts c 
                INNER JOIN Vehicles v ON c.vehicle_id = v.vehicle_id
                WHERE c.contract_id = ?
            """;
            
            try (PreparedStatement paymentPs = conn.prepareStatement(insertPaymentSql)) {
                paymentPs.setInt(1, contractId);
                paymentPs.setBigDecimal(2, contract.getMonthlyTotalFee());
                paymentPs.setString(3, contract.getCurrentMonth());
                paymentPs.setInt(4, contractId);
                paymentPs.executeUpdate();
            }

            // 2. Reset usage cho tháng mới
            String resetSql = """
                UPDATE Contracts 
                SET current_month = FORMAT(GETDATE(), 'yyyy-MM'),
                    monthly_distance = 0,
                    monthly_base_fee = 0,
                    monthly_overage_distance = 0,
                    monthly_overage_fee = 0,
                    monthly_total_fee = 0,
                    last_reset_date = GETDATE()
                WHERE contract_id = ?
            """;
            
            try (PreparedStatement resetPs = conn.prepareStatement(resetSql)) {
                resetPs.setInt(1, contractId);
                return resetPs.executeUpdate() > 0;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public java.util.List<java.util.Map<String, Object>> getMonthlyBillingReport(String monthYear) {
        String sql = """
            SELECT c.contract_id, c.contract_number, v.plate_number, u.first_name, u.last_name,
                   sp.plan_name, sp.base_distance, sp.base_price,
                   c.monthly_distance, c.monthly_base_fee, c.monthly_overage_distance, 
                   c.monthly_overage_fee, c.monthly_total_fee, c.current_month
            FROM Contracts c
            INNER JOIN Vehicles v ON c.vehicle_id = v.vehicle_id
            INNER JOIN Users u ON v.user_id = u.user_id
            INNER JOIN ServicePlans sp ON c.plan_id = sp.plan_id
            WHERE c.current_month = ? AND c.status = 'active'
            ORDER BY c.contract_id
        """;
        
        java.util.List<java.util.Map<String, Object>> reports = new java.util.ArrayList<>();
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, monthYear);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                java.util.Map<String, Object> report = new java.util.HashMap<>();
                report.put("contractId", rs.getInt("contract_id"));
                report.put("contractNumber", rs.getString("contract_number"));
                report.put("plateNumber", rs.getString("plate_number"));
                report.put("customerName", rs.getString("first_name") + " " + rs.getString("last_name"));
                report.put("planName", rs.getString("plan_name"));
                report.put("baseDistance", rs.getInt("base_distance"));
                report.put("basePrice", rs.getBigDecimal("base_price"));
                report.put("monthlyDistance", rs.getBigDecimal("monthly_distance"));
                report.put("monthlyBaseFee", rs.getBigDecimal("monthly_base_fee"));
                report.put("monthlyOverageDistance", rs.getBigDecimal("monthly_overage_distance"));
                report.put("monthlyOverageFee", rs.getBigDecimal("monthly_overage_fee"));
                report.put("monthlyTotalFee", rs.getBigDecimal("monthly_total_fee"));
                report.put("currentMonth", rs.getString("current_month"));
                
                reports.add(report);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return reports;
    }

    public boolean checkAndResetIfNewMonth() {
        // Kiểm tra contracts nào chưa reset sang tháng mới
        String checkSql = """
            SELECT contract_id FROM Contracts 
            WHERE current_month != FORMAT(GETDATE(), 'yyyy-MM') 
            AND status = 'active'
        """;
        
        java.util.List<Integer> contractsToReset = new java.util.ArrayList<>();
        
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(checkSql)) {
            
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                contractsToReset.add(rs.getInt("contract_id"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        
        // Reset từng contract
        boolean allSuccess = true;
        for (Integer contractId : contractsToReset) {
            if (!processMonthlyBilling(contractId)) {
                allSuccess = false;
            }
        }
        
        return allSuccess;
    }

    private Contract createContractFromResultSet(ResultSet rs) throws Exception {
        Contract c = new Contract();
        c.setContractId(rs.getInt("contract_id"));
        c.setVehicleId(rs.getInt("vehicle_id"));
        c.setPlanId(rs.getInt("plan_id"));
        c.setStartDate(rs.getTimestamp("start_date"));
        c.setEndDate(rs.getTimestamp("end_date"));
        c.setStatus(rs.getString("status"));
        c.setContractNumber(rs.getString("contract_number"));
        c.setSignedDate(rs.getTimestamp("signed_date"));
        c.setSignedPlace(rs.getString("signed_place"));
        c.setCreatedAt(rs.getTimestamp("created_at"));
        
        // Usage fields
        c.setCurrentMonth(rs.getString("current_month"));
        c.setMonthlyDistance(rs.getBigDecimal("monthly_distance"));
        c.setMonthlyBaseFee(rs.getBigDecimal("monthly_base_fee"));
        c.setMonthlyOverageDistance(rs.getBigDecimal("monthly_overage_distance"));
        c.setMonthlyOverageFee(rs.getBigDecimal("monthly_overage_fee"));
        c.setMonthlyTotalFee(rs.getBigDecimal("monthly_total_fee"));
        c.setLastResetDate(rs.getTimestamp("last_reset_date"));
        
        return c;
    }
}
