package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Swap;
import hsf302.fa25.s3.repository.SwapRepo;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public Swap getSwapById(Long swapId) {
        if (swapId == null) {
            throw new IllegalArgumentException("Swap ID cannot be null");
        }
        return swapRepo.getSwapById(swapId.intValue());
    }
}
