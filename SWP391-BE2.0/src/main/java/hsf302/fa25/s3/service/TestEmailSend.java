package hsf302.fa25.s3.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class TestEmailSend {

    @Autowired
    private JavaMailSender mailSender;

    @PostConstruct
    public void sendTestEmail() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("yourtestmail@gmail.com"); // 👉 Thay bằng email bạn muốn nhận thử
            message.setSubject("✅ Test Gmail SMTP from Spring Boot");
            message.setText("Xin chào!\n\nGmail SMTP đã hoạt động thành công 🎉\n\n- EV Driver System");

            mailSender.send(message);

            System.out.println("✅ Email sent successfully to yourtestmail@gmail.com");
        } catch (Exception e) {
            System.out.println("❌ Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}