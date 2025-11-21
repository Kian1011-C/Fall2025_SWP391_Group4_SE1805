package hsf302.fa25.s3.model;

import java.math.BigDecimal;

public class DistanceRateTier {
    private int tierId;
    private int fromKm;
    private Integer toKm; // null for unlimited
    private BigDecimal ratePerKm;
    private String description;

    // Default constructor
    public DistanceRateTier() {}

    // Constructor with parameters
    public DistanceRateTier(int fromKm, Integer toKm, BigDecimal ratePerKm, String description) {
        this.fromKm = fromKm;
        this.toKm = toKm;
        this.ratePerKm = ratePerKm;
        this.description = description;
    }

    // Getters and Setters
    public int getTierId() {
        return tierId;
    }

    public void setTierId(int tierId) {
        this.tierId = tierId;
    }

    public int getFromKm() {
        return fromKm;
    }

    public void setFromKm(int fromKm) {
        this.fromKm = fromKm;
    }

    public Integer getToKm() {
        return toKm;
    }

    public void setToKm(Integer toKm) {
        this.toKm = toKm;
    }

    public BigDecimal getRatePerKm() {
        return ratePerKm;
    }

    public void setRatePerKm(BigDecimal ratePerKm) {
        this.ratePerKm = ratePerKm;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isUnlimited() {
        return toKm == null;
    }

    public boolean isInRange(int distance) {
        if (distance < fromKm) return false;
        return toKm == null || distance <= toKm;
    }
}