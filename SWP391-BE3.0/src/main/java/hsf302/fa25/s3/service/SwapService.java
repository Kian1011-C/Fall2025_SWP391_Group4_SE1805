package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Swap;
import java.util.List;

public interface SwapService {
    
    List<Swap> getSwapsByUserId(String userId);
    
    List<Swap> getAllSwaps();
    
    Swap getSwapById(Long swapId);
}
