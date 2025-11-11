package hsf302.fa25.s3.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class ServicePlan {
    private int planId;
    private String planName;
    private BigDecimal basePrice;
    private int baseDistance; // -1 for unlimited
    private BigDecimal depositFee;
    private String description;
    private boolean isActive;
    private Timestamp createdAt;

    // Default constructor
    public ServicePlan() {}

    // Constructor with parameters
    public ServicePlan(String planName, BigDecimal basePrice, int baseDistance,
                      BigDecimal depositFee, String description) {
        this.planName = planName;
        this.basePrice = basePrice;
        this.baseDistance = baseDistance;
        this.depositFee = depositFee;
        this.description = description;
        this.isActive = true;
    }

    // Getters and Setters
    public int getPlanId() {
        return planId;
    }

    public void setPlanId(int planId) {
        this.planId = planId;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public int getBaseDistance() {
        return baseDistance;
    }

    public void setBaseDistance(int baseDistance) {
        this.baseDistance = baseDistance;
    }

    public BigDecimal getDepositFee() {
        return depositFee;
    }

    public void setDepositFee(BigDecimal depositFee) {
        this.depositFee = depositFee;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isUnlimited() {
        return baseDistance == -1;
    }
}