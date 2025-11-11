package hsf302.fa25.s3.context;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectDB {

    private static final String URL =
            "jdbc:sqlserver://localhost:1433;"
                    + "databaseName=ev_battery;"
                    + "encrypt=true;"
                    + "trustServerCertificate=true;";

    private static final String USER = "sa";
    private static final String PASSWORD = "12345";

    public static Connection getConnection() {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Kết nối database thành công!");
        } catch (SQLException e) {
            System.err.println("Kết nối thất bại: " + e.getMessage());
        }
        return conn;
    }

    public static void closeConnection(Connection conn) {
        try {
            if (conn != null && !conn.isClosed()) {
                conn.close();
                System.out.println("Đã đóng kết nối database.");
            }
        } catch (SQLException e) {
            System.err.println("Lỗi khi đóng kết nối: " + e.getMessage());
        }
    }
}