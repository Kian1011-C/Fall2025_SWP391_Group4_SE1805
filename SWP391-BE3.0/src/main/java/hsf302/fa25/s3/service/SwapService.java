package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.Swap;
import java.util.List;
import java.util.Map;

public interface SwapService {
    
    List<Swap> getSwapsByUserId(String userId);
    
    List<Swap> getAllSwaps();
    
    Swap getSwapById(int swapId);
    
    Integer createSwap(Swap swap);
    
    boolean completeSwap(int swapId);
    
    List<Map<String, Object>> getBatterySwapHistory(int batteryId);
}
