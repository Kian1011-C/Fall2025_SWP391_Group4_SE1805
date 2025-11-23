package hsf302.fa25.s3.test;

import hsf302.fa25.s3.utils.ConnectDB;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

public class DatabaseTest {
    public static void main(String[] args) {
        System.out.println("=== Kiểm tra kết nối Database ===");
        
        Connection conn = ConnectDB.getConnection();
        
        if (conn != null) {
            try {
                DatabaseMetaData metaData = conn.getMetaData();
                System.out.println("Database: " + metaData.getDatabaseProductName());
                System.out.println("Version: " + metaData.getDatabaseProductVersion());
                System.out.println("URL: " + metaData.getURL());
                System.out.println("User: " + metaData.getUserName());
                
                System.out.println("\n=== Danh sách Tables ===");
                ResultSet tables = metaData.getTables(null, null, "%", new String[]{"TABLE"});
                while (tables.next()) {
                    String tableName = tables.getString("TABLE_NAME");
                    System.out.println("- " + tableName);
                }
                tables.close();
                
            } catch (Exception e) {
                System.err.println("Lỗi khi lấy metadata: " + e.getMessage());
            } finally {
                ConnectDB.closeConnection(conn);
            }
        } else {
            System.err.println("Không thể kết nối database!");
        }
    }
}