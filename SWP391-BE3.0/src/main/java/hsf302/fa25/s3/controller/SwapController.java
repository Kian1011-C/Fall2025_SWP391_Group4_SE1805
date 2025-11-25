package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.model.Swap;
import hsf302.fa25.s3.service.SwapService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SwapController {

    private final SwapService swapService;

    public SwapController(SwapService swapService) {
        this.swapService = swapService;
    }

    @GetMapping("/users/{userId}/swaps")
    public Map<String, Object> getUserSwapHistory(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        
        System.out.println("SwapController: Getting swap history for user: " + userId);
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Swap> swaps = swapService.getSwapsByUserId(userId);

            if (swaps != null && !swaps.isEmpty()) {
                System.out.println("SwapController: Found " + swaps.size() + " swaps for user: " + userId);
                response.put("success", true);
                response.put("data", swaps);
                response.put("message", "Lấy lịch sử đổi pin thành công");
                response.put("total", swaps.size());
            } else {
                System.out.println("SwapController: No swaps found for user: " + userId);
                response.put("success", true);
                response.put("data", List.of());
                response.put("message", "Không có lịch sử đổi pin");
                response.put("total", 0);
            }
            
        } catch (IllegalArgumentException e) {
            System.err.println("SwapController: Validation error: " + e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", List.of());
        } catch (Exception e) {
            System.err.println("SwapController: Error fetching swap history for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy lịch sử đổi pin: " + e.getMessage());
            response.put("data", List.of());
        }
        
        return response;
    }

    @GetMapping("/swaps")
    public Map<String, Object> getAllSwaps() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Swap> swaps = swapService.getAllSwaps();
            
            response.put("success", true);
            response.put("data", swaps);
            response.put("total", swaps != null ? swaps.size() : 0);
            response.put("message", "Lấy danh sách tất cả giao dịch đổi pin thành công");
            
        } catch (Exception e) {
            System.err.println("SwapController: Error fetching all swaps: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách giao dịch: " + e.getMessage());
            response.put("data", List.of());
        }
        
        return response;
    }

    @GetMapping("/swaps/{swapId}")
    public Map<String, Object> getSwapById(@PathVariable Long swapId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Swap swap = swapService.getSwapById(swapId);
            
            if (swap != null) {
                response.put("success", true);
                response.put("data", swap);
                response.put("message", "Lấy thông tin giao dịch thành công");
            } else {
                response.put("success", false);
                response.put("message", "Không tìm thấy giao dịch với ID: " + swapId);
            }
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        } catch (Exception e) {
            System.err.println("SwapController: Error fetching swap " + swapId + ": " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy thông tin giao dịch: " + e.getMessage());
        }
        
        return response;
    }
}
