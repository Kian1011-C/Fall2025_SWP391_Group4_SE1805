package hsf302.fa25.s3.repository;

public class Maintest {
    public static void main(String[] args) {
        UserRepo dao = new UserRepo();
        dao.getAllUsers().forEach(System.out::println);
    }
}
