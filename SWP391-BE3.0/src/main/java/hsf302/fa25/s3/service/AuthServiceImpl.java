package hsf302.fa25.s3.service;

import hsf302.fa25.s3.model.User;
import hsf302.fa25.s3.repository.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {


    private final UserRepo userRepo = new UserRepo();

    @Override
    public User login(String email, String password) {

        if (email == null || password == null) {
            return null;
        }

        return userRepo.checkLogin(email, password);
    }

    @Override
    public boolean logout(String token) {
        // Hiện tại bạn chưa lưu token đâu cả → chỉ check token có gửi lên không
        return token != null && !token.isBlank();
    }
}