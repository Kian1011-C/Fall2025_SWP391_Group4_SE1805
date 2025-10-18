package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.Tower;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class TowerDao {

    public List<Tower> getTowersByStationId(int stationId) {
        List<Tower> list = new ArrayList<>();
        String sql = "SELECT * FROM Towers WHERE station_id=? AND status='active'";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, stationId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Tower t = new Tower();
                t.setTowerId(rs.getInt("tower_id"));
                t.setStationId(rs.getInt("station_id"));
                t.setTowerNumber(rs.getInt("tower_number"));
                t.setStatus(rs.getString("status"));
                list.add(t);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}
