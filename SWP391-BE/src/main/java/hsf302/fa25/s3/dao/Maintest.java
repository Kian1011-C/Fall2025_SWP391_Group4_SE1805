package hsf302.fa25.s3.dao;

public class Maintest {
    public static void main(String[] args) {
        UserDao dao = new UserDao();
        dao.getAllUsers().forEach(System.out::println);
    }
}
