package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.User;

public interface AuthService {


    User login(String email, String password);


    boolean logout(String token);
}
