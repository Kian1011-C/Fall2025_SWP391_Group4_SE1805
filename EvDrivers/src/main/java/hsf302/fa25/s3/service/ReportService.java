package hsf302.fa25.s3.service;

import hsf302.fa25.s3.dao.ReportDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportDao reportDao;

    public double getTotalRevenue() {
        return reportDao.getTotalRevenue();
    }

    public double getRevenueInRange(String from, String to) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date d1 = sdf.parse(from);
            Date d2 = sdf.parse(to);
            return reportDao.getRevenueInRange(d1, d2);
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format. Use yyyy-MM-dd");
        }
    }
}