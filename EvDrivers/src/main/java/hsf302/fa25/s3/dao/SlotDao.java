package hsf302.fa25.s3.dao;

import hsf302.fa25.s3.context.ConnectDB;
import hsf302.fa25.s3.model.Slot;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class SlotDao {

    public List<Slot> getSlotsByTowerId(int towerId) {
        List<Slot> list = new ArrayList<>();
        String sql = "SELECT * FROM Slots WHERE tower_id=?";
        try (Connection conn = ConnectDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, towerId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Slot s = new Slot();
                s.setSlotId(rs.getInt("slot_id"));
                s.setTowerId(rs.getInt("tower_id"));
                s.setSlotNumber(rs.getInt("slot_number"));
                s.setStatus(rs.getString("status"));
                list.add(s);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}
