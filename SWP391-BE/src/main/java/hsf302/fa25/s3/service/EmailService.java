package hsf302.fa25.s3.service;

import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.mode:smtp}")
    private String appMailMode;

    @Value("${spring.mail.username}")
    private String mailFrom;


    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // 📧 Gửi OTP dạng text
    public void sendOtpEmail(String to, String otp) {
        if ("log".equalsIgnoreCase(appMailMode)) {
            System.out.println("📧 [LOG] OTP -> " + to + " : " + otp);
            return;
        }

        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(mailFrom);
            msg.setTo(to);
            msg.setSubject("Mã xác thực tài khoản (OTP)");
            msg.setText("Mã OTP của bạn là: " + otp + "\nMã có hiệu lực trong 5 phút.");
            mailSender.send(msg);
            System.out.println("✅ Đã gửi OTP tới: " + to);
        } catch (Exception e) {
            System.err.println("❌ Lỗi gửi OTP: " + e.getMessage());
        }
    }

    // 🔗 Gửi link đặt lại mật khẩu (text)
    public void sendResetEmail(String toEmail, String link) {
        if ("log".equalsIgnoreCase(appMailMode)) {
            System.out.println("🔗 [LOG] Reset link -> " + toEmail + " : " + link);
            return;
        }

        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(mailFrom);
            msg.setTo(toEmail);
            msg.setSubject("Đặt lại mật khẩu - EV System");
            msg.setText("Bạn đã yêu cầu đặt lại mật khẩu.\nNhấn vào liên kết sau trong vòng 15 phút:\n" + link);
            mailSender.send(msg);
            System.out.println("✅ Đã gửi email đặt lại mật khẩu tới: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Lỗi gửi reset email: " + e.getMessage());
        }
    }

    // 🌈 Gửi email HTML (đẹp, có định dạng)
    public void sendHtmlEmail(String to, String otp) {
        if ("log".equalsIgnoreCase(appMailMode)) {
            System.out.println("📧 [LOG HTML] OTP -> " + to + " : " + otp);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(to);
            helper.setSubject("🔐 Xác thực tài khoản EV System");

            // Bạn có thể thay URL logo bằng ảnh thật của EV System
            String htmlContent = """
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; padding: 20px;'>
                    <div style='text-align: center;'>
                        <h2 style='color:#02CAA9'>Xác thực tài khoản của bạn</h2>
                    </div>
                    <p style='font-size: 16px; color:#333;'>Xin chào,</p>
                    <p style='font-size: 16px; color:#333;'>Mã OTP của bạn là:</p>
                    <p style='font-size: 28px; font-weight: bold; color: #02CAA9; text-align: center;'>%s</p>
                    <p style='font-size: 15px; color:#555;'>Mã có hiệu lực trong <b>5 phút</b>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
                    <hr style='margin-top:20px;'>
                    <p style='font-size: 13px; color:#888; text-align:center;'>© 2025 EV System. All rights reserved.</p>
                </div>
            """.formatted(otp);

            helper.setText(htmlContent, true);
            mailSender.send(message);

            System.out.println("✅ Đã gửi HTML OTP tới: " + to);
        } catch (MessagingException e) {
            System.err.println("❌ Lỗi gửi email HTML: " + e.getMessage());
        }
    }
    @PostConstruct
    public void testMailConfig() {
        System.out.println("✅ SMTP mail configured successfully.");
        System.out.println("Host: smtp.gmail.com");
    }
}