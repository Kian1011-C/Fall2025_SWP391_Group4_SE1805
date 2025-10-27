package hsf302.fa25.s3.controller;

import hsf302.fa25.s3.model.Swap;
import hsf302.fa25.s3.dao.SwapDao;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for managing battery swap operations and history
 */
@RestController
@RequestMapping("/api")
public class SwapController {

    private final SwapDao swapDao = new SwapDao();

    /**
     * Get swap history for a specific user
     * 
     * @param userId User ID to get swap history for
     * @param limit Optional limit for number of records (default: 10)
     * @return Map with swap history data
     */
    @GetMapping("/users/{userId}/swaps")
    public Map<String, Object> getUserSwapHistory(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        
        System.out.println("SwapController: Getting swap history for user: " + userId + " with limit: " + limit);
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Swap> swaps = swapDao.getSwapsByUserId(userId);
            
            // Apply limit if needed
            if (swaps != null && swaps.size() > limit) {
                swaps = swaps.subList(0, limit);
            }
            
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
            
        } catch (Exception e) {
            System.err.println("SwapController Error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy lịch sử đổi pin: " + e.getMessage());
            response.put("data", null);
        }
        
        return response;
    }

    /**
     * Get all swaps (admin function)
     * 
     * @return Map with all swaps data
     */
    @GetMapping("/swaps")
    public Map<String, Object> getAllSwaps() {
        System.out.println("SwapController: Getting all swaps");
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Swap> swaps = swapDao.getAllSwaps();
            
            response.put("success", true);
            response.put("data", swaps);
            response.put("message", "Lấy tất cả lịch sử đổi pin thành công");
            response.put("total", swaps != null ? swaps.size() : 0);
            
        } catch (Exception e) {
            System.err.println("SwapController Error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy lịch sử đổi pin: " + e.getMessage());
            response.put("data", null);
        }
        
        return response;
    }

    /**
     * Create a new battery swap record
     * 
     * @param swap Swap object to create
     * @return Map with created swap data
     */
    @PostMapping("/swaps")
    public Map<String, Object> createSwap(@RequestBody Swap swap) {
        System.out.println("SwapController: Creating new swap for user: " + swap.getUserId());
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean created = swapDao.createSwap(swap);
            
            if (created) {
                response.put("success", true);
                response.put("data", swap);
                response.put("message", "Tạo bản ghi đổi pin thành công");
            } else {
                response.put("success", false);
                response.put("message", "Không thể tạo bản ghi đổi pin");
                response.put("data", null);
            }
            
        } catch (Exception e) {
            System.err.println("SwapController Error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Lỗi khi tạo bản ghi đổi pin: " + e.getMessage());
            response.put("data", null);
        }
        
        return response;
    }

    /**
     * Create an automatic swap record (system-generated)
     * This endpoint uses the DAO method that defaults status to 'AUTO' and sets swap_date to current time.
     * Accessible at POST /api/swaps/auto
     */
    @PostMapping("/swaps/auto")
    public Map<String, Object> createAutoSwap(@RequestBody Swap swap) {
        System.out.println("SwapController: Creating AUTO swap for user: " + swap.getUserId());
        Map<String, Object> response = new HashMap<>();

        try {
            boolean created = swapDao.createAutoSwap(swap);

            if (created) {
                response.put("success", true);
                response.put("data", swap);
                response.put("message", "Tạo bản ghi auto swap thành công");
            } else {
                response.put("success", false);
                response.put("message", "Không thể tạo bản ghi auto swap");
                response.put("data", null);
            }

        } catch (Exception e) {
            System.err.println("SwapController Error (auto): " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Lỗi khi tạo bản ghi auto swap: " + e.getMessage());
            response.put("data", null);
        }

        return response;
    }
}