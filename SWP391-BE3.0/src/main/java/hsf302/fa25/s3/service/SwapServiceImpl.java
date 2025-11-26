package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Swap;
import hsf302.fa25.s3.repository.SwapRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SwapServiceImpl implements SwapService {
    
    private final SwapRepo swapRepo;
    
    public SwapServiceImpl() {
        this.swapRepo = new SwapRepo();
    }
    
    @Override
    public List<Swap> getSwapsByUserId(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
        return swapRepo.getSwapsByUserId(userId);
    }
    
    @Override
    public List<Swap> getAllSwaps() {
        return swapRepo.getAllSwaps();
    }
    
    @Override
    public Swap getSwapById(int swapId) {
        return swapRepo.getSwapById(swapId);
    }
    
    @Override
    public Integer createSwap(Swap swap) {
        if (swap == null) {
            throw new IllegalArgumentException("Swap cannot be null");
        }
        if (swap.getUserId() == null || swap.getUserId().trim().isEmpty()) {
            throw new IllegalArgumentException("User ID is required for swap");
        }
        if (swap.getVehicleId() == null) {
            throw new IllegalArgumentException("Vehicle ID is required for swap");
        }
        
        Integer swapId = swapRepo.createSwap(swap);
        if (swapId == null || swapId <= 0) {
            throw new RuntimeException("Failed to create swap transaction");
        }
        
        return swapId;
    }
    
    @Override
    public boolean completeSwap(int swapId) {
        if (swapId <= 0) {
            throw new IllegalArgumentException("Invalid swap ID");
        }
        
        boolean completed = swapRepo.completeSwap(swapId);
        if (!completed) {
            throw new RuntimeException("Failed to complete swap transaction");
        }
        
        return true;
    }
    
    @Override
    public List<Map<String, Object>> getBatterySwapHistory(int batteryId) {
        if (batteryId <= 0) {
            throw new IllegalArgumentException("Invalid battery ID");
        }
        return swapRepo.getBatterySwapHistory(batteryId);
    }
}
